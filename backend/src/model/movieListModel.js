
// const { pool } = require('../config/db');
import { pool } from "../config/db.js";


export async function findUserByEmail(email) {
  const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return rows[0]

}
export async function createMovieUserModel(email) {
  const query = `
    INSERT INTO users ( email )
    VALUES ($1 )
     RETURNING *;
    `;
  const values = [email];
  const { rows } = await pool.query(query, values);
  return rows[0]

}

export async function delateProfileByID(id) {
  try {
    console.log('id in model', id);
    const query = `
      DELETE FROM users 
        WHERE id = $1::uuid
      RETURNING id;
    `;

    const result = await pool.query(query, [id]);
    console.log('[DB RESULT]', result.rowCount, result.rows);

    if (result.rows.length === 0) {
      return { success: false, message: 'User not found' };
    }

    return { success: true, userId: result.rows[0].id };

  } catch (err) {
    console.error('[DB ERROR]', err.message);
    return { success: false, message: 'Database delete failed' };
  }
}

export async function viewProfile() {
  try {

    const query = `
      SELECT * FROM users 
    
    `;

    const { rows } = await pool.query(query);
    return rows;

  } catch (err) {
    console.error('[DB ERROR]', err.message);
    return { success: false, message: 'Database delete failed' };
  }
} 