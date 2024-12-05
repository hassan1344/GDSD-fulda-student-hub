/*
  Warnings:

  - You are about to alter the column `amenities` on the `property` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.
  - Added the required column `room_type` to the `listing` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `listing` ADD COLUMN `room_type` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `property` MODIFY `amenities` JSON NOT NULL;
