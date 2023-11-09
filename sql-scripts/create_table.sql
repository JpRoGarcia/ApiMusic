CREATE TABLE artist (
    id INT PRIMARY KEY,
    nombre VARCHAR(255),
    generomusica VARCHAR(100),
    nacimiento DATE,
    paisorigen VARCHAR(100)
);

INSERT INTO artist
(id, nombre, generomusica, nacimiento, paisorigen)
VALUES(1, 'Duki', 'Trap', '2022-11-22', 'Argentina');

INSERT INTO artist
(id, nombre, generomusica, nacimiento, paisorigen)
VALUES(2, 'Khea', 'Trap', '2023-12-05', 'Argentina');

