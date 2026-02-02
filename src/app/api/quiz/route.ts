import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { quizzes } from '@/drizzle/schema';
import { eq, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  try {
    const db = getDb();
    let query;

    if (category && category !== 'random') {
      // 특정 카테고리에서 랜덤하게 선택
      query = db
        .select()
        .from(quizzes)
        .where(eq(quizzes.category, category))
        .orderBy(sql`RANDOM()`)
        .limit(limit);
    } else {
      // 전체 카테고리에서 랜덤하게 선택
      query = db
        .select()
        .from(quizzes)
        .orderBy(sql`RANDOM()`)
        .limit(limit);
    }

    const results = await query;

    return NextResponse.json({
      success: true,
      data: results,
      count: results.length,
    });
  } catch (error) {
    console.error('Quiz fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch quizzes' },
      { status: 500 }
    );
  }
}
