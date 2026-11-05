-- Таблицы сайта. База создаётся командой `npm run db:init`
-- (или вручную: CREATE DATABASE palkino_site CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
--  и затем выполните этот файл внутри неё).
-- Все DATETIME хранятся в UTC.

CREATE TABLE IF NOT EXISTS news (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  excerpt TEXT,
  content LONGTEXT,
  date DATE NOT NULL,
  published_at DATETIME NOT NULL,
  featured_image VARCHAR(500),
  images LONGTEXT,
  is_featured TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_news_published (published_at),
  INDEX idx_news_featured (is_featured, published_at)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Один день расписания = одна строка; дата служит ключом.
CREATE TABLE IF NOT EXISTS schedule_entries (
  service_date DATE PRIMARY KEY,
  saints VARCHAR(255),
  services LONGTEXT,
  note TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS temple_info (
  id INT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  short_name VARCHAR(255),
  location VARCHAR(255),
  description TEXT,
  phone VARCHAR(50),
  email VARCHAR(100),
  website VARCHAR(255),
  social LONGTEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
