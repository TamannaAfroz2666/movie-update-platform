// import { Pool } from 'pg';
//  export const pool  = new Pool (
//   {
// host: "localhost",
// user: "postgres",
// port: 5432,
// password: "admin",
// database:"movies"
//   });

//  export async function connectToDb() {
//   try{
//     const connectClient = await pool.connect();
//     console.log('postgresql connected with pg')
//     connectClient.release();

//   }catch(err){
//     console.error('Database connection failed', err)
//   }
  
// }

import pg from "pg";
const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production"
    ? { rejectUnauthorized: false }
    : false,
});

export async function connectToDb() {
  try {
    const client = await pool.connect();
    console.log("postgresql connected with pg");
    client.release();
  } catch (err) {
    console.error("Database connection failed", err);
  }
}

