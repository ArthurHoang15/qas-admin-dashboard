import { Pool, QueryResult } from "pg";

const object = {connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false}};

const pool = new Pool(object);

type QueryParam = string | number | boolean | null | undefined;
declare global {
    var postgres: Pool | undefined;
}

if (!globalThis.postgres) {
    globalThis.postgres = new Pool(object);
}

export const query = async (text: string, params: QueryParam[] = []): Promise<QueryResult> => {
    return pool.query(text, params);
}