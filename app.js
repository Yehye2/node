const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');

// 라우터 연결
const indexRouter = require('./routes/index');
const postsRouter = require('./routes/posts');
const commentsRouter = require('./routes/comments');
const usersRouter = require('./routes/users');
const connect = require('./schemas');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/posts', postsRouter);
app.use('/comments', commentsRouter);
app.use('/users', usersRouter);

// 몽고디비 연결
connect();

app.use(cors());

// 오류 처리 미들웨어
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: '서버 오류' });
});

// 서버 시작
app.listen(3000, (err) => {
  if (err) {
    console.error('서버 시작 실패:', err);
  } else {
    console.log('서버가 http://localhost:3000 에서 실행 중입니다.');
  }
});
