/*
  Warnings:

  - You are about to drop the column `address` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `first_name` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `phone_number` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `profile_picture` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phone_number]` on the table `landlord` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `address` to the `landlord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `first_name` to the `landlord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `landlord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone_number` to the `landlord` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `user_phone_number_key` ON `user`;

-- AlterTable
ALTER TABLE `landlord` ADD COLUMN `address` VARCHAR(191) NOT NULL,
    ADD COLUMN `first_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `last_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `phone_number` VARCHAR(191) NOT NULL,
    ADD COLUMN `profile_picture` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `address`,
    DROP COLUMN `first_name`,
    DROP COLUMN `last_name`,
    DROP COLUMN `phone_number`,
    DROP COLUMN `profile_picture`;

-- CreateIndex
CREATE UNIQUE INDEX `landlord_phone_number_key` ON `landlord`(`phone_number`);
