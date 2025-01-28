-- AlterTable
ALTER TABLE "Agreement" ALTER COLUMN "agreement_type" DROP NOT NULL,
ALTER COLUMN "start_date" DROP NOT NULL,
ALTER COLUMN "status" DROP NOT NULL,
ALTER COLUMN "total_amount" DROP NOT NULL,
ALTER COLUMN "total_installments" DROP NOT NULL,
ALTER COLUMN "created_at" DROP NOT NULL;
