CREATE TABLE `users` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `username` varchar(255) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `is_admin` boolean NOT NULL DEFAULT false,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `brands` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `name` varchar(255) NOT NULL UNIQUE,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `models` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `name` varchar(255) NOT NULL,
  `brand_id` int NOT NULL,
  `season` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`)
);

CREATE TABLE `tires` (
  `id` int AUTO_INCREMENT PRIMARY KEY,
  `model_id` int NOT NULL,
  `code` varchar(50) NOT NULL,
  `size` varchar(50) NOT NULL,
  `fuel_efficiency` varchar(1) NOT NULL,
  `wet_grip` varchar(1) NOT NULL,
  `noise_level` int NOT NULL,
  `price` int NOT NULL,
  `in_stock` boolean NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by_id` int,
  FOREIGN KEY (`model_id`) REFERENCES `models` (`id`),
  FOREIGN KEY (`created_by_id`) REFERENCES `users` (`id`)
);

-- Add session table for MySQL session store
CREATE TABLE `sessions` (
  `session_id` varchar(128) NOT NULL PRIMARY KEY,
  `expires` int(11) unsigned NOT NULL,
  `data` mediumtext
);