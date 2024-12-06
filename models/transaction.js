import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  createdBy: String,
  createdAt: { type: Date, default: Date.now },
});

export const Transaction = mongoose.model("Transaction", TransactionSchema);
