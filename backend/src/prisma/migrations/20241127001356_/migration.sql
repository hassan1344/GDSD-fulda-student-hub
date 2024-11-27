/*
  Warnings:

  - The primary key for the `image` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `image_id` on the `image` table. All the data in the column will be lost.
  - You are about to drop the column `image_url` on the `image` table. All the data in the column will be lost.
  - The required column `media_id` was added to the `image` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `media_type` to the `image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `media_url` to the `image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `image` DROP PRIMARY KEY,
    DROP COLUMN `image_id`,
    DROP COLUMN `image_url`,
    ADD COLUMN `media_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `media_type` VARCHAR(191) NOT NULL,
    ADD COLUMN `media_url` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`media_id`);
