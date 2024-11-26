import multer from 'multer';
import {customError} from '../middlewares/error-handlers.js';

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
      const error = customError('File invalid', 400);
      cb(error, false);
    }
  },
});

export default upload;
