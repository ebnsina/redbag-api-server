const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema;

const postSchema = new mongoose.Schema(
  {
    content: {
      type: Object,
      required: [true, "Content can not be empty"],
      maxlength: [200, "Content cannot be more than 200 characters"],
    },
    image: {
      url: String,
      public_id: String,
    },
    postedBy: { type: ObjectId, ref: "User" },
    likes: [{ type: ObjectId, ref: "User" }],
    comments: [
      {
        text: String,
        createdAt: { type: Date, default: Date.now },
        postedBy: { type: ObjectId, ref: "User" },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
