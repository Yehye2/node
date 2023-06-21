const express = require('express');
const router = express.Router();
const commentSchema = require('../schemas/comment.js');
const authenticateToken = require('../middleware/authenticateToken');

// 댓글 목록 조회 API
router.get('/', async (req, res) => {
  try {
    const comments = await commentSchema.find().sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: '서버 오류' });
  }
});

// 댓글 작성 API
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { postId, content } = req.body;
    if (!content) {
      res.status(400).json({ error: '댓글 내용을 입력해주세요.' });
    } else {
      const comment = new commentSchema({ postId, content, userId: req.user.id });
      await comment.save();
      res.json({ commentId: comment._id });
    }
  } catch (err) {
    res.status(500).json({ error: '서버 오류' });
  }
});

// 댓글 수정 API
router.put('/:commentId', authenticateToken, async (req, res) => {
  try {
    const comment = await commentSchema.findById(req.params.commentId);
    if (!comment) {
      res.status(404).json({ error: '댓글을 찾을 수 없습니다.' });
    } else {
      if (comment.userId.toString() !== req.user.id) {
        res.status(401).json({ error: '해당 댓글을 수정할 권한이 없습니다.' });
      } else {
        const { content } = req.body;
        if (!content) {
          res.status(400).json({ error: '댓글 내용을 입력해주세요.' });
        } else {
          comment.content = content;
          await comment.save();
          res.json(comment);
        }
      }
    }
  } catch (err) {
    res.status(500).json({ error: '서버 오류' });
  }
});

// 댓글 삭제 API
router.delete('/:commentId', authenticateToken, async (req, res) => {
  try {
    const comment = await commentSchema.findById(req.params.commentId);
    if (!comment) {
      res.status(404).json({ error: '댓글을 찾을 수 없습니다.' });
    } else {
      if (comment.userId.toString() !== req.user.id) {
        res.status(401).json({ error: '해당 댓글을 삭제할 권한이 없습니다.' });
      } else {
        await comment.remove();
        res.json({ success: true });
      }
    }
  } catch (err) {
    res.status(500).json({ error: '서버 오류' });
  }
});

module.exports = router;
