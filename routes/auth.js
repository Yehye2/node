// routes/auth.js
const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const path = require('path');

const User = require("../schemas/user");

// 로그인 API
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || password !== user.password) {
    res.status(400).json({
      errorMessage: "이메일 또는 패스워드가 틀렸습니다.",
    });
    return;
  }

  const token = jwt.sign(
    { userId: user.userId },
    "custom-secret-key",
  );

  res.cookie("Authorization", `Bearer ${token}`);
  res.status(200).json({ token });
});


router.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, '../public/login.html'));
});

module.exports = router;
