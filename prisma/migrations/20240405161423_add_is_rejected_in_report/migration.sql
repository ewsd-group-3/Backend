/*
  Warnings:

  - You are about to drop the column `isApproved` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Report` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Report` DROP COLUMN `isApproved`,
    DROP COLUMN `status`,
    ADD COLUMN `isRejected` BOOLEAN NOT NULL DEFAULT false;
