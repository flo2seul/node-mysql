const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", { isLoggedIn: req.session.isLoggedIn });
});

router.get("/register", (req, res) => {
  res.render("register");
});
router.get("/login", (req, res) => {
  res.render("login");
});
router.get("/mypage", (req, res) => {
  res.render("mypage");
});
module.exports = router;
