
// const { pool } = require('../config/db');
import { pool } from "../config/db.js";




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
export async function findUserByEmail(email) {
  const q = `
    SELECT id, email, is_subscribed
    FROM users
    WHERE email = $1
    LIMIT 1;
  `;
  const r = await pool.query(q, [email]);
  return r.rows[0] || null;
}

export async function resubscribeUserById(id) {
  const q = `
    UPDATE users
    SET is_subscribed = TRUE,
        unsubscribed_at = NULL
    WHERE id = $1::uuid
    RETURNING id, email, is_subscribed;
  `;
  const r = await pool.query(q, [id]);
  return r.rows[0] || null;
}

export async function delateProfileByID(id) {
  try {
    
  const query = `
    UPDATE users
    SET is_subscribed = FALSE,
        unsubscribed_at = NOW()
    WHERE id = $1::uuid
    RETURNING id;
  `;

    const result = await pool.query(query, [id]);

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

// ✅ তোমার current "delateProfileByID" = actually unsubscribe
export async function unsubscribeUserById(id) {
  try {
    const query = `
      UPDATE users
      SET is_subscribed = FALSE,
          unsubscribed_at = NOW()
      WHERE id = $1::uuid
      RETURNING id;
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return { success: false, message: "User not found" };
    }

    return { success: true, userId: result.rows[0].id };
  } catch (err) {
    console.error("[DB ERROR]", err.message);
    return { success: false, message: "Database unsubscribe failed" };
  }
}


