import express from "express";
import {
  addGoal,
  addMoneyToGoal,
  addTransaction,
  deletedAccount,
  deleteGoal,
  deleteTransaction,
  getGoals,
  getTransactions,
  getTransactionsForChart,
  updateFields,
  userLogin,
  userLogout,
  userProfile,
  userRegister,
} from "../controllers/user.js";
import { isAuthenticated } from "../utils/features.js";

const userRouter = express.Router();

userRouter.post("/register", userRegister);
userRouter.post("/login", userLogin);
userRouter.post("/addtransaction", isAuthenticated, addTransaction);
userRouter.post("/addgoal", isAuthenticated, addGoal);

userRouter.get("/profile", isAuthenticated, userProfile);
userRouter.get("/mytransactions", isAuthenticated, getTransactions);
userRouter.get(
  "/gettransactionforchart",
  isAuthenticated,
  getTransactionsForChart
);
userRouter.get("/mygoals", isAuthenticated, getGoals);
userRouter.get("/logout", isAuthenticated, userLogout);

userRouter.put("/addmoneytogoal/:currGoal", isAuthenticated, addMoneyToGoal);
userRouter.put("/updatedetails", isAuthenticated, updateFields);

userRouter.delete("/deleteaccount", isAuthenticated, deletedAccount);
userRouter.delete("/deletetransaction/:ID", isAuthenticated, deleteTransaction);
userRouter.delete("/deletegoal/:ID", isAuthenticated, deleteGoal);

export default userRouter;
