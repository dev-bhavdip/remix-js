-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL ,
    `email` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` DATETIME NOT NULL,
     PRIMARY KEY (`id`)
);

-- CreateTable
CREATE TABLE `Password` (
    `hash` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    CONSTRAINT `Password_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE `Note` (
    `id` VARCHAR(191) NOT NULL  primary key,
    `title` VARCHAR(191) NOT NULL,
    `body` VARCHAR(191) NOT NULL, 
    `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` DATETIME NOT NULL,
    `userId` VARCHAR(191) NOT NULL, 
    CONSTRAINT `Note_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User` (id) ON DELETE CASCADE ON UPDATE CASCADE

);

-- CreateIndex
CREATE UNIQUE INDEX `User_email_key` ON `User`(`email`);

-- CreateIndex
CREATE UNIQUE INDEX `Password_userId_key` ON `Password`(`userId`);
