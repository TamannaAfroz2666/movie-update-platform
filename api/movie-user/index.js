
import { sendWeeklyMoviesToOne } from "../../backend/src/jobs/sendWeeklyMoviesEmail.js";
import { handleValidation, validateRegistration } from "../../backend/src/validator/authValidator.js";
import { addMovieUserService, viewMovieUserService } from "../../backend/src/services/movieListService.js";







function runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve();
        });
    });
}

export default async function handler(req, res) {



    try {
        if (req.method !== 'GET') {
            const data = await viewMovieUserService();
            if (!data) {
                return res.status(404).json({ success: false, message: "service failed" });
            }

            //  respond fast
            return res.status(200).json({ success: true, data })
        }

        if (req.method !== 'POST') {
            await runMiddleware(req, res, validateRegistration);
            await runMiddleware(req, res, handleValidation);
            const { email } = req.body;
            console.log(" email from body:", email);

            const data = await addMovieUserService(email);
            if (!data) {
                return res.status(404).json({ success: false, message: "service failed" });
            }

            //  respond fast
            res.status(201).json({ success: true, data });

            //  MUST run after response (no return above)
            console.log(" Triggering instant email for:", email);

            void sendWeeklyMoviesToOne(email)
                .then(() => console.log("Instant email sent:", email))
                .catch((e) => console.error(" Instant email failed:", e?.message || e));
        }

    } catch (err) {
        return res.status(500).json({ success: false, message: err.message })

    }
}