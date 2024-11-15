DROP DATABASE IF EXISTS database_name;
-- Create a new database (needs a root access to DBMS)
CREATE DATABASE database_name;
-- Connect to the database
USE database_name;

-- Example

DROP DATABASE IF EXISTS MediaSharingApp;
CREATE DATABASE MediaSharingApp;
USE MediaSharingApp;

-- create table

CREATE TABLE UserLevels (
    level_id INT AUTO_INCREMENT PRIMARY KEY,
    level_name VARCHAR(50) NOT NULL
);

CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    user_level_id INT,
    created_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_level_id) REFERENCES UserLevels(level_id)
);

CREATE TABLE MediaItems (
    media_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    filename VARCHAR(255) NOT NULL,
    filesize INT NOT NULL,
    media_type VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Comments (
  comment_id INT NOT NULL AUTO_INCREMENT,
  media_id INT NOT NULL,
  user_id INT NOT NULL,
  comment_text VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL,
  PRIMARY KEY (comment_id),
  FOREIGN KEY (media_id) REFERENCES MediaItems(media_id),
  FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Likes (
  like_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  media_id INT NOT NULL,
  created_at TIMESTAMP NOT NULL,
  FOREIGN KEY (media_id) REFERENCES MediaItems(media_id),
  FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Ratings (
    rating_id INT AUTO_INCREMENT PRIMARY KEY,
    media_id INT NOT NULL,
    user_id INT NOT NULL,
    rating_value INT NOT NULL CHECK (rating_value BETWEEN 1 AND 5),
    created_at TIMESTAMP NOT NULL,
    FOREIGN KEY (media_id) REFERENCES MediaItems(media_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Tags (
  tag_id INT NOT NULL AUTO_INCREMENT,
  tag_name VARCHAR(50) NOT NULL,
  PRIMARY KEY (tag_id)
);

CREATE TABLE MediaItemTags (
  media_id INT NOT NULL,
  tag_id INT NOT NULL,
  PRIMARY KEY (media_id, tag_id),
  FOREIGN KEY (media_id) REFERENCES MediaItems(media_id),
  FOREIGN KEY (tag_id) REFERENCES Tags(tag_id)
);

-- Inserting mockdata

INSERT INTO UserLevels (level_name) VALUES ('Admin'), ('User');

INSERT INTO Users VALUES (1, 'VCHar', 'secret123', 'vchar@example.com', 1, null);
INSERT INTO Users VALUES (2, 'Donatello', 'secret234', 'dona@example.com', 2, null);
INSERT INTO Users VALUES (3, 'Elli', 'secret345', 'elli@metropolia.fi', 1, null);
INSERT INTO Users VALUES (4, 'Joel', 'secret222', 'joel@jollujee.com', 2, null);

-- Inserting multiple records at once
INSERT INTO MediaItems (filename, filesize, title, description, user_id, media_type, created_at) 
  VALUES ('ffd8.jpg', 887574, 'Favorite drink', 'Delicious drink', 2, 'image/jpeg', null ),
  ('dbbd.jpg', 60703, 'Miika', 'My Photo', 2, 'image/jpeg', null),
  ('2f9b.jpg', 30635, 'Aksux and Jane', 'friends', 1, 'image/jpeg', null),
  ('sunset.jpg', 204857, 'Sunset view', 'Beautiful sunset', 3, 'image/jpeg', null),
  ('vietnam.jpg', 204857, 'Vietnam', 'On a trip', 4, 'image/jpeg', null);

INSERT INTO Comments (media_id, user_id, comment_text, created_at) 
  VALUES (1, 1, 'Nice photo', null),
         (2, 4, 'I like it', null),
         (3, 1, 'Great photo', null),
         (4, 3, 'Cool!', null),
         (4, 2, 'Beautiful view', null);

INSERT INTO Likes (media_id, user_id) VALUES (1, 1), (2, 3), (3, 1), (3, 4), (4, 3), (5, 1);

INSERT INTO Ratings (media_id, user_id, rating_value) VALUES
(1, 2, 5),
(2, 1, 4),
(1, 3, 4);

INSERT INTO Tags (tag_name) VALUES ('Food'), ('Travel'), ('Friends'), ('Nature');

INSERT INTO MediaItemTags (media_id, tag_id) VALUES (1, 1), (2, 2), (3, 3), (4, 4), (5, 2);

-- SELECTING

-- Select users whose username starts with 'E':
SELECT * FROM Users WHERE username LIKE 'E%';

-- Select all media items and the connected usernames:
SELECT MediaItems.*, Users.username 
FROM MediaItems 
JOIN Users ON MediaItems.user_id = Users.user_id;

-- Select all media items with their comments:
SELECT MediaItems.*, Comments.comment_text
FROM MediaItems
LEFT JOIN Comments ON MediaItems.media_id = Comments.media_id;

-- Select all media items with their likes:
SELECT MediaItems.*, Likes.user_id
FROM MediaItems
LEFT JOIN Likes ON MediaItems.media_id = Likes.media_id;

-- UPDATING 

-- Update a media item's title:
SELECT * FROM MediaItems WHERE Title LIKE 'S%';

UPDATE MediaItems SET title = 'Nice sunset' WHERE media_id = 4;

-- Updating a comment text:
UPDATE Comments SET comment_text = 'You look hot!' WHERE comment_id = 2;

-- DELETING

-- Delete a comment:
DELETE FROM Comments WHERE comment_id = 1;

-- Delete a like:
DELETE FROM Likes WHERE user_id = 1 AND media_id = 1;







