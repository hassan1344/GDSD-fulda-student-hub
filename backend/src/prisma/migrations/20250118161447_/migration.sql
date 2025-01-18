/*
  Warnings:

  - You are about to drop the column `profile_picture_id` on the `landlord` table. All the data in the column will be lost.
  - You are about to drop the column `profile_picture_id` on the `student` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `landlord` DROP FOREIGN KEY `landlord_profile_picture_id_fkey`;

-- DropForeignKey
ALTER TABLE `student` DROP FOREIGN KEY `student_profile_picture_id_fkey`;

-- DropIndex
DROP INDEX `landlord_profile_picture_id_fkey` ON `landlord`;

-- DropIndex
DROP INDEX `student_profile_picture_id_fkey` ON `student`;

-- AlterTable
ALTER TABLE `landlord` DROP COLUMN `profile_picture_id`;

-- AlterTable
ALTER TABLE `student` DROP COLUMN `profile_picture_id`;
