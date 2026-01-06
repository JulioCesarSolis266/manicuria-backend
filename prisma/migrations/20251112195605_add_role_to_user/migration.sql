-- AlterTable
ALTER TABLE `user` ADD COLUMN `forcePasswordReset` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `role` VARCHAR(191) NOT NULL DEFAULT 'user';
