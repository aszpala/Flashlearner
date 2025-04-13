DROP TABLE IF EXISTS user_sets;
DROP TABLE IF EXISTS flashcards;
DROP TABLE IF EXISTS sets;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
                       id INTEGER PRIMARY KEY AUTOINCREMENT,
                       username VARCHAR(20) NOT NULL,
                       email VARCHAR(50) NOT NULL,
                       password VARCHAR(20) NOT NULL,
                       type VARCHAR(20),
                       CHECK (type IN ('admin', 'user'))
);

CREATE TABLE sets (
                      id INTEGER PRIMARY KEY AUTOINCREMENT,
                      name VARCHAR(30) NOT NULL,
                      language VARCHAR(20),
                      translation VARCHAR(20),
                      status VARCHAR(20),
                      user_id INTEGER,
                      CHECK (status IN ('public', 'private')),
                      FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE flashcards (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            word VARCHAR(30) NOT NULL,
                            translation VARCHAR(30),
                            set_id INTEGER,
                            FOREIGN KEY (set_id) REFERENCES sets(id)
);

CREATE TABLE user_sets (
                           user_id INTEGER,
                           set_id INTEGER,
                           points INTEGER,
                           total INTEGER,
                           last_updated DATETIME,
                           PRIMARY KEY (user_id, set_id),
                           FOREIGN KEY (user_id) REFERENCES users(id),
                           FOREIGN KEY (set_id) REFERENCES sets(id)
);

INSERT INTO users (username, email, password, type)
VALUES ('aniaszpala14', 's27542@pjwstk.edu.pl', 'tin14', 'admin');

INSERT INTO users (username, email, password, type)
VALUES ('michk', 's27799@pjwstk.edu.pl', 'tin29', 'admin');

INSERT INTO users (username, email, password, type)
VALUES ('kasia', 'k@pjwstk.edu.pl', 'tin29@33', 'user');

INSERT INTO sets (name, language, translation, status, user_id)
VALUES ('Furniture', 'English', 'Spanish', 'public', 1);

INSERT INTO sets (name, language, translation, status, user_id)
VALUES ('FurniturePrivate', 'English', 'Spanish', 'private', 1);


INSERT INTO flashcards (word, translation, set_id)
VALUES ('hello', 'hola', 1);

INSERT INTO flashcards (word, translation, set_id)
VALUES ('thanks', 'gracias', 1);

SELECT * FROM sets WHERE status = 'public';

DELETE FROM user_sets WHERE user_id=6;