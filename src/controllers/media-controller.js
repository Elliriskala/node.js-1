import {
  fetchMediaItems,
  fetchMediaItemById,
  addMediaItem,
  updateMediaItem,
  deleteMediaItem,
} from '../models/media-model.js';
import {customError} from '../middlewares/error-handlers.js';

// Get all items
const getItems = async (req, res, next) => {
  try {
    res.json(await fetchMediaItems());
  } catch (error) {
    return next (customError(error.message, 503));
  }
};

// Get item by id
const getItemById = async (req, res, next) => {
  const id = parseInt(req.params.id);
  try {
    const item = await fetchMediaItemById(id);
    if (item) {
      return res.json(item);
    } else {
      return next(customError('Item not found', 404));
    }
  } catch (error) {
    return next(customError(error.message, 503));
  }
};

// Add a new item
const postItem = async (req, res, next) => {
  const newMediaItem = {
    // user id read from token added by authentication middleware
    user_id: req.user.user_id,
    title: req.body.title,
    description: req.body.description,
    filename: req.file.filename,
    filesize: req.file.size,
    media_type: req.file.mimetype,
  };
  try {
    const id = await addMediaItem(newMediaItem);
    res.status(201).json({message: 'Item added', id: id});
  } catch (error) {
    console.error('postItem', error.message);
    return next(customError(error.message, 503));
  }
};

// update an item by id
const putItem = async (req, res, next) => {
  const id = parseInt(req.params.id);
  const update = {
    title: req.body.title,
    description: req.body.description,
  };

  try {
    const result = await updateMediaItem(id, req.user.user_id, update);
    if (result === 0) {
      return next(customError('Media item not found or no permissions to edit', 404));
    } else {
      return res.status(200).json({message: 'Item updated', id: id});
    }
  } catch (error) {
    return next(customError(error.message, 503));
  }
};

// delete an item by id
const deleteItem = async (req, res, next) => {
  const id = parseInt(req.params.id);

  try {
    const result = await deleteMediaItem(id);
    if (result === 0) {
      return next(customError('Media item not found or no permissions to delete', 404));
    } else {
      return res.status(204).end();
    }
  } catch (error) {
    return next(customError(error.message, 500));
  }
};

export {getItems, postItem, getItemById, putItem, deleteItem};
