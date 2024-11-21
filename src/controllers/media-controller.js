import {validationResult} from 'express-validator';
import {
  fetchMediaItems,
  fetchMediaItemById,
  addMediaItem,
  updateMediaItem,
  deleteMediaItem,
} from '../models/media-model.js';

// Get all items
const getItems = async (req, res) => {
  try {
    res.json(await fetchMediaItems());
  } catch (error) {
    console.error('getItems', error.message);
    res.status(503).json({error: 503, message: 'Database error'});
  }
};

// Get item by id
const getItemById = async (req, res) => {
  const id = parseInt(req.params.id);
  console.log('getItemById', id);
  try {
    const item = await fetchMediaItemById(id);
    if (!item) {
      res.status(404).json({error: 404, message: 'Item not found'});
    } else {
      return res.json(item);
    }
  } catch (error) {
    console.error('getItemById', error.message);
    res.status(503).json({error: 503, message: 'Database error'});
  }
};

// Add a new item
const postItem = async (req, res) => {
  // input validatation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
  } else if (!req.file) {
    return res.status(400).json({message: 'File is required'});
  }
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
    res
      .status(500)
      .json({error: 500, message: 'Database error: unable to add item'});
  }
};

// update an item by id
const putItem = async (req, res) => {
  const id = parseInt(req.params.id);
  const update = {
    title: req.body.title,
    description: req.body.description,
  };

  try {
    const result = await updateMediaItem(id, req.user.user_id, update);
    if (result === 0) {
      return res
        .status(404)
        .json({message: 'Media item not found or no permissions to edit'});
    }
    res.status(200).json({message: 'Item updated', id: id});
  } catch (error) {
    console.error('putItem', error.message);
    res.status(503).json({error: 503, message: 'Database error'});
  }
};

// delete an item by id
const deleteItem = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const result = await deleteMediaItem(id);
    if (result === 0) {
      return res.status(404).json({message: 'Item not found'});
    }
    res.status(204).end();
  } catch (error) {
    console.error('deleteItem', error.message);
    res
      .status(500)
      .json({error: 500, message: 'Database error: unable to delete item'});
  }
};

export {getItems, postItem, getItemById, putItem, deleteItem};
