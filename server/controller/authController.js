const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

exports.register = async (req, res) => {
  try {
    console.log("Register Request Body:", req.body);
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ msg: "User exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashed, role: role || "member" });
    console.log("Created User Document:", user);

  res.status(201).json({
  msg:"User created",
  user: {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  },
    token: generateToken(user._id),
  });
  
 } catch (error) {
  console.error("Login Error:", error.message);
    return res.status(500).json({ msg: "Internal Server Error", error: error.message });
 }
};

exports.login = async (req, res) => {
try {
    const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: "user not found please register first" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ msg: "please provide correct password" });
  if(user && match){
    res.json({
   user: {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  },
      token: generateToken(user._id),
    });
  }
  
} catch (error) {
  console.error("Login Error:", error.message);
    return res.status(500).json({ msg: "Internal Server Error", error: error.message });
}
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ msg: "Failed to fetch users", error: error.message });
  }
};