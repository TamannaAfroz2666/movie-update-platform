


import axios from "axios";
import { getWeeklyTop5 } from "../services/weeklyTopRatingMovies.service.js";
import { weeklyMoviesTemplate } from "../template/weeklyTemplates.js";
import { sendEmail } from "../utils/mailer.js";



export async function sendWeeklyMoviesToOne(to, baseUrl) {


  
    const proto = "https"; // force https (Vercel always https)
    const host = appUrlFromReq?.replace(/^https?:\/\//, "");
    const appUrl = `${proto}://${host}`;

    console.log("FINAL APP URL =", appUrl); 

    if (!appUrl) throw new Error("APP_URL missing");

    //  NEW: compute weekly top 5 (movie + tv)
    const top5 = await getWeeklyTop5({ appUrl });
    console.log(" top5 sample =", top5[0]);

    const html = weeklyMoviesTemplate({
        movies: top5,
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


