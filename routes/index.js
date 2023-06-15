const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('API 서버 동작 중...');
});

module.exports = router;