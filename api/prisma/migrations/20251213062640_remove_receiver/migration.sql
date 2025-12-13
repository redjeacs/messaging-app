/*
  Warnings:

  - You are about to drop the column `receiverId` on the `app_messages` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "app_messages" DROP CONSTRAINT "app_messages_receiverId_fkey";

-- AlterTable
ALTER TABLE "app_messages" DROP COLUMN "receiverId";
