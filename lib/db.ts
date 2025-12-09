import { Pool, QueryResult } from "pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    'Missing DATABASE_URL environment variable. Please configure it in your Vercel project settings.'
  );
}

const poolConfig = { connectionString: databaseUrl, ssl: { rejectUnauthorized: false } };

const pool = new Pool(poolConfig);

type QueryParam = string | number | boolean | null | undefined;
declare global {
  var postgres: Pool | undefined;
}

if (!globalThis.postgres) {
  globalThis.postgres = new Pool(poolConfig);
}

export const query = async (text: string, params: QueryParam[] = []): Promise<QueryResult> => {
  return pool.query(text, params);
};