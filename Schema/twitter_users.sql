-- MySQL dump 10.13  Distrib 8.0.36, for Linux (x86_64)
--
-- Host: localhost    Database: twitter
-- ------------------------------------------------------
-- Server version	8.0.45-0ubuntu0.22.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `users`
--

USE twitter_clone;
DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `f_name` varchar(100) DEFAULT NULL,
  `l_name` varchar(100) DEFAULT NULL,
  `username` varchar(50) DEFAULT NULL,
  `profile_photo_url` varchar(255) DEFAULT NULL,
  `bio` varchar(225) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `cover_image_url` varchar(255) DEFAULT NULL,
  `locked_until` timestamp NULL DEFAULT NULL,
  `max_login_attempts` int DEFAULT '3',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `timezone` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'sahil','sheikh','sahil123456',NULL,'i am sahil sheikh','sahil@gmail.com','2023-10-25','$2b$10$9InG9JBL8IOulIWi4Ndr6OMydA4I8NqGXrzSGPRprv8i5EiaZ969.',NULL,'2026-04-29 08:57:20',0,'2026-04-24 06:51:42','2026-04-29 08:55:19',NULL),(3,'sahil','sheikh','sahil123',NULL,NULL,'sahil123@gmail.com','2023-10-25','$2b$10$GTzpKU8xVwsAWhj8cWctQ.MPkWg07HhHjDdNYysFOTjrlAz4qt7Si',NULL,'2026-04-29 13:38:31',0,'2026-04-27 12:29:39','2026-04-29 13:36:30',NULL),(4,'sahil','sheikh','sahil1234567','/home/sahil-sheikh/sahil/TypeScript-TUTs/twitter-clone/src/public/uploads/1777441301647-image.png','i am sahil sheikh','sahil1234@gmail.com','2023-10-25','$2b$10$kdZWTdjKHsxN/sMtylH9sOtBJ.EPzSIUChdEEBFALQyQvaz7HfOTa','/home/sahil-sheikh/sahil/TypeScript-TUTs/twitter-clone/src/public/uploads/1777441301655-image(1).png',NULL,2,'2026-04-28 06:14:28','2026-04-29 09:19:05',NULL),(5,'asdfasdf','asdfasdf','asdfgasdf',NULL,NULL,'sahil1@gmail.com','2026-04-16','$2b$10$aKXpDHpxVeTjxQfJXNB2.uPiO1VdcX6qsF/XhpGJrx4GHHpyMTAdK',NULL,'2026-04-29 08:57:20',3,'2026-04-29 06:45:33','2026-04-29 08:55:19','Asia/Kolkata'),(6,'asdfasdf','asdfasdfsaqdf','asdfasdf',NULL,NULL,'sahil12@gmail.com','2026-04-29','$2b$10$RldpzFxdIZtWdOOi6k5v7uUrNb.V6t9FymBMM/Wb6O4NAmvZUZfx2',NULL,'2026-04-29 08:57:20',3,'2026-04-29 06:49:47','2026-04-29 08:55:19','Asia/Kolkata'),(7,'asdfasdf','asdfasdf','saasdfa',NULL,NULL,'sahil12345678@gmail.com','2026-04-29','$2b$10$hXmgzEu32TI6wKDwUhFlX.WfJOKsMqZeQbfGbAciYkS8g.rUHM3LC',NULL,'2026-04-29 08:57:20',3,'2026-04-29 07:45:30','2026-04-29 08:55:19','Asia/Kolkata');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-29 19:32:36
