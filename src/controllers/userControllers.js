import mongoose from "mongoose";
import bcrypt from "bcryptjs";  
import jwt from "jsonwebtoken";
import { UserSchema } from "../models/userModel";   

const User = mongoose.model("User", UserSchema);

export const loginRequired = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    return res.status(401).json({ message: "Unauthorized user!" });
  }
};


export const register = async (req, res) => {
  try {
    const newUser = new User(req.body);
    newUser.hashPassword = bcrypt.hashSync(req.body.password, 10);

    // Save the user and wait for the result
    const user = await newUser.save();

    // To avoid returning the password hash
    user.hashPassword = undefined;

    return res.json(user);
  } catch (err) {
    return res.status(400).send({
      message: err.message || err,
    });
  }
};


export const login = async (req, res) => {
  try {
    // Find the user by email
    const user = await User.findOne({ email: req.body.email });

    // If the user doesn't exist, return an error
    if (!user) {
      return res.status(401).json({ message: "Authentication failed. User not found." });
    }

    // Check if the password matches
    const isMatch = await user.comparePassword(req.body.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Authentication failed. Wrong password." });
    }

    // If password matches, create a token
    const token = jwt.sign(
      { email: user.email, username: user.username, _id: user._id },
      "RESTFULAPIs"
    );

    // Return the token
    return res.json({ token });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

  