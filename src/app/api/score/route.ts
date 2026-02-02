import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { userScores } from '@/drizzle/schema';

export async function POST(request: NextRequest) {
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
    const { sessionId, category, score, correctCount, totalCount } = body;

    // 필수 필드 검증
    if (!sessionId || !category || score === undefined || correctCount === undefined || totalCount === undefined) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 값 검증
    if (typeof score !== 'number' || typeof correctCount !== 'number' || typeof totalCount !== 'number') {
      return NextResponse.json(
        { success: false, error: 'Invalid field types' },
        { status: 400 }
      );
    }

    const db = getDb();

    // 점수 저장
    const result = await db.insert(userScores).values({
      sessionId,
      category,
      score,
      correctCount,
      totalCount,
    }).returning();

    return NextResponse.json({
      success: true,
      data: result[0],
    });
  } catch (error) {
    console.error('Score save error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save score' },
      { status: 500 }
    );
  }
}
