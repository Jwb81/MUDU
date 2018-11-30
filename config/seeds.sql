use beer_tinder;

-- INSERT INTO drinking_buddies (username1, username2)
-- VALUES ('Jason Barnett', 'some random dude');

INSERT INTO users (username, first_name, last_name, age, email_address) 
VALUES 
('LaurenSantos23', 'Lauren', 'Santosuosso', 33, 'Lauren.Santosuosso@yahoo.com'),
('babyjay2114', 'Jason', 'Barnett', 21, 'babyjay1497@gmail.com'),
('testing', 'Test', 'Account', 0, '---');

-- Beer Matches
INSERT INTO beer_matches (beer_id, username, matched)
VALUES 
('abcdef', 'babyjay2114', true),
('hijklm', 'babyjay2114', true),
('nopqrs', 'babyjay2114', false),
('tuvwxy', 'babyjay2114', false),
('abcdef', 'LaurenSantos23', true),
('hijklm', 'test', false),
('nopqrs', 'hello', true),
('tuvwxy', 'world', false);