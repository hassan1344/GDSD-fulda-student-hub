/*
  Warnings:

  - Added the required column `contact_number` to the `application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `current_address` to the `application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `full_name` to the `application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `student_card_id` to the `application` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `application` ADD COLUMN `contact_number` VARCHAR(191) NOT NULL,
    ADD COLUMN `current_address` VARCHAR(191) NOT NULL,
    ADD COLUMN `full_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `student_card_id` VARCHAR(191) NOT NULL;
