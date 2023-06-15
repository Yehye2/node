const express = require('express');
const router = express.Router();
const postSchema = require('../schemas/post.js');

// 전체 게시글 목록 조회 API
router.get('/', (req, res) => {
  postSchema
    .find()
    .sort({ createdAt: -1 })
    .then(posts => {
      res.json(posts);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: '서버 오류' });
    });
});

// 게시글 작성 API
router.post('/', (req, res) => {
  console.log("/posts");
  const { title, author, password, content } = req.body;
  const post = new postSchema({ title, author, password, content });
  post
    .save()
    .then(savedPost => {
      res.json({ postId: savedPost._id });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: '서버 오류' });
    });
});

// 게시글 조회 API
router.get('/:postId', (req, res) => {
  console.log("/:postId");
  postSchema
    .findById(req.params.postId)
    .then(post => {
      if (!post) {
        res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
      } else {
        res.json(post);
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: '서버 오류' });
    });
});

// 게시글 수정 API
router.put('/:postId', (req, res) => {
  postSchema
    .findById(req.params.postId)
    .then(post => {
      if (!post) {
        res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
      } else {
        if (post.password !== req.body.password) {
          res.status(401).json({ error: '비밀번호가 올바르지 않습니다.' });
        } else {
          post.title = req.body.title;
          post.author = req.body.author;
          post.content = req.body.content;
          post
            .save()
            .then(updatedPost => {
              res.json(updatedPost);
            })
            .catch(err => {
              console.error(err);
              res.status(500).json({ error: '서버 오류' });
            });
        }
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: '서버 오류' });
    });
});

// 게시글 삭제 API
router.delete('/:postId', (req, res) => {
  postSchema
    .findById(req.params.postId)
    .then(post => {
      if (!post) {
        res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
      } else {
        if (post.password !== req.body.password) {
          res.status(401).json({ error: '비밀번호가 올바르지 않습니다.' });
        } else {
          post
            .remove()
            .then(() => {
              res.json({ success: true });
            })
            .catch(err => {
              console.error(err);
              res.status(500).json({ error: '서버 오류' });
            });
        }
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: '서버 오류' });
    });
});

module.exports = router;
