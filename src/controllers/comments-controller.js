import {
  fetchComments,
  fetchCommentById,
  fetchCommentByUserId,
  addComment,
  updateComment,
  deleteComment,
} from '../models/comments-model.js';

// Get all comments
const getComments = async (req, res) => {
  try {
    res.json(await fetchComments());
  } catch (error) {
    console.error('getComments', error.message);
    res.status(503).json({error: 503, message: 'Database error'});
  }
};

// Get comment by id
const getCommentById = async (req, res) => {
  const id = parseInt(req.params.id);
  console.log('getCommentById', id);
  try {
    const comment = await fetchCommentById(id);
    if (!comment) {
      res.status(404).json({error: 404, message: 'Comment not found'});
    } else {
      return res.json(comment);
    }
  } catch (error) {
    console.error('getCommentById', error.message);
    res.status(503).json({error: 503, message: 'Database error'});
  }
};

// Get comment by user id
const getCommentByUserId = async (req, res) => {
  const id = parseInt(req.params.id);
  console.log('getCommentByUserId', id);
  try {
    const comment = await fetchCommentByUserId(id);
    if (!comment) {
      res.status(404).json({error: 404, message: 'Comment not found'});
    } else {
      return res.json(comment);
    }
  } catch (error) {
    console.error('getCommentByUserId', error.message);
    res.status(503).json({error: 503, message: 'Database error'});
  }
};

// Add a new comment
const postComment = async (req, res) => {
  console.log('post req body', req.body);
  const newComment = {
    comment: req.body.comment_id,
    user_id: req.body.user_id,
    media_id: req.body.media_id,
    comment_text: req.body.comment_text,
    created_at: new Date(),
  };
  try {
    const id = await addComment(newComment);
    if (!id) {
      return res
        .status(400)
        .json({message: 'Something went wrong. Comment not added'});
    }
    res.status(201).json({message: 'Comment added', id: id});
  } catch (error) {
    console.error('postComment', error.message);
    res.status(503).json({error: 503, message: 'Database error'});
  }
};

// Update comment by id
const putComment = async (req, res) => {
  const id = req.params.id;

  const comment = {
    comment_text: req.body.comment_text,
    created_at: new Date(),
  };
  try {
    const affectedRows = await updateComment(id, comment);
    if (!affectedRows) {
      return res.status(404).json({message: 'Comment not found'});
    }
    res
      .status(200)
      .json({message: 'Comment updated', affectedRows: affectedRows});
  } catch (error) {
    console.error('putComment', error.message);
    res.status(503).json({error: 503, message: 'Database error'});
  }
};

// Delete comment by id

const removeComment = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const affectedRows = await deleteComment(id);
    if (!affectedRows) {
      return res.status(404).json({message: 'Comment not found'});
    }
    res
      .status(200)
      .json({message: `Comment ${id} deleted`, affectedRows: affectedRows});
  } catch (error) {
    console.error('removeComment', error.message);
    res.status(503).json({error: 503, message: 'Database error'});
  }
};

export {getComments, getCommentById, getCommentByUserId, postComment, putComment, removeComment};
