import { Goal } from "../models/goal.js";
import { Transaction } from "../models/transaction.js";
import { User } from "../models/user.js";
import { createCookie } from "../utils/features.js";
import bcrypt from "bcrypt";

export const userRegister = async (req, res) => {
  const {
    name,
    email,
    password,
    salary,
    entertainmentBudget,
    rentBudget,
    travelBudget,
    foodBudget,
    investmentBudget,
  } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.json({
        success: false,
        message: "Already a tracMon user, Login",
      });
    }

    const hashPass = await bcrypt.hash(password, 7);

    user = await User.create({
      name,
      email,
      password: hashPass,
      salary,
      entertainmentBudget,
      rentBudget,
      travelBudget,
      foodBudget,
      investmentBudget,
    });

    if (!user) {
      return res.json({
        success: false,
        message: "Registeration Failed",
      });
    }
    createCookie(req, res, user, "Welcome to tracMon...");
  } catch (e) {
    res.json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.json({
        success: false,
        message: "Register First!",
      });
    }

    const passCheck = await bcrypt.compare(password, user.password);

    if (!passCheck) {
      return res.json({
        success: false,
        message: "Incorrect Username or Password",
      });
    }
    createCookie(req, res, user, `Welcome,${user.name}`);
  } catch (e) {
    res.json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const updateBalance = async (userID, category, price) => {
  try {
    let user = await User.findOne({ _id: userID });
    //decrease categoryBudget
    user[category] = Number(user[category] - parseInt(price));

    let ttype = category.replace("Budget", "");
    //increase categorySpent
    user[ttype] = Number(user[ttype] + parseInt(price));
    //update totalSpent
    user.totalSpendThisWeek = Number(user.totalSpendThisWeek + parseInt(price));
    user.totalSpendThisMonth = Number(
      user.totalSpendThisMonth + parseInt(price)
    );
    await user.save();
  } catch (e) {
    console.log(e);
  }
};

export const addTransaction = async (req, res) => {
  const { category, name, price } = req.body;
  // console.log(req.user);
  try {
    await Transaction.create({
      name,
      category,
      price,
      createdBy: req.user._id,
      createdAt: new Date(Date.now()),
    });

    updateBalance(req.user._id, category, price);

    return res.json({
      success: true,
      message: "Transaction added",
    });
  } catch (e) {
    return res.json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const addGoal = async (req, res) => {
  const { name, price } = req.body;
  try {
    await Goal.create({ name, price, createdBy: req.user._id });
    return res.json({
      success: true,
      message: "Goal added",
    });
  } catch (e) {
    return res.json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const addMoneyToGoal = async (req, res) => {
  const { currSaved } = req.body;
  const { currGoal } = req.params;

  try {
    let goal = await Goal.findOne({ _id: currGoal });
    goal.saved += parseInt(currSaved);
    await goal.save();
    return res.json({
      success: true,
      message: "Good Goin",
    });
  } catch (e) {
    console.log(e);
    return res.json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      createdBy: req.user._id,
    }).sort({ createdAt: -1 });
    return res.json({
      success: true,
      message: transactions,
    });
  } catch (err) {
    return res.json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const getTransactionsForChart = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      createdBy: req.user._id,
      createdAt: {
        $gte: new Date(
          new Date(new Date().setDate(new Date().getDate() - 6))
        ).setHours(0, 0, 0),
        $lt: new Date(new Date(Date.now()).setHours(23, 59, 59)),
      },
    }).sort({ createdAt: "asc" });
    return res.json({
      success: true,
      message: transactions,
    });
  } catch (err) {
    return res.json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ createdBy: req.user._id });
    return res.json({
      success: true,
      message: goals,
    });
  } catch (err) {
    return res.json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const userProfile = (req, res) => {
  return res.json({
    success: true,
    message: req.user,
  });
};

export const userLogout = (req, res) => {
  res
    .status(200)
    .cookie("logged", "", {
      expires: new Date(Date.now()),
      sameSite: process.env.MODE === "Dev" ? "lax" : "none",
      secure: process.env.MODE === "Dev" ? false : true,
    })
    .json({
      success: true,
      message: "logged out successfully",
    });
};

export const updateFields = async (req, res) => {
  const {
    salary,
    entertainmentBudget,
    foodBudget,
    travelBudget,
    rentBudget,
    investmentBudget,
  } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.user._id },
      {
        salary,
        entertainmentBudget,
        foodBudget,
        travelBudget,
        rentBudget,
        investmentBudget,
      }
    );

    res.json({
      success: true,
      message: "Information Updated",
    });
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      message: "Something went wrong",
    });
  }
};
export const deletedAccount = async (req, res) => {
  try {
    await Goal.deleteMany({ createdBy: req.user._id });
    await Transaction.deleteMany({ createdBy: req.user._id });
    await User.deleteOne({ _id: req.user._id });
    res
      .status(200)
      .cookie("logged", "", {
        expires: new Date(Date.now()),
        sameSite: process.env.MODE === "Dev" ? "lax" : "none",
        secure: process.env.MODE === "Dev" ? false : true,
      })
      .json({
        success: true,
        message: "Account Deleted",
      });
  } catch (err) {
    res.json({
      success: false,
      message: "Something went wrong",
    });
  }
};
export const deleteTransaction = async (req, res) => {
  const { ID } = req.params;
  try {
    const data = await Transaction.findOne({ _id: ID });

    let user = await User.findOne({ _id: req.user._id });
    user[data.category] = Number(user[data.category] + parseInt(data.price));
    let ttype = data.category.replace("Budget", "");

    user[ttype] = Number(user[ttype] - parseInt(data.price));

    user.totalSpendThisWeek = Number(
      user.totalSpendThisWeek - parseInt(data.price)
    );
    user.totalSpendThisMonth = Number(
      user.totalSpendThisMonth - parseInt(data.price)
    );
    await user.save();
    await data.deleteOne();

    res.json({
      success: true,
      message: "Deleted!",
      // user: user,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const deleteGoal = async (req, res) => {
  const { ID } = req.params;
  const data = await Goal.findOneAndDelete({ _id: ID });
  res.json({
    success: true,
    message: data,
  });
};
