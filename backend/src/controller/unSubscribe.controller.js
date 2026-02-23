import { updateMovieUserService } from "../services/movieListService.js";
import { verifyUnsubscribeToken } from "../utils/UnsubscribeToken.js";
import jwt from "jsonwebtoken";

export async function unsubscribePageController(req, res) {
    try {
        const { token } = req.query;
        console.log(" HIT GET /api/unsubscribe", req.query);
        if (!token) throw new Error("Token missing");

        verifyUnsubscribeToken(token);

        return res.send(`
            <!doctype html>
            <html>
            <head>
            <meta charset="utf-8">
            <title>Unsubscribe</title>
            <style>
            body{
            font-family:Arial;
            background:#f4f4f4;
            display:flex;
            align-items:center;
            justify-content:center;
            height:100vh;
            margin:0;
            }
            .modal{
            background:#fff;
            padding:30px;
            border-radius:10px;
            box-shadow:0 4px 20px rgba(0,0,0,0.1);
            text-align:center;
            max-width:400px;
            }
            .btn{
            background:#e50914;
            color:#fff;
            border:none;
            padding:12px 20px;
            border-radius:6px;
            cursor:pointer;
            font-size:16px;
            margin-top:15px;
            }
            .btn:hover{
            background:#b20710;
            }
            </style>
            </head>

            <body>

            <div class="modal">

            <h2>Unsubscribe from Reel Box</h2>

            <p>
            Are you sure you want to unsubscribe from weekly movie emails?
            </p>

            <form method="POST" action="/api/unsubscribe">

            <input type="hidden" name="token" value="${token}" />

            <button class="btn" type="submit">
            Confirm Unsubscribe
            </button>

            </form>

            </div>

            </body>
            </html>
        `);
    } catch (err) {
        return res.send("<h2>Invalid or expired unsubscribe link</h2>");
    }
}


export async function unsubscribeActionController(req, res) {
  try {
    const token = req.body?.token || req.query?.token;
    if (!token) return res.status(400).send("Token missing");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded?.type !== "unsubscribe") {
      return res.status(400).send("Invalid token type");
    }

    const userId = decoded.userId;
    if (!userId) return res.status(400).send("Decoded userId missing");

    const result = await updateMovieUserService(userId); // soft unsubscribe/update

    if (!result?.success) return res.send("User already unsubscribed");

    return res.send("✅ Unsubscribed successfully");
  } catch (e) {
    console.error(e);
    return res.status(400).send("Invalid or expired link");
  }
}