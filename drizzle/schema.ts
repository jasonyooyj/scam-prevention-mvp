import { pgTable, serial, varchar, text, boolean, timestamp, integer } from 'drizzle-orm/pg-core';

export const quizzes = pgTable('quizzes', {
  id: serial('id').primaryKey(),
  category: varchar('category', { length: 50 }).notNull(), // 'alba', 'secondhand', 'smishing', 'sns'
  content: text('content').notNull(), // 실제 메시지 내용
  isScam: boolean('is_scam').notNull(), // 사기 여부
  explanation: text('explanation'), // 기본 해설
  scamPoints: text('scam_points').array(), // 사기 판별 포인트 (3개)
  createdAt: timestamp('created_at').defaultNow(),
});

export const userScores = pgTable('user_scores', {
  id: serial('id').primaryKey(),
  sessionId: varchar('session_id', { length: 100 }).notNull(),
  category: varchar('category', { length: 50 }).notNull(),
  score: integer('score').notNull(),
  correctCount: integer('correct_count').notNull(),
  totalCount: integer('total_count').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export type Quiz = typeof quizzes.$inferSelect;
export type NewQuiz = typeof quizzes.$inferInsert;
export type UserScore = typeof userScores.$inferSelect;
export type NewUserScore = typeof userScores.$inferInsert;
