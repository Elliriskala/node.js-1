import {
  fetchComments,
  fetchCommentById,
  fetchCommentByUserId,
  addComment,
  updateComment,
  deleteComment,
} from '../models/comments-model.js';
import {fetchUserIdByMediaId} from '../models/media-model.js';
import {customError} from '../middlewares/error-handlers.js';

// Get all comments
const getComments = async (req, res, next) => {
  try {
    res.json(await fetchComments());
  } catch (error) {
    console.error('getComments', error.message);
    return next(customError('Database error', 503));
  }
};

// Get comment by id
const getCommentById = async (req, res, next) => {
  const id = parseInt(req.params.id);
  console.log('getCommentById', id);
  try {
    const comment = await fetchCommentById(id);
    if (!comment) {
      return next(customError('Comment not found', 404));
    } else {
      return res.json(comment);
    }
  } catch (error) {
    console.error('getCommentById', error.message);
    return next(customError('Database error', 503));
  }
};

// Get comment by user id
const getCommentByUserId = async (req, res, next) => {
  const id = parseInt(req.params.id);
  console.log('getCommentByUserId', id);
  try {
    const comment = await fetchCommentByUserId(id);
    if (!comment) {
      return next(customError('Comment not found', 404));
    } else {
      return res.json(comment);
    }
  } catch (error) {
    console.error('getCommentByUserId', error.message);
    return next(customError(error.message, 503));
  }
};

// Add a new comment
const postComment = async (req, res, next) => {
  const loggedInUser = req.user.user_id;

  const newComment = {
    comment: req.body.comment_id,
    user_id: loggedInUser,
    media_id: req.body.media_id,
    comment_text: req.body.comment_text,
    created_at: new Date(),
  };
  try {
    const id = await addComment(newComment);
    if (!id) {
      return next(customError('Comment not added', 400));
    }
    res.status(201).json({message: 'Comment added', id: id});
  } catch (error) {
    console.error('postComment', error.message);
    return next(customError('Database error', 503));
  }
};

// Update comment by id
const putComment = async (req, res, next) => {
  const id = req.params.id;
  const loggedInUser = req.user.user_id;

  const comment = {
    comment_text: req.body.comment_text,
    created_at: new Date(),
  };

  try {
    const existingComment = await fetchCommentById(id);
    if (!existingComment) {
      return next(customError('Comment not found', 404));
    }

    if (existingComment.user_id !== loggedInUser) {
      return next(
        customError(
          'Forbidden: You do not have permission to update this comment',
          403,
        ),
      );
    }

    const affectedRows = await updateComment(id, comment);
    res
      .status(200)
      .json({message: 'Comment updated', affectedRows: affectedRows});
  } catch (error) {
    console.error('putComment', error.message);
    return next(customError('Database error', 503));
  }
};

// Delete comment by id

const removeComment = async (req, res, next) => {
  const id = parseInt(req.params.id);
  const loggedInUser = req.user.user_id;

  try {
    const existingComment = await fetchCommentById(id);
    if (!existingComment) {
      return next(customError('Comment not found', 404));
    }
    const mediaOwner = await fetchUserIdByMediaId(existingComment.media_id);
    if (
      existingComment.user_id !== loggedInUser &&
      mediaOwner.user_id !== loggedInUser
    ) {
      return next(
        customError(
          'Forbidden: You do not have permission to delete this comment',
          403,
        ),
      );
    }
    const affectedRows = await deleteComment(id);
    res
      .status(200)
      .json({message: `Comment ${id} deleted`, affectedRows: affectedRows});
  } catch (error) {
    console.error('removeComment', error.message);
    return next(customError('Database error', 503));
  }
};

export {
  getComments,
  getCommentById,
  getCommentByUserId,
  postComment,
  putComment,
  removeComment,
};
