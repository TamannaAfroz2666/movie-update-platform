


import axios from "axios";
import { getWeeklyTop5 } from "../services/weeklyTopRatingMovies.service.js";
import { weeklyMoviesTemplate } from "../template/weeklyTemplates.js";
import { sendEmail } from "../utils/mailer.js";

// import { getWeeklyTop5 } from "../services/weeklyTopRatingMovies.service.js";

export async function sendWeeklyMoviesToOne(to) {
 

    const appUrl = process.env.APP_URL; // e.g. http://localhost:4000
    if (!appUrl) throw new Error("APP_URL missing in .env");

    //  NEW: compute weekly top 5 (movie + tv)
    const top5 = await getWeeklyTop5({ appUrl });
    console.log(" top5 sample =", top5[0]); // debug

const html = weeklyMoviesTemplate({
  movies: top5,        //  IMPORTANT
  title: "",
  introText: "5 Things to Watch This Week",
});



// const html = weeklyMoviesTemplate({ movies: top5, title: " " });
    const result = await sendEmail({
        to,
        subject: "5 new shows and movies to watch this week",
        html,
    });

    console.log(" sendMail result messageId:", result?.messageId);
    return result;
}


