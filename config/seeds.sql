use beer_tinder;

-- INSERT INTO drinking_buddies (username1, username2)
-- VALUES ('Jason Barnett', 'some random dude');

INSERT INTO users (username, password, first_name, last_name, age, address, email_address) 
VALUES 
('LaurenSantos23', 'password1', 'Lauren', 'Santosuosso', 33, '426 Tyner Street Akron Ohio', 'Lauren.Santosuosso@yahoo.com'),
('babyjay2114', 'hello123', 'Jason', 'Barnett', 21, '426 Tyner Street Akron Ohio', 'babyjay1497@gmail.com'),
('test', 'test', 'Iam', 'Atest', 23, 'The Cloud', 'cloud@gmail.com'),
('hello', 'test', 'Iam', 'Hello', 23, 'The Cloud', 'cloud@gmail.com'),
('world', 'test', 'Iam', 'World', 23, 'The Cloud', 'cloud@gmail.com');

-- Beer Matches
INSERT INTO beer_matches (beer_id, username, matched)
VALUES 
('abcdef', 'babyjay2114', true),
('hijklm', 'babyjay2114', true),
('nopqrs', 'babyjay2114', false),
('tuvwxy', 'babyjay2114', false),
('abcdef', 'LaurenSantos23', true),
('hijklm', 'LaurenSantos23', false),
('nopqrs', 'LaurenSantos23', true),
('tuvwxy', 'LaurenSantos23', false);