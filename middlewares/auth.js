const { expressjwt } = require("express-jwt");

const Post = require("../models/Post");
const User = require("../models/User");

exports.isAuth = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});

exports.isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.auth._id);

    if (!user.isAdmin) {
      return res.status(401).json({ error: "Access denied! Admin resource." });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
  }
};

exports.canEditDelete = async (req, res, next) => {
  const { _id } = req.params;

  try {
    const post = await Post.findById(_id);

    if (req.auth._id !== post.postedBy) {
      return res.status(401).json({ error: "Access denied." });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
  }
};
