const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { Post, User } = require('../models');
const authenticateToken = require('../middleware/authenticateToken');

router.get('/', (req, res) => {
  Post.findAll({
    attributes: ['title', 'author', 'nickname', 'createdAt'],
    include: [
      {
        model: User,
        as: 'author',
        attributes: ['nickname'],
      },
    ],
    order: [['createdAt', 'DESC']],
  })
    .then(posts => {
      res.json(posts);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: '서버 오류' });
    });
});

router.post('/', authenticateToken, (req, res) => {
  const { title, content } = req.body;
  const authorId = req.user.id;
  Post.create({ title, content, authorId })
    .then(savedPost => {
      res.json({ postId: savedPost.id });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: '서버 오류' });
    });
});

router.get('/:postId', (req, res) => {
  Post.findByPk(req.params.postId, {
    attributes: ['title', 'author', 'nickname', 'createdAt', 'content'],
    include: [
      {
        model: User,
        as: 'author',
        attributes: ['nickname'],
      },
    ],
  })
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

router.put('/:postId', authenticateToken, (req, res) => {
  Post.findByPk(req.params.postId)
    .then(post => {
      if (!post) {
        res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
      } else {
        if (post.authorId !== req.user.id) {
          res.status(401).json({ error: '해당 게시글을 수정할 권한이 없습니다.' });
        } else {
          post.title = req.body.title;
          post.content = req.body.content;
          post.save()
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

router.delete('/:postId', authenticateToken, (req, res) => {
  Post.findByPk(req.params.postId)
    .then(post => {
      if (!post) {
        res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
      } else {
        if (post.authorId !== req.user.id) {
          res.status(401).json({ error: '해당 게시글을 삭제할 권한이 없습니다.' });
        } else {
          post.destroy()
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
