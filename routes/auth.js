const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const { isAuth } = require("../middlewares/auth");

router.get("/me", isAuth, authController.currentUser);
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/reset-password", authController.resetPassword);

module.exports = router;
