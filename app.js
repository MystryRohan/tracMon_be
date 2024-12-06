import cookieParser from "cookie-parser";
import { config } from "dotenv";
import express from "express";
import userRouter from "./routes/user.js";
import cors from "cors";

export const app = express();

config({ path: "./utils/config.env" });

//using middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: [process.env.FRONTEND_URL1, process.env.FRONTEND_URL2,process.env.FRONTEND_URL3],
    methods: ["POST", "PUT", "GET", "DELETE"],
  })
);

app.use("/api/v1/", userRouter);

app.get("/", (req, res) => {
  res.send("tracMon");
});
