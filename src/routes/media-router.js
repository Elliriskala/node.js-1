import express from 'express';
import {body} from 'express-validator';
import 'dotenv/config';
import upload from '../middlewares/upload.js';
import {
  getItems,
  postItem,
  getItemById,
  putItem,
  deleteItem,
} from '../controllers/media-controller.js'; // import the functions from the controller
import {authenticateToken} from '../middlewares/authentication.js';
import { validationErrorHandler } from '../middlewares/error-handlers.js';


const mediaRouter = express.Router();

// /api/media resource endpoints

// get all media items, add a new media item

mediaRouter
  .route('/')
  .get(getItems)
  .post(
    authenticateToken,
    upload.single('file'),
    body('title').trim().isLength({min: 3, max: 50}),
    body('description').trim().isLength({max: 255}),
    validationErrorHandler,
    postItem,
  );

// getting item by id // updating an item // deleting an item

mediaRouter
  .route('/:id')
  .get(getItemById)
  .put(authenticateToken, putItem)
  .delete(authenticateToken, deleteItem);

export default mediaRouter;
