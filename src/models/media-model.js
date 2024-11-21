import promisePool from '../utils/database.js';

const fetchMediaItems = async () => {
  try {
    const [rows] = await promisePool.query('SELECT * FROM mediaItems');
    return rows;
  } catch (error) {
    console.error('fetchMediaItems', error.message);
    throw new Error('Database error' + error.message);
  }
};

/**
 * Fetch a single media item from the database by id
 * @param {number} media item id
 * @returns {Promise<object>} media item details
 */

const fetchMediaItemById = async (id) => {
  try {
    const sql = 'SELECT * FROM mediaItems WHERE media_id = ?';
    const [rows] = await promisePool.query(sql, [id]);
    console.log('fetchMediaItemById', rows);
    return rows[0];
  } catch (error) {
    console.error('fetchMediaItemById', error.message);
    throw new Error('Database error' + error.message);
  }
};

// fetch media owner by user id
const fetchUserIdByMediaId = async (id) => {
  try {
    const sql = 'SELECT user_id FROM mediaItems WHERE media_id = ?';
    const [rows] = await promisePool.query(sql, [id]);
    console.log('fetchUserIdByMediaId', rows);
    return rows[0];
  } catch (error) {
    console.error('fetchUserIdByMediaId', error.message);
    throw new Error('Database error' + error.message);
  }
};

/**
 * Add a new media item to the database
 * @param {object} newItem media file details
 * @returns {Promise<number>} id of the new item
 */

const addMediaItem = async (newItem) => {
  const sql = `INSERT INTO mediaItems 
                (user_id, title, description, filename, filesize, media_type, created_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const params = [
    newItem.user_id,
    newItem.title,
    newItem.description,
    newItem.filename,
    newItem.filesize,
    newItem.media_type,
    newItem.created_at,
  ];
  try {
    const [rows] = await promisePool.query(sql, params);
    console.log('addMediaItem', rows);
    return rows.insertId;
  } catch (error) {
    console.error('addMediaItem', error.message);
    throw new Error('Database error' + error.message);
  }
};

/**
 * Update an existing item by item id
 * @param {object} id item id
 * @returns {Promise<object>} affected rows
 */

const updateMediaItem = async (id, userId, updateItem) => {
  const sql = `UPDATE mediaItems SET title = ?, description = ? WHERE media_id = ? AND user_id = ?`;
  const params = [updateItem.title, updateItem.description, id, userId];
  try {
    const [rows] = await promisePool.query(sql, params);
    console.log('updateMediaItem', rows);
    return rows.affectedRows;
  } catch (error) {
    console.error('updateMediaItem', error.message);
    throw new Error('Database error' + error.message);
  }
};

/**
 * Delete an item by id, including related entries in mediaitemtags
 * @param {object} id item id
 * @returns {Promise<number>} number of affected rows
 */

const deleteMediaItem = async (id) => {
  const deleteMediaItemTagsSql = 'DELETE FROM mediaItemTags WHERE media_id = ?';
  const deleteItemSql = 'DELETE FROM mediaItems WHERE media_id = ?';
  try {
    // delete related entries in mediaitemtags
    const [mediaItemTagsRows] = await promisePool.query(
      deleteMediaItemTagsSql,
      [id],
    );
    console.log('deleteMediaItemTags', mediaItemTagsRows);

    // delete the item
    const [itemRows] = await promisePool.query(deleteItemSql, [id]);
    console.log('deleteMediaItem', itemRows);
    return itemRows.affectedRows;
  } catch (error) {
    console.error('deleteMediaItem', error.message);
    throw new Error('Database error' + error.message);
  }
};

export {
  fetchMediaItems,
  fetchMediaItemById,
  fetchUserIdByMediaId,
  addMediaItem,
  updateMediaItem,
  deleteMediaItem,
};
