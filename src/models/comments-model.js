import promisePool from '../utils/database.js';
import {customError} from '../middlewares/error-handlers.js';

// Fetch all comments from the database
const fetchComments = async (next) => {
  try {
    const [rows] = await promisePool.query('SELECT * FROM comments');
    return rows;
  } catch (error) {
    console.error('fetchComments', error.message);
    return next(customError('Error fetching comments', 503));
  }
};


/**
 * Fetch a single comment from the database by id
 * @param {object} id, comment id
 * @returns {Promise<object>} comment details
 */

const fetchCommentById = async (id, next) => {
  try {
    const sql = 'SELECT * FROM comments WHERE comment_id = ?';
    const [rows] = await promisePool.query(sql, [id]);
    console.log('fetchCommentById', rows);
    return rows[0];
  } catch (error) {
    console.error('fetchCommentById', error.message);
    return next(customError('Error fetching comment', 503));
  }
};

/**
 * fetch a comment by user id
 * @param {object} id, user id
 * @returns {Promise<object>} comment details
 */

const fetchCommentByUserId = async (id, next) => {
  try {
    const sql = 'SELECT * FROM comments WHERE user_id = ?';
    const [rows] = await promisePool.query(sql, [id]);
    console.log('fetchCommentByUserId', rows);
    return rows;
  } catch (error) {
    console.error('fetchCommentByUserId', error.message);
    return next(customError('Error fetching comment', 503));
  }
};

/**
 * Create a new comment in the database
 * @param {object} newComment, comment details
 * @returns {Promise<number>} id of the new comment
 */

const addComment = async (newComment, next) => {
  const sql = `INSERT INTO comments 
                    (comment_id, user_id, media_id, comment_text, created_at) 
                    VALUES (?, ?, ?, ?, ?)`;
  const params = [
    newComment.comment_id,
    newComment.user_id,
    newComment.media_id,
    newComment.comment_text,
    newComment.created_at,
  ];
  try {
    const [rows] = await promisePool.query(sql, params);
    console.log('addComment', rows);
    return rows.insertId;
  } catch (error) {
    console.error('addComment', error.message);
    return next(customError('Error adding comment', 503));
  }
};

/**
 * update a comment by id
 * @param {number} id, comment id
 * @param {object} comment, comment details
 * @returns {Promise<number>} id of the updated comment
 */

const updateComment = async (id, comment, next) => {
  const sql = `UPDATE comments SET comment_text = ?, created_at = ? WHERE comment_id = ?`;
  const params = [
    comment.comment_text,
    comment.created_at,
    id,
  ];
  try {
    const [rows] = await promisePool.query(sql, params);
    console.log('updateComment', rows);
    return rows.affectedRows;
  } catch (error) {
    console.error('updateComment', error.message);
    return next(customError('Error updating comment', 503));
  }
};

/**
 * Delete a comment by id
 * @param {number} id, comment id
 * @returns {Promise<number>} number of affected rows
 */

const deleteComment = async (id, next) => {
  const sql = 'DELETE FROM comments WHERE comment_id = ?';
  try {
    const [rows] = await promisePool.query(sql, [id]);
    console.log('deleteComment', rows);
    return rows.affectedRows;
  } catch (error) {
    console.error('deleteComment', error.message);
    return next(customError('Error deleting comment', 503));
  }
};

export {fetchComments, fetchCommentById, fetchCommentByUserId, addComment, updateComment, deleteComment};
