-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Feb 22, 2024 at 06:32 PM
-- Server version: 5.7.39
-- PHP Version: 7.4.33

SET FOREIGN_KEY_CHECKS=0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `MindGarden`
--
CREATE DATABASE IF NOT EXISTS `MindGarden` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `MindGarden`;

-- --------------------------------------------------------

--
-- Table structure for table `Snapshot`
--

DROP TABLE IF EXISTS `Snapshot`;
CREATE TABLE `Snapshot` (
  `snapshot_ID` int(11) NOT NULL,
  `user_ID` int(11) NOT NULL,
  `snapshot_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `happiness` int(11) NOT NULL,
  `surprise` int(11) NOT NULL,
  `contempt` int(11) NOT NULL,
  `sadness` int(11) NOT NULL,
  `fear` int(11) NOT NULL,
  `disgust` int(11) NOT NULL,
  `anger` int(11) NOT NULL,
  `trigger_ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Snapshot`
--

INSERT INTO `Snapshot` (`snapshot_ID`, `user_ID`, `snapshot_date`, `enjoyment`, `surprise`, `contempt`, `sadness`, `fear`, `disgust`, `anger`, `trigger_ID`) VALUES
(1,1, '2024-02-20 21:18:35', 1, 10, 3, 5, 5, 8, 6, 9);

-- --------------------------------------------------------

--
-- Table structure for table `Triggers`
--

DROP TABLE IF EXISTS `Triggers`;
CREATE TABLE `Triggers` (
  `trigger_ID` int(11) NOT NULL,
  `trigger_type` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Triggers`
--

INSERT INTO `Triggers` (`trigger_ID`, `trigger_type`) VALUES
(1, 'Family'),
(2, 'Friends'),
(3, 'Relationship'),
(4, 'Health'),
(5, 'Finances'),
(6, 'Work'),
(7, 'Current Environment'),
(8, 'Diet'),
(9, 'A Recent Event'),
(10, 'Unknown');

-- --------------------------------------------------------

--
-- Table structure for table `User`
--

DROP TABLE IF EXISTS `User`;
CREATE TABLE `User` (
  `user_ID` int(11) NOT NULL,
  `user_DisplayName` varchar(255) NOT NULL,
  `user_Email` varchar(255) NOT NULL,
  `user_Password` varbinary(255) NOT NULL,
  `user_TypeID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `User_Snapshot`
--

DROP TABLE IF EXISTS `User_Snapshot`;
CREATE TABLE `User_Snapshot` (
  `User_SnapshotID` int(11) NOT NULL,
  `user_ID` int(11) NOT NULL,
  `snapshot_ID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `User_Type`
--

DROP TABLE IF EXISTS `User_Type`;
CREATE TABLE `User_Type` (
  `user_TypeID` int(11) NOT NULL,
  `userRole` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Snapshot`
--
ALTER TABLE `Snapshot`
  ADD PRIMARY KEY (`snapshot_ID`),
  ADD KEY `Snapshot_Trigger` (`trigger_ID`);

--
-- Indexes for table `Triggers`
--
ALTER TABLE `Triggers`
  ADD PRIMARY KEY (`trigger_ID`);

--
-- Indexes for table `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`user_ID`),
  ADD KEY `User_UserType` (`user_TypeID`);

--
-- Indexes for table `User_Snapshot`
--
ALTER TABLE `User_Snapshot`
  ADD PRIMARY KEY (`User_SnapshotID`),
  ADD KEY `Usersnapshot_snapshot` (`snapshot_ID`),
  ADD KEY `Usersnapshot_user` (`user_ID`);

--
-- Indexes for table `User_Type`
--
ALTER TABLE `User_Type`
  ADD PRIMARY KEY (`user_TypeID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Snapshot`
--
ALTER TABLE `Snapshot`
  MODIFY `snapshot_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `Triggers`
--
ALTER TABLE `Triggers`
  MODIFY `trigger_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `User`
--
ALTER TABLE `User`
  MODIFY `user_ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `User_Snapshot`
--
ALTER TABLE `User_Snapshot`
  MODIFY `User_SnapshotID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `User_Type`
--
ALTER TABLE `User_Type`
  MODIFY `user_TypeID` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Snapshot`
--
ALTER TABLE `Snapshot`
  ADD CONSTRAINT `Snapshot_Trigger` FOREIGN KEY (`trigger_ID`) REFERENCES `Triggers` (`trigger_ID`);

--
-- Constraints for table `User`
--
ALTER TABLE `User`
  ADD CONSTRAINT `User_UserType` FOREIGN KEY (`user_TypeID`) REFERENCES `User_Type` (`user_TypeID`);

--
-- Constraints for table `User_Snapshot`
--
ALTER TABLE `User_Snapshot`
  ADD CONSTRAINT `Usersnapshot_snapshot` FOREIGN KEY (`snapshot_ID`) REFERENCES `Snapshot` (`snapshot_ID`),
  ADD CONSTRAINT `Usersnapshot_user` FOREIGN KEY (`user_ID`) REFERENCES `User` (`user_ID`);
SET FOREIGN_KEY_CHECKS=1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
