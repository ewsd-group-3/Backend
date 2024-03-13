/*
  Warnings:

  - You are about to drop the column `ideaById` on the `Report` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `AcademicInfo` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `Report` DROP FOREIGN KEY `Report_ideaById_fkey`;

-- AlterTable
ALTER TABLE `Report` DROP COLUMN `ideaById`;

-- CreateIndex
CREATE UNIQUE INDEX `AcademicInfo_name_key` ON `AcademicInfo`(`name`);
