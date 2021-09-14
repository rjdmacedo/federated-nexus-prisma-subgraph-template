-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `confirmed` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `type` ENUM('RETAILER', 'WHOLESALER') NOT NULL,
    `cartId` VARCHAR(191),

    UNIQUE INDEX `User.email_unique`(`email`),
    UNIQUE INDEX `User.cartId_unique`(`cartId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Permissions` (
    `id` VARCHAR(191) NOT NULL,
    `action` ENUM('CREATE', 'READ', 'UPDATE', 'DELETE') NOT NULL DEFAULT 'READ',
    `qualifier` ENUM('OWN', 'ANY') NOT NULL DEFAULT 'OWN',
    `target` ENUM('CART', 'ACCOUNT', 'SETTINGS') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
