-- AlterTable
ALTER TABLE `landlord` MODIFY `trust_score` INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `property` (
    `property_id` VARCHAR(191) NOT NULL,
    `landlord_id` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `rent` DOUBLE NOT NULL,
    `amenities` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`property_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `listing` (
    `listing_id` VARCHAR(191) NOT NULL,
    `property_id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`listing_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `image` (
    `image_id` VARCHAR(191) NOT NULL,
    `model_name` VARCHAR(191) NOT NULL,
    `model_id` VARCHAR(191) NOT NULL,
    `image_url` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`image_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `property` ADD CONSTRAINT `property_landlord_id_fkey` FOREIGN KEY (`landlord_id`) REFERENCES `landlord`(`landlord_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `listing` ADD CONSTRAINT `listing_property_id_fkey` FOREIGN KEY (`property_id`) REFERENCES `property`(`property_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
