/*
  Warnings:

  - You are about to drop the `Amenity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PropertyAmenity` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `PropertyAmenity` DROP FOREIGN KEY `PropertyAmenity_amenity_id_fkey`;

-- DropForeignKey
ALTER TABLE `PropertyAmenity` DROP FOREIGN KEY `PropertyAmenity_property_id_fkey`;

-- DropTable
DROP TABLE `Amenity`;

-- DropTable
DROP TABLE `PropertyAmenity`;

-- CreateTable
CREATE TABLE `amenity` (
    `amenity_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `amenity_name` VARCHAR(191) NOT NULL,
    `amenity_value` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`amenity_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `property_amenity` (
    `property_amenity_id` VARCHAR(191) NOT NULL,
    `property_id` VARCHAR(191) NOT NULL,
    `amenity_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `property_amenity_property_id_amenity_id_key`(`property_id`, `amenity_id`),
    PRIMARY KEY (`property_amenity_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `property_amenity` ADD CONSTRAINT `property_amenity_amenity_id_fkey` FOREIGN KEY (`amenity_id`) REFERENCES `amenity`(`amenity_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `property_amenity` ADD CONSTRAINT `property_amenity_property_id_fkey` FOREIGN KEY (`property_id`) REFERENCES `property`(`property_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
