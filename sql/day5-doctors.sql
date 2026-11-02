create table doctors (
    id int generated always as identity primary key,
    first_name varchar(50) not null,
    last_name varchar(50) not null,
    specialty varchar(100) not null,
    phone varchar(15),
    email varchar(100)
);