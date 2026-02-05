import { config } from 'dotenv';
config({ path: '.env.local' });
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { quizzes as quizzesTable } from '../drizzle/schema';
import { quizzes as quizData } from '../src/data/quizzes';

async function seed() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL 환경변수가 설정되지 않았습니다.');
  }

  console.log('🌱 데이터베이스 시딩 시작...');

  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql);

  try {
    // 기존 데이터 삭제
    console.log('📦 기존 퀴즈 데이터 삭제 중...');
    await db.delete(quizzesTable);

    // 새 데이터 삽입 (QuizItem 형식을 DB 형식으로 변환)
    console.log('📝 새 퀴즈 데이터 삽입 중...');
    const dbData = quizData.map((q) => ({
      category: q.category,
      content: q.content,
      isScam: q.isScam,
      explanation: q.explanation,
      scamPoints: q.scamPoints || null,
    }));

    await db.insert(quizzesTable).values(dbData);

    console.log(`✅ ${quizData.length}개의 퀴즈 데이터 시딩 완료!`);

    // 카테고리별 개수 출력
    const categories = ['smishing', 'secondhand', 'alba', 'sns'] as const;
    for (const cat of categories) {
      const count = quizData.filter((q) => q.category === cat).length;
      const scamCount = quizData.filter((q) => q.category === cat && q.isScam).length;
      const legitimateCount = count - scamCount;
      console.log(`   - ${cat}: ${count}개 (사기 ${scamCount}, 정상 ${legitimateCount})`);
    }

    // 전체 사기/정상 비율 출력
    const totalScam = quizData.filter((q) => q.isScam).length;
    const totalLegitimate = quizData.length - totalScam;
    const scamPercent = Math.round((totalScam / quizData.length) * 100);
    console.log(`\n📊 전체 비율: 사기 ${totalScam}개 (${scamPercent}%) / 정상 ${totalLegitimate}개 (${100 - scamPercent}%)`);
  } catch (error) {
    console.error('❌ 시딩 실패:', error);
    process.exit(1);
  }

  console.log('🎉 시딩 완료!');
}

seed();
