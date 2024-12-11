-- DropForeignKey
ALTER TABLE `application` DROP FOREIGN KEY `application_student_id_fkey`;

-- AddForeignKey
ALTER TABLE `application` ADD CONSTRAINT `application_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `user`(`user_name`) ON DELETE RESTRICT ON UPDATE CASCADE;
