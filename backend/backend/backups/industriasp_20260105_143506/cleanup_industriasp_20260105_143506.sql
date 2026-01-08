SET FOREIGN_KEY_CHECKS=0;
DELETE FROM `orders` WHERE `userId` IS NULL OR `userId` <> 1;
DELETE FROM `quotes`;
DELETE FROM `contactos`;
DELETE FROM `reportes`;
DELETE FROM `products`;
DELETE FROM `categorias`;
DELETE FROM `users` WHERE `id` <> 1;
SET FOREIGN_KEY_CHECKS=1;
