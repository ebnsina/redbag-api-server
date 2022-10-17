const express = require("express");

const router = express.Router();

const userController = require("../controllers/userController");
const { isAuth } = require("../middlewares/auth");

router.get("/search/:query", userController.search);

router.put("/users/follow", isAuth, userController.userFollower);
router.put("/users/unfollow", isAuth, userController.userUnfollower);
router.get("/users/following", isAuth, userController.userUnfollowing);
router.get("/users/find", isAuth, userController.findUsers);
router.put("/users/update", isAuth, userController.updateProfile);
router.get("/users/:username", isAuth, userController.getUser);

module.exports = router;
