CREATE SCHEMA IF NOT EXISTS foodapp;
SET search_path TO foodapp;

CREATE TABLE IF NOT EXISTS restaurants (
  id SERIAL PRIMARY KEY,
  name VARCHAR(45) NOT NULL UNIQUE,
  description VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS restaurant_availability (
  id SERIAL PRIMARY KEY,
  restaurant_id INT NOT NULL,
  schedule_time TIMESTAMP NOT NULL,
  reserved BOOLEAN NOT NULL DEFAULT FALSE,
  reserved_by VARCHAR(45),
  CONSTRAINT fk_restaurant_id FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
);

INSERT INTO restaurants (name, description) VALUES
  ('La Casca','Consumo en el lugar · Terraza o mesas al aire libre · Retiro desde el coche'),
  ('Portal de las carnes','Disfrute de las mejores carnes y vinos en un ambiente único de la ciudad de San Pedro Sula.'),
  ('Factory Steak & Lobster','Experience the best steak and lobster in San Pedro Sula at Factory Steak and Lobster');

INSERT INTO restaurant_availability (restaurant_id, schedule_time, reserved, reserved_by) VALUES
  (1,'2023-06-20 08:00:00',FALSE,NULL),
  (1,'2023-06-20 09:00:00',FALSE,NULL),
  (2,'2023-06-21 10:00:00',FALSE,NULL),
  (2,'2023-06-21 11:00:00',FALSE,NULL),
  (3,'2023-06-22 07:00:00',FALSE,NULL),
  (3,'2023-06-22 09:00:00',FALSE,NULL),
  (1,'2021-06-20 08:00:00',FALSE,NULL);