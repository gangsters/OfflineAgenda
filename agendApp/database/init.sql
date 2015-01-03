/* Creation of AgendApp database */
create database AgendApp;
use AgendApp;

/* Creation of a user for the server */
create user usertest@localhost;
set password for usertest@localhost = password('passwordtest');
grant all on AgendApp.* to usertest@localhost;

/* Creation of the database structure */
create table Event (
	id integer unique not null auto_increment,
	title varchar(255) not null,
	begin_date varchar(255) not null,
	end_date varchar(255),
	primary key(id)
);
