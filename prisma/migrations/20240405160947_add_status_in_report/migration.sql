-- AlterTable
ALTER TABLE `Report` ADD COLUMN `status` ENUM('NEW', 'HIDEIDEA', 'REJECTED') NOT NULL DEFAULT 'NEW';

-- AlterTable
ALTER TABLE `Staff` ADD COLUMN `profile` JSON NULL,
    MODIFY `role` ENUM('ADMIN', 'QA_COORDINATOR', 'QA_MANAGER', 'STAFF') NOT NULL DEFAULT 'STAFF';

-- AlterTable
ALTER TABLE `StaffAnnouncement` MODIFY `status` ENUM('PENDING', 'FAIL', 'SUCCESS') NOT NULL DEFAULT 'PENDING';

-- AddForeignKey
ALTER TABLE `StaffAnnouncement` ADD CONSTRAINT `StaffAnnouncement_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `Department`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
