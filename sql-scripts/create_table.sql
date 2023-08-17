CREATE TABLE album (
    id INT PRIMARY KEY,
    idartista INT,
    nombre VARCHAR(255),
    lanzamiento DATE,
    sellodiscografico VARCHAR(255)
);

CREATE TABLE artist (
    id INT PRIMARY KEY,
    nombre VARCHAR(255),
    generomusica VARCHAR(100),
    nacimiento DATE,
    paisorigen VARCHAR(100)
);

INSERT INTO album
(id, idartista, nombre, lanzamiento, sellodiscografico)
VALUES(1, 2, 'Como le Digo', '2022-05-05', 'Music');

INSERT INTO album
(id, idartista, nombre, lanzamiento, sellodiscografico)
VALUES(2, 1, 'Givenchi', '2022-05-05', 'Music');

INSERT INTO artist
(id, nombre, generomusica, nacimiento, paisorigen)
VALUES(1, 'Duki', 'Trap', '2022-11-22', 'Argentina');

INSERT INTO artist
(id, nombre, generomusica, nacimiento, paisorigen)
VALUES(2, 'Khea', 'Trap', '2023-12-05', 'Argentina');

