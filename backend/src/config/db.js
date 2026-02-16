import { Pool } from 'pg';
 export const pool  = new Pool (
  {
host: "localhost",
user: "postgres",
port: 5432,
password: "admin",
database:"movies"
  });

 export async function connectToDb() {
  try{
    const connectClient = await pool.connect();
    console.log('postgresql connected with pg')
    connectClient.release();

  }catch(err){
    console.error('Database connection failed', err)
  }
  
}
// export default {pool, connectToDb}
