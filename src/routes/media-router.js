import express from 'express';
import multer from 'multer';
import {body} from 'express-validator';
import 'dotenv/config';
import {
  getItems,
  postItem,
  getItemById,
  putItem,
  deleteItem,
} from '../controllers/media-controller.js'; // import the functions from the controller
import {authenticateToken} from '../middlewares/authentication.js';

const upload = multer({
  dest: 'uploads/',
  limits: {fileSize: 1024 * 1024 * process.env.MAX_UPLOAD_SIZE},
  fileFilter: (req, file, cb) => {
    // allow only images and videos
    if (
      file.mimetype.startsWith('image/') ||
      file.mimetype.startsWith('video/')
    ) {
      // accept file
      cb(null, true);
    } else {
      // reject file
      cb(null, false);
    }
  },
});

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
    postItem,
  );

// getting item by id // updating an item // deleting an item

mediaRouter
  .route('/:id')
  .get(getItemById)
  .put(authenticateToken, putItem)
  .delete(authenticateToken, deleteItem);

export default mediaRouter;
