-- DropForeignKey
ALTER TABLE `listing` DROP FOREIGN KEY `listing_property_id_fkey`;

-- CreateTable
CREATE TABLE `Meeting` (
    `meeting_id` VARCHAR(191) NOT NULL,
    `landlord_id` VARCHAR(191) NOT NULL,
    `student_id` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `status` ENUM('SCHEDULED', 'CANCELED', 'COMPLETED') NOT NULL DEFAULT 'SCHEDULED',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `meeting_landlord_idx`(`landlord_id`),
    INDEX `meeting_student_idx`(`student_id`),
    INDEX `meeting_date_idx`(`date`),
    PRIMARY KEY (`meeting_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `landlord_rental_history` (
    `rental_id` VARCHAR(191) NOT NULL,
    `application_id` VARCHAR(191) NOT NULL,
    `date_started` DATETIME(3) NULL,
    `date_ended` DATETIME(3) NULL,
    `cancelled_by_landlord` BOOLEAN NOT NULL DEFAULT false,

    INDEX `landlord_rental_history_application_id_fkey`(`application_id`),
    PRIMARY KEY (`rental_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `landlord_reviews` (
    `review_id` VARCHAR(191) NOT NULL,
    `application_id` VARCHAR(191) NOT NULL,
    `rating` INTEGER NOT NULL,
    `review_text` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `landlord_reviews_application_id_fkey`(`application_id`),
    PRIMARY KEY (`review_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `landlord_trust` (
    `landlord_trust_id` VARCHAR(191) NOT NULL,
    `landlord_id` VARCHAR(191) NOT NULL,
    `alpha` DOUBLE NOT NULL,
    `beta` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `property_landlord_id_fkey`(`landlord_id`),
    PRIMARY KEY (`landlord_trust_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Meeting` ADD CONSTRAINT `Meeting_landlord_id_fkey` FOREIGN KEY (`landlord_id`) REFERENCES `landlord`(`landlord_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Meeting` ADD CONSTRAINT `Meeting_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `student`(`student_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `listing` ADD CONSTRAINT `listing_property_id_fkey` FOREIGN KEY (`property_id`) REFERENCES `property`(`property_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `landlord_rental_history` ADD CONSTRAINT `landlord_rental_history_application_id_fkey` FOREIGN KEY (`application_id`) REFERENCES `application`(`application_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `landlord_reviews` ADD CONSTRAINT `landlord_reviews_application_id_fkey` FOREIGN KEY (`application_id`) REFERENCES `application`(`application_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `landlord_trust` ADD CONSTRAINT `landlord_trust_landlord_id_fkey` FOREIGN KEY (`landlord_id`) REFERENCES `landlord`(`landlord_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
