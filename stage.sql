-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : jeu. 10 juil. 2025 à 00:09
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `stage`
--

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL COMMENT 'Unique username for login',
  `email` varchar(100) NOT NULL COMMENT 'User email address',
  `password_hash` varchar(255) NOT NULL COMMENT 'Hashed password for security',
  `first_name` varchar(50) DEFAULT NULL COMMENT 'User first name',
  `last_name` varchar(50) DEFAULT NULL COMMENT 'User last name',
  `date_of_birth` date DEFAULT NULL COMMENT 'User birth date',
  `phone_number` varchar(20) DEFAULT NULL COMMENT 'Contact phone number',
  `is_active` tinyint(1) DEFAULT 1 COMMENT '1 for active, 0 for inactive account',
  `is_admin` tinyint(1) DEFAULT 0 COMMENT '1 for admin user, 0 for regular user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'Account creation date',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp() COMMENT 'Last update timestamp',
  `last_login_at` timestamp NULL DEFAULT NULL COMMENT 'Last successful login time'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Stores user account information';

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username_unique` (`username`),
  ADD UNIQUE KEY `email_unique` (`email`),
  ADD KEY `is_active_index` (`is_active`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
