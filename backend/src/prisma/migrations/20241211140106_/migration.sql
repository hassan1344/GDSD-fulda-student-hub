/*
  Warnings:

  - Added the required column `media_category` to the `media` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `media` ADD COLUMN `identifier` VARCHAR(191) NULL,
    ADD COLUMN `media_category` VARCHAR(191) NOT NULL;
