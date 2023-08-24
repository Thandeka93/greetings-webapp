CREATE TABLE users(
  id SERIAL NOT NULL PRIMARY KEY, 
  user_name TEXT NOT NULL,
  user_counter INTEGER DEFAULT 0
  );


