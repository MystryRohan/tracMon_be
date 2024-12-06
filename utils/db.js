import mongoose from "mongoose";

export const connectDB = () =>
  mongoose
    .connect(process.env.MONGO_URI, { dbName: "tracMon" })
    .then(() => {
      console.log("Database connected...");
    })
    .catch(() => {
      console.log("Error Connecting to Database");
    });
