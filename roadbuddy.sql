-- MySQL dump 10.13  Distrib 8.0.28, for macos11 (x86_64)
--
-- Host: localhost    Database: roadbuddy
-- ------------------------------------------------------
-- Server version	8.0.28

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `friends`
--

DROP TABLE IF EXISTS `friends`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `friends` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `friend_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `friend_id` (`friend_id`),
  CONSTRAINT `friends_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `member` (`user_id`),
  CONSTRAINT `friends_ibfk_2` FOREIGN KEY (`friend_id`) REFERENCES `member` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `friends`
--

LOCK TABLES `friends` WRITE;
/*!40000 ALTER TABLE `friends` DISABLE KEYS */;
INSERT INTO `friends` VALUES (2,1,3),(3,1,6),(4,1,7),(5,1,8),(6,1,9),(7,1,10),(8,3,1),(9,3,6),(10,3,9),(11,3,10),(12,4,1),(13,4,2),(14,4,6),(15,4,7),(16,4,8),(17,4,9),(18,4,10),(19,5,1),(20,5,3),(21,5,7),(22,5,9),(23,4,1),(24,4,2),(25,4,6),(26,4,7),(27,4,8),(28,4,9),(29,4,10),(30,5,1),(31,5,3),(32,5,7),(33,5,9),(34,4,1),(35,4,2),(36,4,6),(37,4,7),(38,4,8),(39,4,9),(40,4,10),(41,5,1),(42,5,3),(43,5,7),(44,5,9),(45,4,1),(46,4,2),(47,4,6),(48,4,7),(49,4,8),(50,4,9),(51,4,10),(52,5,1),(53,5,3),(54,5,7),(55,5,9),(56,9,1),(57,9,11);
/*!40000 ALTER TABLE `friends` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member`
--

DROP TABLE IF EXISTS `member`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member` (
  `user_id` bigint NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` longtext NOT NULL,
  `password` longtext NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member`
--

LOCK TABLES `member` WRITE;
/*!40000 ALTER TABLE `member` DISABLE KEYS */;
INSERT INTO `member` VALUES (1,'mark','mark@mail','123'),(2,'123','test@mail','scrypt:32768:8:1$8VQ2NZIybt3IdD8o$aa0b114775abafc43298d5539ce88b8a1975032e654859db6f29e466bf10d6410d854797db44f82bf5ad379062dd6dd9cfdfbfd67bafbc3b6baa13d7b8cefb42'),(3,'kevin','kevinmail','scrypt:32768:8:1$cfUlbYtJWbJG79Mn$cb1148f28ce447fc1da3e1320007dac72e7198958f574b86ee4bb97d6b06c72c991b296e45a23fdac71481622fe740a0221e6e25141d3044699a37c6f6186048'),(4,'kevin','kevin@mail','scrypt:32768:8:1$0H3Y0ficlhycVlcV$8f8d0151a2436ac8e7225c2e19de8d87dd010b3ce2aaf2a49a5868c9c689f0ed89b59b762e1e9fe2eff58f8f7f533a59113ef86ddc710f24d7b1b9d0a9e1c78c'),(5,'123','123@mail','scrypt:32768:8:1$Dor8MtPCRijzPdaX$5c7a92cd4aaa5f67961ab2dfb28b89d63bc1d60564a521618f7abf308301317193ee8fa8d5804db7163e0fe7908742f959c2b54c6ef569fe7e4202454cd2b275'),(6,'test1','test1@mail','scrypt:32768:8:1$9yAczVZN2gem3fFU$e0e3d493a835f604af1ddab6157cfa022bb642cfcc71bb157f844ce4ab1cfd46b02fe1479935d8e59d208a03807a3be900eb5087123bb7198a47b9fd33f0350a'),(7,'test2','test2@mail','scrypt:32768:8:1$4ZYWSB9JWBQvjmON$2d53fc0bc62a5a75abf4541e15ccec1c9e13fef36cd88a47ec641beb8e9dda2189985f925305b2b21bb22bd019d416335d4d5d0962c3be3aca796d02d1416f39'),(8,'test3','test3@mail','scrypt:32768:8:1$l4W3hhVOxsZ52syI$587845eec1b66b27a1da3cff8f8590194c8e8bf452fbcec02fd97e52e50df24bb47969bbf814b865eadc5050f88bd7c7481fdd5f6f4bf09666f2c3cdb6aa06df'),(9,'test4','test4@mail','scrypt:32768:8:1$VkchwRngYedZWuQC$55371565b380c18aeec96498d1f9ed7136f69b3133c8057d62d166c1b38f6e4f6287c56dd8cf85c4d09b2ee0205df123577f6d99b8d8d0e7e1b84d2d4b8296f5'),(10,'test5','test5@mail','scrypt:32768:8:1$CyQsb9voYTMS2kSr$e31291fef5d1c7cad200dfc9727b5536a1a4a3f48fa89b09cdd854cb79dc0232507341dc358a20bc242bddbc58a2ac20cea0bd6cd2be153e141fa0ecc331f5a0'),(11,'kj','kj@mail','scrypt:32768:8:1$1XaIJ0OFbl86z6dD$98da0c305ca6cfd66d2bb872274333551d7f14c65b35dc54d23d405c8183fb52c0287690e7bc3fe19fd27f2e2023cb96a80f87596e809616709d471246da7252');
/*!40000 ALTER TABLE `member` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `partner`
--

DROP TABLE IF EXISTS `partner`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `partner` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `team_id` bigint NOT NULL,
  `partner_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `team_id` (`team_id`),
  KEY `partner_id` (`partner_id`),
  CONSTRAINT `partner_ibfk_1` FOREIGN KEY (`team_id`) REFERENCES `team` (`team_id`),
  CONSTRAINT `partner_ibfk_2` FOREIGN KEY (`partner_id`) REFERENCES `member` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `partner`
--

LOCK TABLES `partner` WRITE;
/*!40000 ALTER TABLE `partner` DISABLE KEYS */;
INSERT INTO `partner` VALUES (1,3,1),(2,3,2),(3,3,6),(4,3,7),(5,3,9),(6,7,1),(7,7,5),(8,7,6),(9,7,7),(10,7,9);
/*!40000 ALTER TABLE `partner` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `team`
--

DROP TABLE IF EXISTS `team`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `team` (
  `team_id` bigint NOT NULL AUTO_INCREMENT,
  `team_name` varchar(255) NOT NULL,
  `owner_id` bigint NOT NULL,
  PRIMARY KEY (`team_id`),
  KEY `owner_id` (`owner_id`),
  CONSTRAINT `team_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `member` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `team`
--

LOCK TABLES `team` WRITE;
/*!40000 ALTER TABLE `team` DISABLE KEYS */;
INSERT INTO `team` VALUES (3,'test',5),(4,'GoGoGo',5),(5,'Hsinchu',5),(6,'20231129',5),(7,'Taipei',1),(8,'123',9),(9,'111',9),(10,'qqq',9),(11,'ttt',9);
/*!40000 ALTER TABLE `team` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-12-01  0:46:38
