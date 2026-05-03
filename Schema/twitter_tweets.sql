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
-- Table structure for table `tweets`
--

DROP TABLE IF EXISTS `tweets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tweets` (
  `tweet_id` bigint NOT NULL AUTO_INCREMENT,
  `tweet_content` text,
  `tweeted_by` bigint DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `parent_tweet_id` bigint DEFAULT NULL,
  `original_tweet_id` bigint DEFAULT NULL,
  PRIMARY KEY (`tweet_id`),
  KEY `fk_tweet_user` (`tweeted_by`),
  KEY `fk_tweet_retweet` (`original_tweet_id`),
  KEY `fk_tweet_reply` (`parent_tweet_id`),
  CONSTRAINT `fk_tweet_reply` FOREIGN KEY (`parent_tweet_id`) REFERENCES `tweets` (`tweet_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_tweet_retweet` FOREIGN KEY (`original_tweet_id`) REFERENCES `tweets` (`tweet_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_tweet_user` FOREIGN KEY (`tweeted_by`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tweets`
--

LOCK TABLES `tweets` WRITE;
/*!40000 ALTER TABLE `tweets` DISABLE KEYS */;
INSERT INTO `tweets` VALUES (1,'this is new tweet!',1,'2026-04-27 10:12:59',NULL,NULL),(2,'this is new tweet!',1,'2026-04-27 10:17:10',NULL,NULL),(3,'this is new tweet!',1,'2026-04-27 10:20:28',NULL,NULL),(11,'this is new tweet!',3,'2026-04-28 06:10:56',NULL,NULL),(12,'this is new tweet!',3,'2026-04-28 06:11:29',NULL,NULL),(13,'this is new tweet!',3,'2026-04-28 06:13:44',NULL,NULL),(14,'this is reply tweet to 13',4,'2026-04-28 06:15:05',13,NULL),(15,NULL,4,'2026-04-29 05:53:15',NULL,NULL),(16,NULL,4,'2026-04-29 05:55:43',NULL,NULL),(17,NULL,4,'2026-04-29 06:38:49',NULL,NULL),(18,NULL,3,'2026-04-29 10:12:16',NULL,NULL),(19,NULL,3,'2026-04-29 10:14:35',NULL,NULL),(20,NULL,3,'2026-04-29 10:20:50',NULL,NULL);
/*!40000 ALTER TABLE `tweets` ENABLE KEYS */;
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
