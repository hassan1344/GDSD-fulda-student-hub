-- CreateTable
CREATE TABLE `bidding_session` (
    `session_id` VARCHAR(191) NOT NULL,
    `listing_id` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `starting_price` DOUBLE NOT NULL,
    `highest_bid` DOUBLE NOT NULL DEFAULT 0,
    `highest_bidder` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `ends_at` DATETIME(3) NOT NULL,

    INDEX `biddingsession_listing_id_fkey`(`listing_id`),
    INDEX `biddingsession_highest_bidder_fkey`(`highest_bidder`),
    PRIMARY KEY (`session_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bid` (
    `bid_id` VARCHAR(191) NOT NULL,
    `session_id` VARCHAR(191) NOT NULL,
    `bidder_id` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `bid_session_id_fkey`(`session_id`),
    INDEX `bid_bidder_id_fkey`(`bidder_id`),
    PRIMARY KEY (`bid_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `bidding_session` ADD CONSTRAINT `bidding_session_listing_id_fkey` FOREIGN KEY (`listing_id`) REFERENCES `listing`(`listing_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bidding_session` ADD CONSTRAINT `bidding_session_highest_bidder_fkey` FOREIGN KEY (`highest_bidder`) REFERENCES `user`(`user_name`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bid` ADD CONSTRAINT `bid_session_id_fkey` FOREIGN KEY (`session_id`) REFERENCES `bidding_session`(`session_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bid` ADD CONSTRAINT `bid_bidder_id_fkey` FOREIGN KEY (`bidder_id`) REFERENCES `user`(`user_name`) ON DELETE RESTRICT ON UPDATE CASCADE;
