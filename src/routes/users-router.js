import express from 'express';
import {body} from 'express-validator';
import multer from 'multer';
import {
  getUsers,
  getUserById,
  postUser,
  putUser,
  removeUser,
} from '../controllers/users-controller.js';
import {authenticateToken} from '../middlewares/authentication.js';
import {validationErrorHandler} from '../middlewares/error-handlers.js';

const upload = multer({dest: 'uploads/'});

const usersRouter = express.Router();

// /api/users resource endpoints

// get all users // add a new user

usersRouter
  .route('/')

  /**
   * @api {get} /users Get all users
   * @apiVersion 1.0.0
   * @apiName GetUsers
   * @apiGroup Users
   * @apiPermission all
   *
   * @apiDescription Get all users from the database.
   *
   * @apiSuccess {Object[]} users List of users.
   * @apiSuccess {Number} users.user_id User id.
   * @apiSuccess {String} users.username Username.
   * @apiSuccess {String} users.email Email.
   * @apiSuccess {String} users.password Password.
   *
   * @apiSuccessExample Success-Response:
   *    HTTP/1.1 200 OK
   *   {
   *    "users":
   *    [
   *     {
   *      "user_id": 1,
   *      "username": "johnd",
   *      "email": "example@email.com",
   *      "password": "examplepass"
   *     },
   *    ]
   *   }
   *
   * @apiErrorExample Error-Response:
   *    HTTP/1.1 404 Not Found
   *    {
   *      "message": "No users found"
   *    }
   *
   */

  .get(getUsers)

  /**
   * @api {post} /users Add a new user
   * @apiVersion 1.0.0
   * @apiName PostUser
   * @apiGroup Users
   * @apiPermission all
   *
   * @apiDescription Add a new user to the database.
   *
   * @apiParam {String} username Username of the user.
   * @apiParam {String} password Password of the user.
   * @apiParam {String} email Email of the user.
   *
   * @apiParamExample {json} Request-Example:
   *  {
   *    "username": "somename"
   *    "password": "somepassword"
   *    "email": "example@email.com
   *  }
   *
   * @apiSuccess {String} message Success message.
   *   HTTP/1.1 200 OK
   *  {
   *   "message": "New user added",
   *   "id": <user_id>
   *  }
   *
   * @apiErrorExample Error-Response:
   *    HTTP/1.1 400 Bad Request
   *    {
   *      "message": "Invalid input"
   *    }
   *
   */

  .post(upload.none(), postUser);

// get user by id // update user by id

usersRouter.route('/:id')

/**
   * @api {get} /users/:id Get user by id
   * @apiVersion 1.0.0
   * @apiName GetUserById
   * @apiGroup Users
   * @apiPermission all
   * 
   * @apiDescription Get a user by id from the database.
   * 
   * @apiParam {Number} id User id.
   * 
   * @apiSuccess {Number} user_id User id.
   * @apiSuccess {String} username Username.
   * @apiSuccess {String} email Email.
   * @apiSuccess {String} password Password.
   * 
   * @apiSuccessExample Success-Response:
   *   HTTP/1.1 200 OK
   *    {
   *      "user_id": 1,
   *      "username": "johnd",
   *      "email": "example@email.com",
   *      "password": "examplepass"
   *    }
   * 
   * @apiErrorExample Error-Response:
   *   HTTP/1.1 404 Not Found
   *    {
   *      "message": "User not found"
   *    }
   * 
   * 
   */

  .get(getUserById)

  /**
   * @api {put} /users/:id Update user by id
   * @apiVersion 1.0.0
   * @apiName PutUser
   * @apiGroup Users
   * @apiPermission token
   * 
   * @apiDescription Update a user by id in the database.
   * 
   * @apiParam {String} username Username of the user.
   * @apiParam {String} password Password of the user.
   * @apiParam {String} email Email of the user.
   * 
   * @apiParamExample {json} Request-Example:
   *  {
   *   "username": "somename"
   *   "password": "somepassword"
   *   "email": "example@email.com"
   *  }
   * 
   * @apiSuccess {String} message Success message.
   *   HTTP/1.1 200 OK
   *   {
   *    "message": "User updated"
   *    "id": <user_id>
   *   }
   * 
   * @apiErrorExample Error-Response:
   *  HTTP/1.1 400 Forbidden
   *  {
   *   "message": "Forbidden: you are not allowed to update this user"
   *  }
   * 
   * 
   */

  .put(
    authenticateToken,
    body('username').trim().isAlphanumeric().isLength({min: 3, max: 20}),
    body('password').isString().isLength({min: 8}),
    body('email').isEmail(),
    upload.none(),
    validationErrorHandler,
    putUser,
  )

  /**
   * @api {delete} /users/:id Delete user by id
   * @apiVersion 1.0.0
   * @apiName DeleteUser
   * @apiGroup Users
   * @apiPermission token
   * 
   * @apiDescription Delete a user by id from the database.
   * 
   * @apiSuccess {String} message Success message.
   *  HTTP/1.1 200 OK
   *  {
   *    "message": "User deleted",
   *    "id": <user_id>
   *  }
   * 
   * @apiErrorExample Error-Response:
   *  HTTP/1.1 400 Forbidden
   *  {
   *    "message": "Forbidden: you are not allowed to delete this user"
   *  }
   */
  .delete(authenticateToken, removeUser);

export default usersRouter;

/*

.route('/')
  .get(getItems)
  .post(upload.single('file'), postItem);

mediaRouter.get('/api/users', (req, res) => {
  getUsers(res);
});

mediaRouter.get('/api/users/:id', (req, res) => {
  getUserById(req, res);
});

app.post('/api/users', (req, res) => {
  postUser(req, res);
});


// updating an user
app.put('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  putUser(id, req, res);
});

app.put('/api/media', (req, res) => {
  // TODO: implement this endpoint
  res.status(501).json({message: 'Under construction'});
});


// deleting an user
app.delete('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  deleteUser(id, res);
});

*/
