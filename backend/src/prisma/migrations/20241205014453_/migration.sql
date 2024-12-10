/*
  Warnings:

  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `user_id` on the `user` table. All the data in the column will be lost.
  - Added the required column `user_name` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `landlord` DROP FOREIGN KEY `landlord_user_id_fkey`;

-- AlterTable
ALTER TABLE `user` DROP PRIMARY KEY,
    DROP COLUMN `user_id`,
    ADD COLUMN `user_name` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`user_name`);

-- AddForeignKey
ALTER TABLE `landlord` ADD CONSTRAINT `landlord_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_name`) ON DELETE RESTRICT ON UPDATE CASCADE;
