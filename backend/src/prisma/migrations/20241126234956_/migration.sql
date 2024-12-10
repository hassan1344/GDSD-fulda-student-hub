/*
  Warnings:

  - The primary key for the `landlord` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE `landlord` DROP PRIMARY KEY,
    MODIFY `landlord_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`landlord_id`);
