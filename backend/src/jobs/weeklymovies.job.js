import cron from "node-cron";
import { pool } from "../config/db.js";
import { sendWeeklyMoviesToOne } from "./sendWeeklyMoviesEmail.js";

async function getSubscribedEmails() {
  const { rows } = await pool.query("SELECT email FROM users");
  return rows.map((r) => r.email);
}

export function startWeeklyMoviesCron() {
  cron.schedule(
    "0 15 * * 5",
    async () => {
      try {
        const emails = await getSubscribedEmails();

        if (!emails.length) {
          console.log("ℹ No subscribed emails found. Skipping weekly mail.");
          return;
        }

        for (const to of emails) {
          try {
            await sendWeeklyMoviesToOne(to);   // ✅ reuse
            console.log(" Sent to:", to);
          } catch (e) {
            console.error(" Failed for:", to, e?.message || e);
          }
        }

        console.log(` Weekly emails done. Total: ${emails.length}`);
      } catch (err) {
        console.error(" Weekly cron job failed:", err?.message || err);
      }
    },
    { timezone: "Asia/Dhaka" }
  );
}
