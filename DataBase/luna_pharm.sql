-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 25, 2023 at 10:12 AM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `luna_pharm`
--

-- --------------------------------------------------------

--
-- Table structure for table `carts`
--

CREATE TABLE `carts` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `carts`
--

INSERT INTO `carts` (`id`, `customer_id`, `date`) VALUES
(72, 123456, '2023-02-15'),
(73, 206223380, '2023-02-15'),
(74, 206223380, '2023-02-15'),
(75, 123456, '2023-02-22'),
(76, 207582719, '2023-02-24'),
(77, 207582719, '2023-02-24'),
(78, 123456, '2023-02-24');

-- --------------------------------------------------------

--
-- Table structure for table `cart_product`
--

CREATE TABLE `cart_product` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `amount` int(11) NOT NULL,
  `total_price` varchar(11) NOT NULL,
  `cart_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `cart_product`
--

INSERT INTO `cart_product` (`id`, `product_id`, `amount`, `total_price`, `cart_id`) VALUES
(176, 38, 11, '11', 73),
(177, 39, 3, '21', 73),
(178, 40, 7, '21', 73),
(180, 44, 1, '0.5', 72),
(181, 60, 1, '4.2', 72),
(182, 50, 1, '4', 75),
(183, 44, 3, '1.5', 76),
(184, 43, 1, '1.8', 76),
(185, 47, 50, '150', 76),
(186, 41, 1, '1', 76),
(187, 50, 1, '4', 76),
(188, 49, 1, '1', 76),
(189, 51, 70, '210', 76),
(190, 40, 1, '1', 76),
(191, 58, 1, '2.9', 76),
(192, 64, 2, '10', 76),
(193, 45, 20, '10', 76),
(194, 44, 1, '0.5', 77),
(195, 44, 1, '0.5', 78);

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`) VALUES
(1, 'bakery'),
(2, 'beverage'),
(3, 'dairy'),
(4, 'frozen'),
(5, 'fruits&vegs'),
(6, 'household'),
(7, 'meat&fish'),
(8, 'pet');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `first_name` varchar(20) NOT NULL,
  `last_name` varchar(20) NOT NULL,
  `email` varchar(30) NOT NULL,
  `id` int(11) NOT NULL,
  `pass` varchar(20) NOT NULL,
  `city` varchar(20) NOT NULL,
  `street` varchar(30) NOT NULL,
  `role` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`first_name`, `last_name`, `email`, `id`, `pass`, `city`, `street`, `role`) VALUES
('elad', 'second', 'elad@gmail.com', 123456, '123123', 'jer', 'salem', ''),
('Admin', 'Admin', 'admin@luna.com', 555555, '111111', 'luna', 'pharm', 'admin'),
('alona', 'alona', 'akso@kszmlk.com', 12345678, '1q2w3e4r', 'Jerusalem', 'jafa', ''),
('adfw', '123124', '1132341@gmail.com', 24112124, '123123', 'Jerusalem', '14124', ''),
('yuvi', 'arbook', 'yuvi@GMAIL.COM', 206223380, '123456', 'Ashdod', 'nanabanana555', ''),
('shilat', 'itach', 'Shilati5555@gmail.com', 207582719, '123456', 'Tel Aviv', 'amahavak', ''),
('elad', 'arbook', 'eladarbook21@gmail.com', 311550321, '123321', 'jerusalem', 'israel eldad', '');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `cart_id` int(11) NOT NULL,
  `summary` int(11) NOT NULL,
  `city` varchar(20) NOT NULL,
  `street` varchar(30) NOT NULL,
  `delivery_date` date NOT NULL,
  `order_date` date NOT NULL,
  `payment` varchar(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `customer_id`, `cart_id`, `summary`, `city`, `street`, `delivery_date`, `order_date`, `payment`) VALUES
