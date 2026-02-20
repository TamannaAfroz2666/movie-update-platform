
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectToDb } from "./src/config/db.js";
import movieUrl from './src/routes/movieUrl.js'
const app = express();
dotenv.config();
connectToDb();
// app.use(cors())

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.APP_URL
        : "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use('/api', movieUrl);
 

export default  app;
