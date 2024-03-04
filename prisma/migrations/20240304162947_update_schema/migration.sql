/*
  Warnings:

  - You are about to drop the column `status` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Report` table. All the data in the column will be lost.
  - You are about to alter the column `status` on the `StaffAnnouncement` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(3))`.
  - You are about to drop the `BanList` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `BanList` DROP FOREIGN KEY `BanList_staffId_fkey`;

-- AlterTable
ALTER TABLE `Category` DROP COLUMN `status`,
    ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `Report` DROP COLUMN `status`,
    ADD COLUMN `isApproved` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `StaffAnnouncement` MODIFY `status` ENUM('PENDING', 'SUCCESS', 'FAIL') NOT NULL DEFAULT 'PENDING';

-- DropTable
DROP TABLE `BanList`;

-- AddForeignKey
ALTER TABLE `Report` ADD CONSTRAINT `Report_reportById_fkey` FOREIGN KEY (`reportById`) REFERENCES `Staff`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Report` ADD CONSTRAINT `Report_approvedById_fkey` FOREIGN KEY (`approvedById`) REFERENCES `Staff`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
