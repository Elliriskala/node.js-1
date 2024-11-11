APIS

Base URL: http://localhost:3000/api

1. Media Endpoints

Get All Media Items

- Endpoint: GET /api/media
- Returns a list of all media items.
- Response: 200 OK – JSON array of media items.

Get Media Item by ID

- Endpoint: GET /api/media/:id
- Fetches a media item by its ID.
- Response: 200 OK or 404 Not Found

Create a New Media Item

- Endpoint: POST /api/media
- Adds a new media item.
- Response: 201 Created or 400 Bad Request

Update a Media Item

- Endpoint: PUT /api/media/:id
- Updates a media item by ID. Only fields provided in the request body are updated. Request Body: title, description, etc.
- Response: 200 OK or 404 Not Found 

Delete a Media Item
- Endpoint: DELETE /api/media/:id
- Deletes a media item by ID.
- Response: 204 No Content or 404 Not Found

2. Users endpoints

Get All Users

- Endpoint: GET /api/users
- Returns a list of all users.
- Response: 200 OK 

Get User by ID

- Endpoint: GET /api/users/:id
- Fetches a user by ID.
- Response: 200 OK or 404 not found

Create a New User

- Endpoint: POST /api/users
- Adds a new user.
- Response: 201 Created or 400 Bad request

Update a User

- Endpoint: PUT /api/users/:id
- Updates a user by ID. Only fields provided in the request body are updated.
- Response: 200 OK or 404 Not Found

Delete a user

- Endpoint: DELETE /api/users/:id
- Deletes a user by ID.
- Response: 204 no content or 404 not found
