


import axios from "axios";
import { getWeeklyTop5 } from "../services/weeklyTopRatingMovies.service.js";
import { weeklyMoviesTemplate } from "../template/weeklyTemplates.js";
import { sendEmail } from "../utils/mailer.js";



export async function sendWeeklyMoviesToOne(to, appUrlFromReq, unsubscribeLink ) {


  
    // const proto = "https"; // force https (Vercel always https)
    // const host = appUrlFromReq?.replace(/^https?:\/\//, "");
    // const appUrl = `${proto}://${host}`;
    // const appUrl = appUrlFromReq;

    // new 
    const appUrl = process.env.BACKEND_URL || appUrlFromReq;

    console.log("FINAL unsubscribe Link =", unsubscribeLink); 

    if (!appUrl) throw new Error("APP_URL missing");

    //  NEW: compute weekly top 5 (movie + tv)
    const top5 = await getWeeklyTop5({ appUrl });
    // console.log(" top5 sample =", top5[0]);

    const html = weeklyMoviesTemplate({
        movies: top5,
        title: "",
        introText: "5 Things to Watch This Week",
        unsubscribeLink,
    });



    // const html = weeklyMoviesTemplate({ movies: top5, title: " " });
    const result = await sendEmail({
        to,
        subject: "5 new shows and movies to watch this week",
        html,
    });

    // console.log(" sendMail result messageId:", result?.messageId);
    return result;
}


