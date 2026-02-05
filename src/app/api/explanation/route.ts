import { NextRequest, NextResponse } from 'next/server';
import { generateExplanation } from '@/lib/openai';
import { checkRateLimit, getClientIP } from '@/lib/rate-limit';

// AI API Rate Limit: IP당 분당 10회
const RATE_LIMIT_CONFIG = {
  maxRequests: 10,
  windowMs: 60 * 1000, // 1분
};

export async function POST(request: NextRequest) {
  // Rate Limit 체크
  const clientIP = getClientIP(request);
  const rateLimitResult = checkRateLimit(`explanation:${clientIP}`, RATE_LIMIT_CONFIG);

  if (!rateLimitResult.success) {
    return NextResponse.json(
      {
        success: false,
        error: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)),
          'X-RateLimit-Remaining': '0',
        }
      }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid JSON body' },
      { status: 400 }
    );
  }

  try {
    const { content, isScam, scamPoints } = body;

    if (!content || typeof isScam !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'Invalid request body' },
        { status: 400 }
      );
    }

    // content 길이 제한 (비용 및 보안)
    if (typeof content !== 'string' || content.length > 2000) {
      return NextResponse.json(
        { success: false, error: 'Content too long or invalid' },
        { status: 400 }
      );
    }

    const explanation = await generateExplanation(
      content,
      isScam,
      scamPoints || []
    );

    return NextResponse.json(
      { success: true, explanation },
      {
        headers: {
          'X-RateLimit-Remaining': String(rateLimitResult.remaining),
        }
      }
    );
  } catch (error) {
    console.error('Explanation generation error:', error);

    // Determine appropriate Korean error message
    let errorMessage = 'AI 응답 생성에 실패했습니다. 다시 시도해주세요.';
    let statusCode = 500;

    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      if (message.includes('rate limit') || message.includes('429')) {
        errorMessage = 'AI 서비스가 바쁩니다. 잠시 후 다시 시도해주세요.';
        statusCode = 429;
      } else if (message.includes('empty response')) {
        errorMessage = 'AI 응답이 비어있습니다. 다시 시도해주세요.';
      } else if (message.includes('timeout')) {
        errorMessage = '응답 시간이 초과되었습니다. 다시 시도해주세요.';
      }
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: statusCode }
    );
  }
}
