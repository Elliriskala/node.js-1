import express from 'express';
import {body} from 'express-validator';
import {postLogin, getMe} from '../controllers/auth-controller.js';
import {authenticateToken} from '../middlewares/authentication.js';
import {postUser} from '../controllers/users-controller.js';
import {validationErrorHandler} from '../middlewares/error-handlers.js';
import loginLimiter from '../middlewares/rate-limit.js';

const authRouter = express.Router();

/**
 * @apiDefine all No authentication needed.
 */

/**
 * @apiDefine token Logged in user access only
 * Valid authentication token must be provided within request.
 */

/**
 * @apiDefine UnauthorizedError
 * @apiError UnauthorizedError User name or password invalid.
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 403 Forbidden
 *     {
 *       "error": {
 *         "message": "username/password invalid",
 *         "status": 401
 *       }
 *     }
 */

authRouter
  .route('/login')

  /**
   * @api {post} /login Login
   * @apiVersion 1.0.0
   * @apiName PostLogin
   * @apiGroup Authentication
   * @apiPermission all
   *
   * @apiDescription Sign in and get an authentication token for the user.
   *
   * @apiParam {String} username Username of the user.
   * @apiParam {String} password Password of the user.
   *
   * @apiParamExample {json} Request-Example:
   *    {
   *      "username": "johnd",
   *      "password": "examplepass"
   *    }
   *
   * @apiSuccess {String} token Token for the user authentication.
   * @apiSuccess {Object} user User info.
   *
   * @apiSuccessExample Success-Response:
   *    HTTP/1.1 200 OK
   *    {
   *      "message": "Logged in successfully",
   *      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyMSwid
   *                XNlcm5hbWUiOiJ1dXNpMSIsImVtYWlsIjoidXVzaTFAZXhhbXBsZS5jb20
   *                iLCJ1c2VyX2xldmVsX2lkIjoyLCJpYXQiOjE3MDEyNzkzMjJ9.3TbVTcXS
   *                dryTDm_huuXC_U1Lg4rL0SOFyn_WAsC6W0Y"
   *      "user": {
   *        "user_id": 21,
   *        "username": "johnd",
   *        "email": "johnd@example.com",
   *        "user_level_id": 2
   *      }
   *    }
   *
   * @apiUse UnauthorizedError
   */

  .post(loginLimiter, postLogin);

authRouter
  .route('/me')

  /**
   * @api {get} /me Get user info
   * @apiVersion 1.0.0
   * @apiName GetMe
   * @apiGroup Authentication
   * @apiPermission token
   *
   * @apiHeader {String} Authorization Bearer token for the user authentication.
   * @apiheaderExample {json} Header-Example:
   *    Authorization: "Bearer <token>"
   *
   * @apiDescription Get user info.
   *
   * @apiSuccess {Object} user User info.
   * @apiSuccessExample Success-Response:
   *   HTTP/1.1 200 OK
   *  {
   *   "user_id": 21,
   *   "username": "johnd",
   *   "email": "<email>",
   *   "user_level_id": 2
   *   }
   *
   * @apiUse UnauthorizedError
   * @apiUse token
   * @apiUse UnauthorizedError
   * @apiErrorExample Error-Response:
   *   HTTP/1.1 401 Unauthorized
   *   {
   *      "error": 
   *    {
   *      "message": "Unauthorized",
   *      "status": 401
   *    }
   *   }
   *
   */

  .get(authenticateToken, getMe);

authRouter
  .route('/register')

  /**
   * @api {post} /register Register
   * @apiVersion 1.0.0
   * @apiName PostRegister
   * @apiGroup Authentication
   * @apiPermission all
   *
   * @apiDescription Register a new user.
   *
   * @apiParam {String} username Username of the user.
   * @apiParam {String} password Password of the user.
   * @apiParam {String} email Email of the user.
   *
   * @apiParamExample {json} Request-Example:
   *   {
   *    "username": "somename"
   *    "password": "somepassword"
   *    "email": "example@email.com"
   *    }
   *
   * @apiSuccess {String} message Success message.
   *    HTTP/1.1 200 OK
   *   {
   *    "message": "New user added",
   *     "id": <user_id>
   *  }
   *
   * @apiError {String} message Error message.
   * @apiErrorExample Error-Response:
   *    HTTP/1.1 400 Bad Request
   *   {
   *   "message": "Error message"
   *   }
   *
   */

  .post(
    body('username').trim().isAlphanumeric().isLength({min: 3, max: 20}),
    body('password').isLength({min: 8}),
    body('email').isEmail(),
    validationErrorHandler,
    postUser,
  );

export default authRouter;
