import express from 'express';
import helmet from 'helmet';
import mediaRouter from '../src/routes/media-router.js';
import usersRouter from '../src/routes/users-router.js';
import commentsRouter from '../src/routes/comments-router.js';
import authRouter from '../src/routes/auth-router.js';
import { errorHandler, notFoundHandler  } from './middlewares/error-handlers.js';
const hostname = '127.0.0.1';
const port = 3000;
const app = express();

app.set('view engine', 'pug');
app.set('views', 'src/views');

app.use(helmet());

app.disable('x-powered-by');

app.use(express.json());

// Home page (client) as static HTML, CSS, js
app.use(express.static('public'));

// Uploaded media files
app.use('/uploads', express.static('uploads'));

// Documendation website by Apidoc
app.use('/api', express.static('doc'));


// not used anymore beacause of the new routes
// Api documentation with pug
app.get('/api', (req, res) => {
  res.render('index', {
    title: 'API documentation',
    message: 'TODO: include docs here!',
  });
});

// log in

app.use('/api/auth', authRouter);

// Media resource endpoints

app.use('/api/media', mediaRouter);

// User resource endpoints

app.use('/api/users', usersRouter);

// Comments resource endpoints

app.use('/api/comments', commentsRouter);

// Error handlers
// default route, if none of the above routes match

app.use(notFoundHandler);

// add error handler middleware last
app.use(errorHandler);

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