(49, 206223380, 73, 53, 'Ashdod', 'nanabanana555', '2023-11-18', '2023-02-15', '1111'),
(50, 123456, 72, 5, 'jer', 'salem', '2023-02-22', '2023-02-18', '0000'),
(51, 123456, 75, 4, 'jer', 'salem', '2023-02-24', '2023-02-22', '2222'),
(52, 207582719, 76, 393, 'Tel Aviv', 'amahavak', '2023-02-28', '2023-02-24', '4456');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(20) NOT NULL,
  `category_id` int(11) NOT NULL,
  `price` varchar(11) NOT NULL,
  `image` varchar(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `category_id`, `price`, `image`) VALUES
(38, 'Apple', 5, '0.8', '84132_download (1).jfif'),
(39, 'Corn', 5, '0.7', '411236_corn.webp'),
(40, 'orange', 5, '1', '6091374_download (4).jfif'),
(41, 'Milk', 3, '1', '7520199_nxplhtpr74BLE4kP.jpg'),
(42, 'Rye Bread', 1, '3.5', '1074218_732857320535235.jfif'),
(43, 'White Bread', 1, '1.8', '3992641_1111111111111111.jpg'),
(44, 'Bun', 1, '0.5', '8258800_bun.jpg'),
(45, 'Mineral Water', 2, '0.5', '411864_mineral_water.jfif'),
(46, 'Coke Cola', 2, '1055.999999', '7360913_coke.jfif'),
(47, 'Orange Juice', 2, '3', '2753300_orangejiucen.jpg.webp'),
(48, 'Soda', 2, '1', '344504_thums-up-cold-drink-500x500.webp'),
(49, 'Popsicle (1 unit)', 4, '1', '3147048_download.jfif'),
(50, 'Ice Cream', 4, '4', '1891659_ey-2022-landing.webp'),
(51, 'Avocado', 5, '3', '1528343_download (2).jfif'),
(52, 'Banana', 5, '1.1', '1043809_download (3).jfif'),
(53, 'Pineapple', 5, '4.5', '9277533_download (5).jfif'),
(54, 'Tomato', 5, '0.6', '9417508_download (6).jfif'),
(55, 'Heavy Cream', 3, '2', '1004917_Heavy Cream.webp'),
(56, 'Cream', 3, '2.5', '6162576_Cream.png'),
(57, 'Whipped Cream', 3, '4', '9640206_Whipped Cream.jfif'),
(58, 'Dish Soap', 6, '2.9', '8644442_eat3vek4ggk37zrqfcku.jpg'),
(59, 'Hand Soap', 6, '3.5', '7059918_download (7).jfif'),
(60, 'Shampoo', 6, '4.2', '4419660_images (2).jfif'),
(61, 'Broom', 6, '5.9', '3205955_Broom-5.jpg'),
(62, 'Frozen Broccoli', 4, '3', '7499001_download (8).jfif'),
(63, 'Frozen Corn', 4, '3.5', '8842957_96e9ac12590d029.webp'),
(64, 'Kong', 8, '5', '487574_images.jfif'),
(65, 'Bone Toy', 8, '3', '3281412_d7a9d7a8d7a9d7aa.jpg'),
(66, 'Ball Toy', 8, '3', '5758402_images (1).jfif'),
(67, 'Tooth Brush', 6, '2.5', '4791150_127204482.jpg'),
(68, 'Apple Juice', 2, '3.2', '9451948_70e28ea8e0269c9.webp');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indexes for table `cart_product`
--
ALTER TABLE `cart_product`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `cart_id` (`cart_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `email` (`email`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `cart_id` (`cart_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `carts`
--
ALTER TABLE `carts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=79;

--
-- AUTO_INCREMENT for table `cart_product`
--
ALTER TABLE `cart_product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=196;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `carts`
--
ALTER TABLE `carts`
  ADD CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`);

--
-- Constraints for table `cart_product`
--
ALTER TABLE `cart_product`
  ADD CONSTRAINT `cart_product_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  ADD CONSTRAINT `cart_product_ibfk_2` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`),
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`);

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
