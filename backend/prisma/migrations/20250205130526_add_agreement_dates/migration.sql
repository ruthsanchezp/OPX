/*
  Warnings:

  - Added the required column `agreement_type` to the `Agreement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Agreement" ADD COLUMN     "agreement_type" VARCHAR(50) NOT NULL;
