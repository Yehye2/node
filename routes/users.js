const express = require('express');
const router = express.Router();
const User = require('../schemas/user');
const path = require('path');

// 회원가입 API
router.post("/", async (req, res) => {
  const { email, nickname, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    res.status(400).json({
      errorMessage: "패스워드가 패스워드 확인란과 다릅니다.",
    });
    return;
  }

  if (!/^[a-zA-Z0-9]{3,}$/.test(nickname)) {
    res.status(400).json({
      errorMessage: "닉네임은 최소 3자 이상이며, 알파벳 대소문자와 숫자로만 구성되어야 합니다.",
    });
    return;
  }

  if (password.length < 4 || password.includes(nickname)) {
    res.status(400).json({
      errorMessage: "비밀번호는 최소 4자 이상이어야 하며, 닉네임과 동일한 값이 포함될 수 없습니다.",
    });
    return;
  }

  const existsUsers = await User.findOne({
    $or: [{ email }, { nickname }],
  });
  if (existsUsers) {
    res.status(400).json({
      errorMessage: "이메일 또는 닉네임이 이미 사용중입니다.",
    });
    return;
  }

  const user = new User({ email, nickname, password });
  await user.save();

  res.status(201).json({});
});

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, '../public/signup.html'));
});

module.exports = router;
