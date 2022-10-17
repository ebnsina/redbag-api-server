const cloudinary = require("cloudinary").v2;
const Post = require("../models/Post");
const User = require("../models/User");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Posts
exports.createPost = async (req, res) => {
  const { content, image } = req.body;

  const post = new Post({ content, image, postedBy: req.auth._id });
  try {
    await post.save();

    const usersPosts = await Post.findById(post._id).populate(
      "postedBy",
      "-password"
    );

    res.json(post);
  } catch (error) {
    console.log(error);
    res.json({ error: "Something went wrong." });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort("-createdAt")
      .populate("postedBy", "-password -isAdmin")
      .limit(10);
    res.json(posts);
  } catch (error) {
    console.log(error);
    res.json({ error: "Something went wrong." });
  }
};

exports.getPost = async (req, res) => {
  const { _id } = req.params;

  try {
    const post = await Post.findOne({ _id })
      .populate("postedBy", "_id username image createdAt")
      .populate("comments.postedBy", "_id firstName lastName image");

    if (!post) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json(post);
  } catch (error) {
    console.log(error);
    res.json({ error: "Something went wrong." });
  }
};

exports.updatePost = async (req, res) => {
  const { _id } = req.params;

  try {
    const post = await Post.findByIdAndUpdate(_id, req.body, { new: true });
    if (!post) {
      return res.status(400).json({ success: false });
    }

    res.status(200).json(post);
  } catch (error) {
    console.log(error);
    res.json({ error: "Something went wrong." });
  }
};

exports.deletePost = async (req, res) => {
  const { _id } = req.params;

  try {
    const deletedPost = await Post.deleteOne({ _id });
    if (!deletedPost) {
      return res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.json({ error: "Something went wrong." });
  }
};

// Like/Unlike

exports.addLike = async (req, res) => {
  const { _id } = req.body;

  try {
    const post = await Post.findByIdAndUpdate(
      _id,
      {
        $addToSet: { likes: req.auth._id },
      },
      { new: true }
    ).populate("postedBy", "firstName lastName");

    res.status(200).json(post);
  } catch (error) {
    console.log(error);
    res.json({ error: "Something went wrong." });
  }
};

exports.removeLike = async (req, res) => {
  const { _id } = req.body;

  try {
    const post = await Post.findByIdAndUpdate(
      _id,
      {
        $pull: { likes: req.auth._id },
      },
      { new: true }
    );

    res.status(200).json(post);
  } catch (error) {
    console.log(error);
    res.json({ error: "Something went wrong." });
  }
};

// Comment
exports.addComment = async (req, res) => {
  const { _id, comment } = req.body;

  try {
    const post = await Post.findByIdAndUpdate(
      _id,
      {
        $push: {
          comments: { text: comment, postedBy: req.auth._id },
        },
      },
      { new: true }
    );

    res.status(200).json(post);
  } catch (error) {
    console.log(error);
    res.json({ error: "Something went wrong." });
  }
};

exports.removeComment = async (req, res) => {
  const { _id, comment } = req.body;

  try {
    const post = await Post.findByIdAndUpdate(
      _id,
      {
        $pull: { comments: { _id: comment._id } },
      },
      { new: true }
    );
    res.status(200).json(post);
  } catch (error) {
    console.log(error);
    res.json({ error: "Something went wrong." });
  }
};

// Newsfeeds
exports.newsfeeds = async (req, res) => {
  const { page } = req.params;

  const authUser = req.auth._id;
  const currentPage = page || 1;
  const perPage = 3;

  try {
    const user = await User.findById(authUser);
    const following = user.following;
    following.push(authUser);

    const posts = await Post.find({ postedBy: { $in: following } })
      .skip((currentPage - 1) * perPage)
      .sort("-createdAt")
      .populate("postedBy", "-password")
      .populate("comments.postedBy", "-password")
      .limit(perPage);

    res.json(posts);
  } catch (error) {
    console.log(error);
    res.json({ error: "Something went wrong." });
  }
};

// Total Posts
exports.totalPosts = async (req, res) => {
  try {
    const total = await Post.find().estimatedDocumentCount();
    res.json(total);
  } catch (error) {
    console.log(error);
    res.json({ error: "Something went wrong." });
  }
};

// Upload image cloudinary
exports.uploadImage = async (req, res) => {
  const imagePath = req.files.image.path;

  try {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      imagePath,
      {
        folder: "redbag",
      }
    );

    res.json({ url: secure_url, public_id });
  } catch (error) {
    console.log(error);
    res.json({ error: "Something went wrong." });
  }
};
