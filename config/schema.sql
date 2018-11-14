DROP DATABASE IF EXISTS beer_tinder;
CREATE DATABASE beer_tinder;

USE beer_tinder;

CREATE TABLE users  (
    username VARCHAR(200) NOT NULL,
    password VARCHAR(200) NOT NULL,
    first_name VARCHAR(200) NOT NULL,
    last_name VARCHAR(200) NOT NULL,
    age INT NOT NULL,
    address varchar(200) NOT NULL,
    email_address VARCHAR(200) NOT NULL,
    PRIMARY KEY (username)
);

CREATE TABLE beer_matches (
    beer_id  VARCHAR(200) NOT NULL,
    username VARCHAR(200) NOT NULL,
    matched boolean,
    primary key (beer_id, username)
    

);

CREATE TABLE drinking_buddies (
	username1 VARCHAR(200) NOT NULL,
    username2 VARCHAR(200) NOT NULL,

    PRIMARY KEY(username1, username2)
);