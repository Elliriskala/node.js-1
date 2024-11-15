import express from 'express';
import multer from 'multer';
import {getItems, postItem, getItemById, putItem, deleteItem} from '../controllers/media-controller.js';  // import the functions from the controller

const upload = multer({ dest: 'uploads/' });

const mediaRouter = express.Router();

// /api/media resource endpoints

// get all media items, add a new media item

mediaRouter
  .route('/')
  .get(getItems)
  .post(upload.single('file'), postItem);

// getting item by id // updating an item // deleting an item

mediaRouter.route('/:id')
.get(getItemById)
.put(upload.none(), putItem)
.delete(deleteItem);

export default mediaRouter;