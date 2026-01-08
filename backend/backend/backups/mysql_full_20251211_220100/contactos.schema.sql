CREATE TABLE `contactos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(120) NOT NULL,
  `email` varchar(160) NOT NULL,
  `telefono` varchar(30) DEFAULT NULL,
  `mensaje` text NOT NULL,
  `productoId` int(11) DEFAULT NULL,
  `estado` varchar(20) NOT NULL DEFAULT 'nuevo',
  `creadoEn` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
