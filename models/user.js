import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: String,
  name: String,
  password: String,
  salary: { type: Number },
  entertainment: { type: Number, default: 0 },
  entertainmentBudget: { type: Number },
  rent: { type: Number, default: 0 },
  rentBudget: { type: Number },
  food: { type: Number, default: 0 },
  foodBudget: { type: Number },
  travel: { type: Number, default: 0 },
  travelBudget: { type: Number },
  investment: { type: Number, default: 0 },
  investmentBudget: { type: Number, default: 0 },
  totalSpendThisWeek: { type: Number, default: 0 },
  totalSpendLastWeek: { type: Number, default: 0 },
  totalSpendThisMonth: { type: Number, default: 0 },
  totalSpendLastMonth: { type: Number, default: 0 },
});

export const User = mongoose.model("User", UserSchema);
