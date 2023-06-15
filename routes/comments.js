const express = require('express');
const router = express.Router();
const commentSchema = require('../schemas/comment.js');

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
router.post('/', async (req, res) => {
  try {
    const { postId, content } = req.body;
    if (!content) {
      res.status(400).json({ error: '댓글 내용을 입력해주세요.' });
    } else {
      const comment = new commentSchema({ postId, content });
      await comment.save();
      res.json({ commentId: comment._id });
    }
  } catch (err) {
    res.status(500).json({ error: '서버 오류' });
  }
});

// 댓글 수정 API
router.put('/:commentId', async (req, res) => {
  try {
    const comment = await commentSchema.findById(req.params.commentId);
    if (!comment) {
      res.status(404).json({ error: '댓글을 찾을 수 없습니다.' });
    } else {
      if (comment.content !== req.body.content) {
        res.status(401).json({ error: '댓글 내용이 올바르지 않습니다.' });
      } else {
        comment.content = req.body.content;
        await comment.save();
        res.json(comment);
      }
    }
  } catch (err) {
    res.status(500).json({ error: '서버 오류' });
  }
});

// 댓글 삭제 API
router.delete('/:commentId', async (req, res) => {
  try {
    const comment = await commentSchema.findById(req.params.commentId);
    if (!comment) {
      res.status(404).json({ error: '댓글을 찾을 수 없습니다.' });
    } else {
      await comment.remove();
      res.json({ success: true });
    }
  } catch (err) {
    res.status(500).json({ error: '서버 오류' });
  }
});

module.exports = router;