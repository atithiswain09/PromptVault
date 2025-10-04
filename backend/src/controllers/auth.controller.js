const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
;
const jwt = require("jsonwebtoken");
const { ENV } = require("../configs/env");

// Signup (Register) ====================>
const signup = async (req, res) => {
  // validate inputs
  if (inputValidation(req, res)) return;

  try {
    const { username, email, password } = req.body;

    // check if user already exists
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(409).json({
        errors: [{ path: "email", msg: "User already exists" }],
      });
    }

    // hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // create new user in database
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // create JWT token (valid for 7 days)
    const token = jwt.sign({ id: user._id }, ENV.JWT_SECRET, {
      expiresIn: "7d",
    });

    // store token inside cookie
    res.cookie("token", token, {
      httpOnly: true, // security → prevents JS from accessing cookie
      // true only in production (https)
      sameSite: "strict", // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // cookie expiry → 7 days
    });

    // success response
    return res.status(201).json({
      message: "Signup successful",
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

//  Login ====================>
const login = async (req, res) => {
  if (inputValidation(req, res)) return;

  try {
    const { email, password } = req.body;

    // find user by email
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    // compare entered password with hashed one
    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Invalid email or password" });

    // generate JWT token
    const token = jwt.sign({ id: user._id }, ENV.JWT_SECRET, {
      expiresIn: "7d",
    });

    // store token inside cookie
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // success response
    res.status(200).json({
      message: "Login successful",
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



module.exports = { signup, login };
