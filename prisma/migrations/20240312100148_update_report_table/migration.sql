-- DropForeignKey
ALTER TABLE `Report` DROP FOREIGN KEY `Report_approvedById_fkey`;

-- AlterTable
ALTER TABLE `Report` MODIFY `approvedAt` DATETIME(3) NULL,
    MODIFY `approvedById` INTEGER NULL;
