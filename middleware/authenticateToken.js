const jwt = require('jsonwebtoken');

// 토큰 검증 및 사용자 인증 미들웨어
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: '인증되지 않은 요청입니다.' });
  }

  jwt.verify(token, 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: '유효하지 않은 토큰입니다.' });
    }
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
