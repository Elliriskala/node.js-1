APIS

Base URL: http://localhost:3000/api

1. Media Endpoints

Get All Media Items

- Endpoint: GET /api/media
- Returns a list of all media items.
- Response: 200 OK – JSON array of media items.

- SQL Statement: SELECT \* FROM media;

Get Media Item by ID

- Endpoint: GET /api/media/:id
- Fetches a media item by its ID.
- Response: 200 OK or 404 Not Found

- SQL Statement: SELECT \* FROM media WHERE id = ?;

Create a New Media Item

- Endpoint: POST /api/media
- Adds a new media item.
- Implements file upload with multer
- Response: 201 Created or 400 Bad Request

- SQL Statement: INSERT INTO mediaItems
  (user_id, title, description, filename, filesize, media_type, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?);

Update a Media Item

- Endpoint: PUT /api/media/:id
- Updates a media item by ID. Only fields provided in the request body are updated. Request Body: title, description, etc.
- Response: 200 OK or 404 Not Found

- SQL Statement: UPDATE mediaItems SET title = ?, description = ? WHERE media_id = ?;

Delete a Media Item

- Endpoint: DELETE /api/media/:id
- Deletes a media item by ID.
- Response: 204 No Content or 404 Not Found

- SQL Statement: DELETE FROM media WHERE id = ?;
- SQL Statement: DELETE FROM mediaItemTags WHERE media_id = ?;

2. Users endpoints

Get All Users

- Endpoint: GET /api/users
- Returns a list of all users.
- Response: 200 OK

- SQL Statement: SELECT \* FROM users WHERE id = ?;

Get User by ID

- Endpoint: GET /api/users/:id
- Fetches a user by ID.
- Response: 200 OK or 404 not found

- SQL Statement: SELECT \* FROM users WHERE id = ?;

Create a New User

- Endpoint: POST /api/users
- Adds a new user.
- Response: 201 Created or 400 Bad request

- SQL Statement: INSERT INTO users
  (username, password, email, user_level_id, created_at)
  VALUES (?, ?, ?, ?, ?);

Update a User

- Endpoint: PUT /api/users/:id
- Updates a user by ID. Only fields provided in the request body are updated.
- Response: 200 OK or 404 Not Found

- SQL Statement: UPDATE users SET
  username = ?,
  password = ?,
  email = ?,
  user_level_id = ?
  WHERE user_id = ?;

Delete a user

- Endpoint: DELETE /api/users/:id
- Deletes a user by ID.
- Response: 204 no content or 404 not found

- SQL Statement: DELETE FROM users WHERE id = ?;

3. Comments endpoints

Get all comments

- Endpoint: GET /api/comments
- SQL Statement: SELECT \* FROM comments;

- This endpoint retrieves all comments from the database, useful for an admin.

Get comment

- Endpoint: GET /api/comments/:id
- SQL Statement: SELECT \* FROM comments WHERE media_id = ?;

- Fetches a specific comment by its id. This is useful for viewing or managing a particular comment.

Get comment by user

- Endpoint: GET /api/comments/users/:id
- SQL Statement: SELECT \* FROM comments WHERE user_id = ?;

- Lists all comments made by a specific user, identified by their user_id. Useful for displaying a user's activity.

Post comment

- Endpoint: POST /api/comments
- SQL Statement: INSERT INTO comments
  (comment_id, user_id, media_id, comment_text, created_at)
  VALUES (?, ?, ?, ?, ?);

- Adds a new comment to the database. Allows users to leave a comment on a media item. The comment is linked to the user_id and media_id.

Update comment

- Endpoint: PUT /api/comments/:id
- SQL Statement: UPDATE comments SET comment_text = ?, created_at = ? WHERE comment_id = ?;

- Allows a user to edit their comment. This is useful for correcting mistakes.

Delete comment

- Endpoint: DELETE /api/comments/:id
- SQL Statement: DELETE FROM comments WHERE id = ?;

- Removes a comment by its id. Useful for an admin or if the user decides to delete their comment.

# Media sharing app example REST API application

## Installation

1. Clone
2. Run 'npm install'
3. Create database
4. Create .env file (see '.env.sample')

## Run

1. Run 'npm run dev'
