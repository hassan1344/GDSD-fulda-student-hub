/*
  Warnings:

  - You are about to drop the column `address` on the `landlord` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `landlord` table. All the data in the column will be lost.
  - You are about to drop the column `phone_number` on the `landlord` table. All the data in the column will be lost.
  - You are about to drop the column `profile_picture` on the `landlord` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `landlord` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `landlord_phone_number_key` ON `landlord`;

-- AlterTable
ALTER TABLE `landlord` DROP COLUMN `address`,
    DROP COLUMN `name`,
    DROP COLUMN `phone_number`,
    DROP COLUMN `profile_picture`,
    ADD COLUMN `user_id` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `user` (
    `user_id` VARCHAR(191) NOT NULL,
    `first_name` VARCHAR(191) NOT NULL,
    `last_name` VARCHAR(191) NOT NULL,
    `phone_number` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `profile_picture` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `user_phone_number_key`(`phone_number`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `landlord` ADD CONSTRAINT `landlord_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
