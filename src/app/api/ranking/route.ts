import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { userScores } from '@/drizzle/schema';
import { desc, eq, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const sessionId = searchParams.get('sessionId');
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  try {
    const db = getDb();

    // 전체 랭킹 (카테고리별 또는 전체)
    let topScoresQuery;
    if (category && category !== 'all') {
      topScoresQuery = db
        .select({
          id: userScores.id,
          sessionId: userScores.sessionId,
          category: userScores.category,
          score: userScores.score,
          correctCount: userScores.correctCount,
          totalCount: userScores.totalCount,
          createdAt: userScores.createdAt,
        })
        .from(userScores)
        .where(eq(userScores.category, category))
        .orderBy(desc(userScores.score), desc(userScores.createdAt))
        .limit(limit);
    } else {
      topScoresQuery = db
        .select({
          id: userScores.id,
          sessionId: userScores.sessionId,
          category: userScores.category,
          score: userScores.score,
          correctCount: userScores.correctCount,
          totalCount: userScores.totalCount,
          createdAt: userScores.createdAt,
        })
        .from(userScores)
        .orderBy(desc(userScores.score), desc(userScores.createdAt))
        .limit(limit);
    }

    const topScores = await topScoresQuery;

    // 내 최고 점수 (sessionId가 있는 경우)
    let myBestScores = null;
    if (sessionId) {
      const myScores = await db
        .select({
          category: userScores.category,
          bestScore: sql<number>`MAX(${userScores.score})`,
          totalAttempts: sql<number>`COUNT(*)`,
        })
        .from(userScores)
        .where(eq(userScores.sessionId, sessionId))
        .groupBy(userScores.category);

      myBestScores = myScores;
    }

    // 카테고리별 통계
    const categoryStats = await db
      .select({
        category: userScores.category,
        totalPlayers: sql<number>`COUNT(DISTINCT ${userScores.sessionId})`,
        avgScore: sql<number>`ROUND(AVG(${userScores.score}), 1)`,
        totalAttempts: sql<number>`COUNT(*)`,
      })
      .from(userScores)
      .groupBy(userScores.category);

    return NextResponse.json({
      success: true,
      data: {
        topScores,
        myBestScores,
        categoryStats,
      },
    });
  } catch (error) {
    console.error('Ranking fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch ranking' },
      { status: 500 }
    );
  }
}
