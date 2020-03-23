DROP TABLE IF EXISTS cart;
DROP TABLE IF EXISTS item_custom;
DROP TABLE IF EXISTS inlay;
DROP TABLE IF EXISTS material;
DROP TABLE IF EXISTS item_data;
DROP TABLE IF EXISTS user_data;

CREATE TABLE user_data (
   ID             SERIAL         NOT NULL PRIMARY KEY,
   Username       VARCHAR(100)   NOT NULL UNIQUE,
   Password       VARCHAR(100)   NOT NULL,
   Display_Name   VARCHAR(100)   NOT NULL
);

CREATE TABLE item_data (
   ID          SERIAL         NOT NULL PRIMARY KEY,
   Name        VARCHAR(50)    NOT NULL,
   Description TEXT           NOT NULL,
   Price       INT            DEFAULT 0,
   Image_URL   VARCHAR(300)   DEFAULT '/assets/images/ImageNotFound.png'
);

CREATE TABLE material (
   ID    SERIAL   NOT NULL PRIMARY KEY,
   Price INT      DEFAULT 0
);

CREATE TABLE inlay (
   ID    SERIAL   NOT NULL PRIMARY KEY,
   Price INT      DEFAULT 0
);

CREATE TABLE item_custom (
   ID                   SERIAL   NOT NULL PRIMARY KEY,
   Material_ID          INT      NOT NULL REFERENCES material(id),
   Inlay_ID             INT      NOT NULL REFERENCES inlay(id),
   Customized_Options   TEXT     NOT NULL
);

CREATE TABLE cart (
   ID       SERIAL   NOT NULL PRIMARY KEY,
   User_ID  INT      NOT NULL REFERENCES user_data(id),
   Item_ID  INT      NOT NULL REFERENCES item_data(id)
);