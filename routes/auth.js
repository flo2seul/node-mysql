const express = require("express");
const authController = require("../controllers/auth");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

router.post("/register", authController.register);

router.post("/login", authController.login);

router.use("/check", authMiddleware);
router.get("/check", authController.check);

router.post("/logout", authController.logout);

module.exports = router;
