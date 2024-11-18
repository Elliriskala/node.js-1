import express from 'express';
import multer from 'multer';
import {getItems, postItem, getItemById, putItem, deleteItem} from '../controllers/media-controller.js';  // import the functions from the controller
import {authenticateToken} from '../middlewares/authentication.js';

const upload = multer({ dest: 'uploads/' });

const mediaRouter = express.Router();

// /api/media resource endpoints

// get all media items, add a new media item

mediaRouter
  .route('/')
  .get(getItems)
  .post(authenticateToken, upload.single('file'), postItem);

// getting item by id // updating an item // deleting an item

mediaRouter.route('/:id')
.get(getItemById)
.put(authenticateToken, putItem)
.delete(authenticateToken, deleteItem);

export default mediaRouter;