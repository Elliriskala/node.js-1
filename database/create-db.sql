DROP DATABASE IF EXISTS database_name;
-- Create a new database (needs a root access to DBMS)
CREATE DATABASE database_name;
-- Connect to the database
USE database_name;

-- Example

DROP DATABASE IF EXISTS mediashare;
CREATE DATABASE mediashare;
USE mediashare;

-- create table
CREATE TABLE Users (
  user_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  user_level_id INT NOT NULL,
  created_at TIMESTAMP NOT NULL
);

CREATE TABLE MediaItems (
  media_id INT NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  filename VARCHAR(255) NOT NULL,
  filesize INT NOT NULL,
  media_type VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description VARCHAR(255),
  created_at TIMESTAMP NOT NULL,
  PRIMARY KEY (media_id),
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
  user_id INT NOT NULL,
  media_id INT NOT NULL,
  PRIMARY KEY (user_id, media_id),
  FOREIGN KEY (user_id) REFERENCES Users(user_id),
  FOREIGN KEY (media_id) REFERENCES MediaItems(media_id)
);

CREATE TABLE Tags (
  tag_id INT NOT NULL AUTO_INCREMENT,
  tag_name VARCHAR(255) NOT NULL,
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

INSERT INTO Users VALUES (260, 'VCHar', 'secret123', 'vchar@example.com', 1, null);
INSERT INTO Users VALUES (305, 'Donatello', 'secret234', 'dona@example.com', 2, null);
INSERT INTO Users VALUES (310, 'Elli', 'secret345', 'elli@metropolia.fi', 1, null);
INSERT INTO Users VALUES (315, 'Joel', 'secret222', 'joel@jollujee.com', 2, null);

-- Inserting multiple records at once
INSERT INTO MediaItems (filename, filesize, title, description, user_id, media_type, created_at) 
  VALUES ('ffd8.jpg', 887574, 'Favorite drink', null, 305, 'image/jpeg', null ),
  ('dbbd.jpg', 60703, 'Miika', 'My Photo', 305, 'image/jpeg', null),
  ('2f9b.jpg', 30635, 'Aksux and Jane', 'friends', 260, 'image/jpeg', null),
  ('sunset.jpg', 204857, 'Sunset view', 'Beautiful sunset', '310', 'image/jpeg', null),
  ('vietnam.jpg', 204857, 'Vietnam', 'On a trip', '315', 'image/jpeg', null);

INSERT INTO Comments (media_id, user_id, comment_text, created_at) 
  VALUES (1, 260, 'Nice photo', null),
         (2, 305, 'I like it', null),
         (3, 260, 'Great photo', null),
         (4, 315, 'Cool!', null),
         (5, 310, 'Beautiful view', null);

INSERT INTO Likes (media_id, user_id) VALUES (1, 260), (2, 305), (3, 260), (3, 310), (4, 315), (5, 260);

INSERT INTO Tags (tag_name) VALUES ('Food'), ('Travel'), ('Friends'), ('Nature');

INSERT INTO MediaItemTags (media_id, tag_id) VALUES (1, 1), (2, 2), (3, 3), (4, 4), (5, 2);

--------

-- example of a query to update, delete, and select data

-- Viewing a user's posts and their details

-- 1. Select users whose username starts with 'D':
SELECT * FROM Users WHERE username LIKE 'D%';

-- 2. Select users created after a certain date:
SELECT * FROM Users WHERE created_at > '2023-01-01';

-- 3. Cartesian product of Users and MediaItems tables:
SELECT * FROM Users, MediaItems;

-- 4. Select all columns from both tables where user_id matches:
SELECT * FROM Users, MediaItems WHERE Users.user_id = MediaItems.user_id;

-- 5. Select all media items along with the username of the owner using an inner join:
SELECT MediaItems.*, Users.username 
FROM MediaItems 
JOIN Users ON MediaItems.user_id = Users.user_id;

-- 6. Select media items with the highest filesize for each user using a subquery:
SELECT * FROM MediaItems AS MI1
WHERE filesize = (
  SELECT MAX(filesize) FROM MediaItems AS MI2
  WHERE MI1.user_id = MI2.user_id
);

-- 7. Select all media items and all users whether they have media items or not:
SELECT 
  Users.user_id, 
  Users.username, 
  MediaItems.media_id, 
  MediaItems.title, 
  MediaItems.filename
FROM 
  Users
LEFT OUTER JOIN MediaItems 
  ON Users.user_id = MediaItems.user_id;


-- Updating data examples
-- Update a user's user level:
UPDATE Users SET user_level_id = 2 WHERE user_id = 1;

-- Update a media item's title:
UPDATE MediaItems SET title = 'Beautiful Sunset' WHERE media_id = 4;

-- Updating a comment text:
UPDATE Comments SET comment_text = 'Amazing view!' WHERE comment_id = 4;

-- Deleting data examples
-- Delete a media item:
DELETE FROM MediaItems WHERE media_id = 3;

-- Delete a comment:
DELETE FROM Comments WHERE comment_id = 1;

-- Deleting a user and cascading deletions:
DELETE FROM Users WHERE user_id = 4;  -- This will also delete related likes and comments

-- Export the database
-- To export the database, run the following command in the command line:
-- mysqldump -u username -p mediashare > mediashare_backup.sql

-- Import the database back into the SQL server
-- To import the database, run the following command in the command line:
-- mysql -u username -p mediashare < mediashare_backup.sql





