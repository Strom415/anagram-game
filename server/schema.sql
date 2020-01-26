CREATE DATABASE anagrams;

USE database;

CREATE TABLE  highscores3 (
  id SERIAL PRIMARY KEY,
  name VARCHAR(20),
  score SMALLINT,
  words TEXT [],
  date BIGINT
);