create table users(
  id serial not null primary key, 
  user_name text not null,
  user_counter integer DEFAULT 0
  );

