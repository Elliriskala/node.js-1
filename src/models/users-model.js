import promisePool from '../utils/database.js';

const fetchUsers = async () => {
  try {
    const [rows] = await promisePool.query('SELECT * FROM users');
    return rows;
  } catch (error) {
    console.error('fetchUsers', error.message);
    throw new Error('Database error' + error.message);
  }
};

/**
 * Fetch a single user from the database by id
 * @param {number} user id
 * @returns {Promise<object>} user details
 */

const fetchUserById = async (id) => {
  try {
    const sql = 'SELECT * FROM users WHERE user_id = ?';
    const [rows] = await promisePool.query(sql, [id]);
    console.log('fetchUserById', rows);
    return rows[0];
  } catch (error) {
    console.error('fetchUserById', error.message);
    throw new Error('Database error' + error.message);
  }
};

/**
 * Add a new user to the database
 * @param {object} newUser user details
 * @returns {Promise<number>} id of the new user
 */

const addUser = async (newUser) => {
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
    console.log('addUser', rows);
    return rows.insertId;
  } catch (error) {
    console.error('addUser', error.message);
    throw new Error('Database error' + error.message);
  }
};

// update user by id
/**
 *
 * @param {object} id user id to update
 * @param {object} update updated user details
 * @returns {Promise<number>} number of affected rows
 */

const updateUser = async (id, update) => {
  const sql = `UPDATE users SET 
                        username = ?,
                        password = ?,
                        email = ?,
                        user_level_id = ?
                        WHERE user_id = ?`;
  const params = [
    update.username,
    update.password,
    update.email,
    update.user_level_id,
    id,
  ];
  try {
    const [rows] = await promisePool.query(sql, params);
    console.log('updateUser', rows);
    return rows.affectedRows;
  } catch (error) {
    console.error('updateUser', error.message);
    throw new Error('Database error' + error.message);
  }
};

/**
 * delete user by id
 * @param {number} id user id to delete
 * @returns {Promise<number>} number of affected rows
 */

const deleteUser = async (id) => {
  const sql = 'DELETE FROM users WHERE user_id = ?';
  try {
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
    throw new Error('Database error' + error.message);
  }
};

export {fetchUsers, fetchUserById, addUser, updateUser, deleteUser};
