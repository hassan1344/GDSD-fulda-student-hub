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

-- AddForeignKey
ALTER TABLE `Meeting` ADD CONSTRAINT `Meeting_landlord_id_fkey` FOREIGN KEY (`landlord_id`) REFERENCES `landlord`(`landlord_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Meeting` ADD CONSTRAINT `Meeting_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `student`(`student_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
