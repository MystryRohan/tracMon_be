import mongoose from "mongoose";

const GoalSchema = new mongoose.Schema({
  name: String,
  price: Number,
  saved: { type: Number, default: 0 },
  createdBy: String,
  createdAt: { type: Date, default: new Date(Date.now()) },
});

export const Goal = mongoose.model("Goal", GoalSchema);
