const express = require("express");

const router = express.Router();

const postController = require("../controllers/postController");
const { isAuth, canEditDelete } = require("../middlewares/auth");
const fileUploadMiddleware = require("../middlewares/file-upload");

/**
 * Post
 */
router.get("/posts", postController.getPosts);
router.post("/posts", isAuth, postController.createPost);
router.get("/posts/:_id", isAuth, postController.getPost);
router.put("/posts/:_id", isAuth, canEditDelete, postController.updatePost);
router.delete("/posts/:_id", isAuth, canEditDelete, postController.deletePost);

/**
 * News Feed
 */
router.get("/newsfeeds/:page", isAuth, postController.newsfeeds);
router.get("/total-posts", isAuth, postController.totalPosts);

/**
 * Like/Unlike
 */
router.put("/likes", isAuth, postController.addLike);
router.put("/unlikes", isAuth, postController.removeLike);

/**
 * Comment
 */
router.put("/add-comment", isAuth, postController.addComment);
router.put("/remove-comment", isAuth, postController.removeComment);

/**
 * Image upload
 */
router.post(
  "/images",
  isAuth,
  fileUploadMiddleware,
  postController.uploadImage
);

module.exports = router;
