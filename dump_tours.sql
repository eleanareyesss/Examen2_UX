-- dump_tours.sql
CREATE SCHEMA IF NOT EXISTS `tourApp`;
USE `tourApp`;


CREATE TABLE IF NOT EXISTS `tours` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(150) NOT NULL,
  `description` VARCHAR(500) DEFAULT NULL,
  `price` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `capacity` INT NOT NULL DEFAULT 20,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_tour_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE IF NOT EXISTS `tour_schedules` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `tour_id` INT NOT NULL,
  `schedule_time` DATETIME NOT NULL,
  `seats_available` INT NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_tour_time` (`tour_id`, `schedule_time`),
  CONSTRAINT `fk_schedule_tour`
    FOREIGN KEY (`tour_id`) REFERENCES `tours`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE IF NOT EXISTS `reservations` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `tour_schedule_id` INT NOT NULL,
  `person_name` VARCHAR(150) NOT NULL,
  `seats_reserved` INT NOT NULL DEFAULT 1,
  `reserved_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` VARCHAR(50) NOT NULL DEFAULT 'CONFIRMED',
  PRIMARY KEY (`id`),
  KEY `idx_res_schedule` (`tour_schedule_id`),
  CONSTRAINT `fk_res_schedule`
    FOREIGN KEY (`tour_schedule_id`) REFERENCES `tour_schedules`(`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


INSERT INTO `tours` (`id`,`name`,`description`,`price`,`capacity`) VALUES
 (1,'City Walking Tour','Recorrido a pie por los puntos históricos de la ciudad. Duración 3 horas.',25.00,20),
 (2,'Sunset Boat Cruise','Paseo en barco para ver el atardecer con bebidas incluidas. Duración 2 horas.',40.00,30),
 (3,'Jungle Adventure','Excursión guiada por la selva con canopy y caminatas. Duración 6 horas.',75.00,15);


INSERT INTO `tour_schedules` (`id`,`tour_id`,`schedule_time`,`seats_available`) VALUES
 (1,1,'2025-09-25 09:00:00',20),
 (2,1,'2025-09-26 14:00:00',20),
 (3,2,'2025-09-25 17:30:00',30),
 (4,3,'2025-09-27 06:00:00',15),
 (5,3,'2025-09-28 06:00:00',15);


INSERT INTO `reservations` (`id`,`tour_schedule_id`,`person_name`,`seats_reserved`,`reserved_at`,`status`) VALUES
 (1,1,'María Pérez',2,'2025-08-01 10:00:00','CONFIRMED');