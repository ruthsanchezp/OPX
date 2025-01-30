/*
  Warnings:

  - You are about to drop the column `client_id` on the `Agreement` table. All the data in the column will be lost.
  - You are about to drop the column `total_amount` on the `Agreement` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Agreement" DROP CONSTRAINT "Agreement_client_id_fkey";

-- AlterTable
ALTER TABLE "Agreement" DROP COLUMN "client_id",
DROP COLUMN "total_amount";
