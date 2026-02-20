

import { Pool } from "pg";

const connectionString = process.env.DB_URL;

const isLocal =
  connectionString?.includes("localhost") ||
  connectionString?.includes("127.0.0.1");

export const pool = new Pool({
  connectionString,
  ssl: isLocal ? false : { rejectUnauthorized: false },
});

export async function connectToDb() {
  try {
    const client = await pool.connect();
    
    client.release();
  } catch (err) {
    console.error("Database connection failed", err);
  }
}

 