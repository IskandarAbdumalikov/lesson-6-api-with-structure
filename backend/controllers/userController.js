import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Users, validateUser } from "../models/user.js";

const JWT_SECRET = "iskandar";

export const registerUser = async (req, res) => {
  const { error } = validateUser(req.body);
  if (error)
    return res.status(400).json({
      msg: error.details[0].message,
      variant: "error",
      payload: null,
    });

  const { username, password } = req.body;

  const existingUser = await Users.findOne({ username });
  if (existingUser)
    return res.status(400).json({
      msg: "User already exists.",
      variant: "error",
      payload: null,
    });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = new Users({
    ...req.body,
    password: hashedPassword,
  });

  try {
    const savedUser = await user.save();
    res.status(201).json({
      msg: "User registered successfully",
      variant: "success",
      payload: savedUser,
    });
  } catch (err) {
    res.status(500).json({
      msg: err.message,
      variant: "error",
      payload: null,
    });
  }
};

export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  const user = await Users.findOne({ username });
  if (!user)
    return res.status(400).json({
      msg: "Invalid username or password.",
      variant: "error",
      payload: null,
    });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword)
    return res.status(400).json({
      msg: "Invalid username or password.",
      variant: "error",
      payload: null,
    });

  const token = jwt.sign({ _id: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: "1h",
  });

  res.status(200).json({
    msg: "Logged in successfully",
    variant: "success",
    payload: { token },
  });
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await Users.find();
    res.status(200).json({
      msg: "Users fetched successfully",
      variant: "success",
      payload: users,
    });
  } catch (err) {
    res.status(500).json({
      msg: err.message,
      variant: "error",
      payload: null,
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await Users.findById(req.params.id);
    if (!user)
      return res.status(404).json({
        msg: "User not found",
        variant: "error",
        payload: null,
      });
    res.status(200).json({
      msg: "User fetched successfully",
      variant: "success",
      payload: user,
    });
  } catch (err) {
    res.status(500).json({
      msg: err.message,
      variant: "error",
      payload: null,
    });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, password, fname, lname, age, gender, budget } = req.body;

  const { error } = validateUser(req.body);
  if (error)
    return res.status(400).json({
      msg: error.details[0].message,
      variant: "error",
      payload: null,
    });

  try {
    const user = await Users.findById(id);
    if (!user)
      return res.status(404).json({
        msg: "User not found",
        variant: "error",
        payload: null,
      });

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    user.username = username || user.username;
    user.fname = fname || user.fname;
    user.lname = lname || user.lname;
    user.age = age || user.age;
    user.gender = gender || user.gender;
    user.budget = budget || user.budget;

    const updatedUser = await user.save();
    res.status(200).json({
      msg: "User updated successfully",
      variant: "success",
      payload: updatedUser,
    });
  } catch (err) {
    res.status(500).json({
      msg: err.message,
      variant: "error",
      payload: null,
    });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await Users.findById(id);
    if (!user)
      return res.status(404).json({
        msg: "User not found",
        variant: "error",
        payload: null,
      });

    await Users.findByIdAndDelete(id);
    res.status(200).json({
      msg: "User deleted successfully",
      variant: "success",
      payload: null,
    });
  } catch (err) {
    res.status(500).json({
      msg: err.message,
      variant: "error",
      payload: null,
    });
  }
};
