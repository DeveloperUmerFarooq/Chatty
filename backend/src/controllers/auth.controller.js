import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

//Sign Up
export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    //Empty data validation
    if (!fullName || !email || !password)
      return res
        .status(400)
        .json({ success: false, message: "All fields are required!" });

    //Password validation
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    //Check User Existence
    const user = await User.findOne({ email });
    if (user)
      return res
        .status(400)
        .json({ success: false, message: "User Already Exists!" });

    //hash passoword
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create new User
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    //Authenticate User with JWT Token
    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        success: true,
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        avatar: newUser.avatar,
      });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid User Data" });
    }
  } catch (error) {
    console.log("Error in Signup", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

//login
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials!" });
    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword)
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials!" });

    generateToken(user._id, res);

    res.status(200).json({
      success: true,
      _id: user._id,
      createdAt:user.createdAt,
      fullName: user.fullName,
      email: user.email,
      avatar: user.avatar,
    });
  } catch (error) {
    console.log("Error in Login", error.message);
    res.status(500).json({ success: false, message: "Interal Server Error" });
  }
};

//logout
export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ success: true, message: "Logout Successfully!" });
  } catch (error) {
    console.log("Error in Logout", error.message);
    res.status(500).json({ success: true, message: "Internal Server Error" });
  }
};

//Update Profile
export const updateProfile = async (req, res) => {
  const { src } = req.body;
  try {
    const userId = req.user._id;
    if (!src) {
      return res
        .status(400)
        .json({ success: true, message: "Avatar is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(src);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar: uploadResponse.secure_url },
      { new: true }
    );
    res
      .status(200)
      .json({
        success: true,
        message: "Avatar Updated Successfully",
        updatedUser,
      });
  } catch (error) {
    console.log("Error in updateProfile", error.message);
    res.status(500).json({ success: true, message: "Internal Server Error" });
  }
};

//checkAuth
export const checkAuth = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
