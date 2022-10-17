const { hashPassword } = require("../lib/auth");

const User = require("../models/User");

exports.updateProfile = async (req, res) => {
  const {
    firstName,
    lastName,
    username,
    phone,
    location,
    about,
    password,
    image,
    bloodGroup,
    lastDonate,
    gender,
    dob,
  } = req.body;

  let data = {};

  try {
    if (firstName) data.firstName = firstName;
    if (lastName) data.lastName = lastName;
    if (username) data.username = username;
    if (location) data.location = location;
    if (bloodGroup) data.bloodGroup = bloodGroup;
    if (lastDonate) data.lastDonate = lastDonate;
    if (gender) data.gender = gender;
    if (dob) data.dob = dob;
    if (phone) data.phone = phone;
    if (about) data.about = about;

    if (Object.keys(image).length !== 0) {
      data.image = image;
    }

    if (password) {
      if (password.length < 6) {
        return res.json({ error: "Password must be 6 chars long." });
      } else {
        data.password = await hashPassword(password);
      }
    }

    const user = await User.findByIdAndUpdate(req.auth._id, data, {
      new: true,
    });

    user.password = undefined;

    res.json(user);
  } catch (error) {
    if (error.code == 11000) {
      return res.json({ error: "Username already taken." });
    } else {
      return res.json({ error: "Something went wrong." });
    }
  }
};

exports.findUsers = async (req, res) => {
  try {
    const user = await User.findById(req.auth._id);
    const following = user.following;
    following.push(user._id);

    const people = await User.find({ _id: { $nin: following } })
      .select("-password")
      .limit(10);

    res.json(people);
  } catch (error) {
    console.log(error);
    return res.json({ error: "Something went wrong." });
  }
};

exports.addFollower = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(
      req.body._id,
      { $addToSet: { followers: req.auth._id } },
      { new: true }
    );
    next();
  } catch (error) {
    console.log(error);
    return res.json({ error: "Something went wrong." });
  }
};

exports.removeFollower = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(
      req.body._id,
      { $pull: { followers: req.auth._id } },
      { new: true }
    );

    next();
  } catch (error) {
    console.log(error);
    return res.json({ error: "Something went wrong." });
  }
};

exports.userFollower = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.auth._id,
      { $addToSet: { following: req.body._id } },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (error) {
    console.log(error);
    return res.json({ error: "Something went wrong." });
  }
};

exports.userUnfollower = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.auth._id,
      { $pull: { following: req.body._id } },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (error) {
    console.log(error);
    return res.json({ error: "Something went wrong." });
  }
};

exports.userUnfollowing = async (req, res) => {
  try {
    const user = await User.findById(req.auth._id);
    const following = await User.find({ _id: user.following }).limit(30);

    res.json(following);
  } catch (error) {
    console.log(error);
    return res.json({ error: "Something went wrong." });
  }
};

exports.search = async (req, res) => {
  const { query } = req.params;

  try {
    const user = await User.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { bloodGroup: { $regex: query, $options: "i" } },
      ],
    }).select("_id image username bloodGroup");

    res.json(user);
  } catch (error) {
    console.log(error);
    return res.json({ error: "Something went wrong." });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    console.log(user);
    res.json(user);
  } catch (error) {
    console.log(error);
    return res.json({ error: "Something went wrong." });
  }
};
