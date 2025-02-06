-- AlterTable
ALTER TABLE "Agreement" ALTER COLUMN "agreement_type" DROP NOT NULL,
ALTER COLUMN "agreement_type" SET DATA TYPE TEXT;
