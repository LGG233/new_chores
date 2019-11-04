drop database if exists chores_db;
create database chores_db;
use chores_db;

drop table if exists users;
create table users
(
    user_id int not null
    auto_increment,
    username varchar
    (255) not null,
    `password` varchar
    (255) not null,
    email varchar
    (10) not null,
    createdAt timestamp default CURRENT_TIMESTAMP not null,
    updatedAt timestamp default CURRENT_TIMESTAMP not null,
    primary key
    (user_id)
);

    drop table if exists chores;
    create table chores
    (
        chore_id int not null
        auto_increment,
    username int not null,
    chore varchar
        (255) not null,
    overview text
        (1000) null,
    chore_state boolean not null default 0,
    due_date date not null,
    createdAt timestamp default CURRENT_TIMESTAMP not null,
    updatedAt timestamp default CURRENT_TIMESTAMP not null,
    foreign key
        (user_id) references users
        (user_id),
	primary key
        (chore_id)
);
        SELECT *
        FROM chores;

