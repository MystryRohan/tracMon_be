import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

export const createCookie = (req, res, user, message) => {
  const token = jwt.sign({ _id: user._id }, process.env.SECRET);

  res
    .cookie("logged", token, {
      expires: new Date(Date.now() + 9000000),
      httpOnly: true,
    })
    .json({
      success: true,
      message,
    });

  req.user = user;
};

export const isAuthenticated = async (req, res, next) => {
  const { logged } = req.cookies;
  if (!logged) {
    return res.json({
      success: false,
      message: "Please login first...",
    });
  }
  const token = jwt.verify(logged, process.env.SECRET);
  req.user = await User.findById(token._id);
  next();
};
