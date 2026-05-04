const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

exports.register = async (req, res) => {
 try {
   const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) return res.status(400).json({ msg: "User exists" });

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({ name, email, password: hashed });

  res.status(201).json({
  msg:"User created",
    user,
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
      user,
      token: generateToken(user._id),
    });
  }
  
} catch (error) {
  console.error("Login Error:", error.message);
    return res.status(500).json({ msg: "Internal Server Error", error: error.message });
}
};