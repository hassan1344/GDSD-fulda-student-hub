/*
  Warnings:

  - You are about to drop the column `amenities` on the `property` table. All the data in the column will be lost.
  - You are about to drop the column `rent` on the `property` table. All the data in the column will be lost.
  - Added the required column `rent` to the `listing` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `listing` ADD COLUMN `rent` DOUBLE NOT NULL,
    ADD COLUMN `room_type_id` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `property` DROP COLUMN `amenities`,
    DROP COLUMN `rent`;

-- CreateTable
CREATE TABLE `room_type` (
    `room_type_id` VARCHAR(191) NOT NULL,
    `room_type_name` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`room_type_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Amenity` (
    `amenity_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `amenity_name` VARCHAR(191) NOT NULL,
    `amenity_value` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`amenity_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PropertyAmenity` (
    `property_amenity_id` VARCHAR(191) NOT NULL,
    `property_id` VARCHAR(191) NOT NULL,
    `amenity_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `PropertyAmenity_property_id_amenity_id_key`(`property_id`, `amenity_id`),
    PRIMARY KEY (`property_amenity_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `conversation` (
    `conversation_id` VARCHAR(191) NOT NULL,
    `sender_id` VARCHAR(191) NOT NULL,
    `receiver_id` VARCHAR(191) NOT NULL,
    `last_message` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`conversation_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chat` (
    `chat_id` VARCHAR(191) NOT NULL,
    `sender_id` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `conversation_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`chat_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `listing_room_type_id_fkey` ON `listing`(`room_type_id`);

-- AddForeignKey
ALTER TABLE `listing` ADD CONSTRAINT `listing_room_type_id_fkey` FOREIGN KEY (`room_type_id`) REFERENCES `room_type`(`room_type_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PropertyAmenity` ADD CONSTRAINT `PropertyAmenity_amenity_id_fkey` FOREIGN KEY (`amenity_id`) REFERENCES `Amenity`(`amenity_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PropertyAmenity` ADD CONSTRAINT `PropertyAmenity_property_id_fkey` FOREIGN KEY (`property_id`) REFERENCES `property`(`property_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `conversation` ADD CONSTRAINT `conversation_sender_id_fkey` FOREIGN KEY (`sender_id`) REFERENCES `user`(`user_name`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `conversation` ADD CONSTRAINT `conversation_receiver_id_fkey` FOREIGN KEY (`receiver_id`) REFERENCES `user`(`user_name`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat` ADD CONSTRAINT `chat_sender_id_fkey` FOREIGN KEY (`sender_id`) REFERENCES `user`(`user_name`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat` ADD CONSTRAINT `chat_conversation_id_fkey` FOREIGN KEY (`conversation_id`) REFERENCES `conversation`(`conversation_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
