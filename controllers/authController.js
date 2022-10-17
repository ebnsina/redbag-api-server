const jwt = require("jsonwebtoken");

const User = require("../models/User");
const { hashPassword, comparePassword } = require("../lib/auth");
const { validateRegister, validateLogin } = require("../validations/auth");

exports.register = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    location,
    phone,
    bloodGroup,
    lastDonate,
    gender,
    dob,
  } = req.body;

  // Validate data
  const { error } = await validateRegister(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  // Check if user already exist
  const userExist = await User.findOne({ email });

  // If exist show user exist message
  if (userExist) {
    return res.status(400).json({ error: "User already exist" });
  }

  // If does not exist create new user
  // Before create user make sure to hash password
  const hashedPassword = await hashPassword(password);

  const newUser = new User({
    firstName,
    lastName,
    email,
    username: email.split("@")[0],
    password: hashedPassword,
    location,
    phone,
    bloodGroup,
    lastDonate,
    gender,
    dob,
  });

  try {
    await newUser.save();
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Validate data
  const { error } = await validateLogin(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  // Check user exist
  const user = await User.findOne({ email });

  // If not exist show message
  if (!user) {
    return res.status(400).json({ error: "User does not exist" });
  }

  // Check password is valid
  const passwordIsValid = await comparePassword(password, user.password);

  // If not valid show message
  if (!passwordIsValid) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  // Generate token
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  // Hide password
  user.password = undefined;

  try {
    // Send user with token
    res.json({ user, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, password, phone } = req.body;

  // Validate data

  // Find user
  const user = await User.findOne({ email, phone });

  // If not exist show message
  if (!user) {
    return res.status(400).json({ error: "We can not verify you" });
  }

  const hashedPassword = await hashPassword(password);

  try {
    await User.findByIdAndUpdate(user._id, { password: hashedPassword });
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

exports.currentUser = async (req, res) => {
  try {
    await User.findById({ _id: req.auth._id });
    res.json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};
