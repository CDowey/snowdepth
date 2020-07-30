CREATE DATABASE "SnowDepths";

CREATE TABLE depths (
    depth_id    SERIAL PRIMARY KEY,
    station_id  varchar(40) NOT NULL,
    date	    date NOT NULL,
	depth_in	real
);