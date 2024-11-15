-- User creation example, replace name and password with your own
-- real credentials are stored in .env file
CREATE USER 'username'@'localhost' IDENTIFIED BY 'pw';
GRANT ALL PRIVILEGES ON `MediaSharingApp`.* TO 'usermame'@'localhost';