-- DropIndex
DROP INDEX `Report_approvedById_fkey` ON `Report`;

-- AlterTable
ALTER TABLE `Idea` ADD COLUMN `isHidden` BOOLEAN NOT NULL DEFAULT false;
