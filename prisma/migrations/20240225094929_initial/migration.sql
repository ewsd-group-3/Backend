/*
  Warnings:

  - You are about to drop the column `name` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the `Announcement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StaffAnnouncement` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `endDate` to the `AcademicInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `AcademicInfo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `documentDeleteUrl` to the `IdeaDocument` table without a default value. This is not possible if the table is not empty.
  - Added the required column `documentDownloadUrl` to the `IdeaDocument` table without a default value. This is not possible if the table is not empty.
  - Added the required column `documenttype` to the `IdeaDocument` table without a default value. This is not possible if the table is not empty.
  - Added the required column `closureDate` to the `Semester` table without a default value. This is not possible if the table is not empty.
  - Added the required column `finalClosureDate` to the `Semester` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Semester` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isThumbUp` to the `Vote` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Announcement` DROP FOREIGN KEY `Announcement_announcerId_fkey`;

-- DropForeignKey
ALTER TABLE `StaffAnnouncement` DROP FOREIGN KEY `StaffAnnouncement_announcementId_fkey`;

-- DropForeignKey
ALTER TABLE `StaffAnnouncement` DROP FOREIGN KEY `StaffAnnouncement_staffId_fkey`;

-- AlterTable
ALTER TABLE `AcademicInfo` ADD COLUMN `endDate` DATETIME(3) NOT NULL,
    ADD COLUMN `startDate` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Category` ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE `Comment` DROP COLUMN `name`,
    ADD COLUMN `content` VARCHAR(191) NOT NULL,
    ADD COLUMN `isAnonymous` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `IdeaDocument` ADD COLUMN `documentDeleteUrl` VARCHAR(191) NOT NULL,
    ADD COLUMN `documentDownloadUrl` VARCHAR(191) NOT NULL,
    ADD COLUMN `documenttype` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Semester` ADD COLUMN `closureDate` DATETIME(3) NOT NULL,
    ADD COLUMN `finalClosureDate` DATETIME(3) NOT NULL,
    ADD COLUMN `startDate` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Vote` ADD COLUMN `isThumbUp` BOOLEAN NOT NULL;

-- DropTable
DROP TABLE `Announcement`;

-- DropTable
DROP TABLE `StaffAnnouncement`;
