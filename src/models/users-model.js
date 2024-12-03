import promisePool from '../utils/database.js';
import {customError} from '../middlewares/error-handlers.js';

const fetchUsers = async (next) => {
  try {
    const [rows] = await promisePool.query('SELECT * FROM users');
    return rows;
  } catch (error) {
    console.error('fetchUsers', error.message);
    return next(customError(error.message, 503));
  }
};

/**
 * Fetch a single user from the database by id
 * @param {number} user id
 * @returns {Promise<object>} user details
 */

const fetchUserById = async (id, next) => {
  try {
    // TODO? get only user id
    const sql = 'SELECT username, email, user_level_id FROM users WHERE user_id = ?';
    const [rows] = await promisePool.query(sql, [id]);
    console.log('fetchUserById', rows);
    return rows[0];
  } catch (error) {
    console.error('fetchUserById', error.message);
    return next(customError(error.message, 503));
  }
};

/**
 * Add a new user to the database
 * @param {object} newUser user details
 * @returns {Promise<number>} id of the new user
 */

const addUser = async (newUser, next) => {
  const sql = `INSERT INTO users 
                    (username, password, email, user_level_id, created_at) 
                    VALUES (?, ?, ?, ?, ?)`;
  const params = [
    newUser.username,
    newUser.password,
    newUser.email,
    newUser.user_level_id,
    newUser.created_at,
  ];
  try {
    const [rows] = await promisePool.query(sql, params);
    return rows.insertId;
  } catch (error) {
    console.error('addUser', error.message);
    return next(customError(error.message, 503));
  }
};

// update user by id
/**
 *
 * @param {object} id user id to update
 * @param {object} update updated user details
 * @returns {Promise<number>} number of affected rows
 */

const updateUser = async (id, update, next) => {
  const sql = `UPDATE users SET 
                        username = ?,
                        password = ?,
                        email = ?
                        WHERE user_id = ?`;
  const params = [
    update.username,
    update.password,
    update.email,
    id,
  ];
  try {
    const [rows] = await promisePool.query(sql, params);
    console.log('updateUser', rows);
    return rows.affectedRows;
  } catch (error) {
    console.error('updateUser', error.message);
    return next(customError(error.message, 503));
  }
};

/**
 * delete user by id, also deletes comments and mediaItems related to the user id
 * @param {number} id user id to delete
 * @returns {Promise<number>} number of affected rows
 */

const deleteUser = async (id, next) => {
  // delete comments related to the user
  const deleteCommentSql = `
    DELETE comments 
    FROM comments
    LEFT JOIN mediaItems ON comments.media_id = mediaItems.media_id
    WHERE comments.user_id = ? OR mediaItems.user_id = ?
  `;

  // delete mediaitemtags related to the media item
  const deleteMediaItemTagSql = `
    DELETE mediaItemTags 
    FROM mediaItemTags
    LEFT JOIN mediaItems ON mediaItemTags.media_id = mediaItems.media_id
    WHERE mediaItems.user_id = ?
  `;

  // delete mediaItems related to the user
  const deleteMediaItemSql = 'DELETE FROM mediaItems WHERE user_id = ?';

  // delete the user
  const sql = 'DELETE FROM users WHERE user_id = ?';
  try {
    // delete comments
    const [commentRows] = await promisePool.query(deleteCommentSql, [id, id]);
    // delete mediaitemtags
    const [mediaItemTagRows] = await promisePool.query(deleteMediaItemTagSql, [
      id,
    ]);
    // delete mediaItems
    const [mediaItemRows] = await promisePool.query(deleteMediaItemSql, [id]);

    console.log('deleteUser', commentRows, mediaItemTagRows, mediaItemRows);

    // delete the user
    const [rows] = await promisePool.query(sql, [id]);

    if (rows.affectedRows === 0) {
      console.log('deleteUser, `User ${id} deleted`');
      return null;
    } else {
      console.log('deleteUser', `User ${id} not found`);
      return rows.affectedRows;
    }
  } catch (error) {
    console.error('deleteUser', error.message);
    return next(customError(error.message, 503));
  }
};

// login
const selectUserByUsername = async (username, next) => {
  try {

    const [rows] = await promisePool.query(
      'SELECT user_id, username, password, email, user_level_id, created_at FROM users WHERE username = ?', [username],
    );
    return rows[0];
  } catch (error) {
    console.error('selectUserByUsername', error.message);
    return next(customError(error.message, 503));
  }
};

export {fetchUsers, fetchUserById, addUser, updateUser, deleteUser, selectUserByUsername};
