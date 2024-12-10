/*
  Warnings:

  - You are about to drop the column `profile_picture` on the `landlord` table. All the data in the column will be lost.
  - You are about to drop the column `room_type` on the `listing` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `landlord` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `landlord` DROP COLUMN `profile_picture`,
    ADD COLUMN `profile_picture_id` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `listing` DROP COLUMN `room_type`;

-- CreateTable
CREATE TABLE `student` (
    `student_id` VARCHAR(191) NOT NULL,
    `first_name` VARCHAR(191) NOT NULL,
    `last_name` VARCHAR(191) NOT NULL,
    `university` VARCHAR(191) NOT NULL,
    `email_verified` BOOLEAN NOT NULL DEFAULT false,
    `profile_picture_id` VARCHAR(191) NULL,
    `student_id_number` VARCHAR(191) NOT NULL,
    `phone_number` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `student_user_id_key`(`user_id`),
    PRIMARY KEY (`student_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `landlord_user_id_key` ON `landlord`(`user_id`);

-- AddForeignKey
ALTER TABLE `landlord` ADD CONSTRAINT `landlord_profile_picture_id_fkey` FOREIGN KEY (`profile_picture_id`) REFERENCES `media`(`media_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student` ADD CONSTRAINT `student_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_name`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student` ADD CONSTRAINT `student_profile_picture_id_fkey` FOREIGN KEY (`profile_picture_id`) REFERENCES `media`(`media_id`) ON DELETE SET NULL ON UPDATE CASCADE;
