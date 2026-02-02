import { neon, NeonQueryFunction } from '@neondatabase/serverless';
import { drizzle, NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from '@/drizzle/schema';

let sql: NeonQueryFunction<false, false> | null = null;
let db: NeonHttpDatabase<typeof schema> | null = null;

export function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
  }

  if (!sql) {
    sql = neon(process.env.DATABASE_URL);
  }

  if (!db) {
    db = drizzle(sql, { schema });
  }

  return db;
}

export { db };
