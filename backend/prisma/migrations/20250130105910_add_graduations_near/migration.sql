-- AlterTable
ALTER TABLE "MedicalOrder" ADD COLUMN     "cristales" VARCHAR(255),
ADD COLUMN     "observaciones" TEXT;

-- CreateTable
CREATE TABLE "GraduationNear" (
    "graduation_near_id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "eye" VARCHAR(10) NOT NULL,
    "SPH" DOUBLE PRECISION,
    "CYL" DOUBLE PRECISION,
    "EJE" DOUBLE PRECISION,
    "DP" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GraduationNear_pkey" PRIMARY KEY ("graduation_near_id")
);

-- AddForeignKey
ALTER TABLE "GraduationNear" ADD CONSTRAINT "GraduationNear_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "MedicalOrder"("order_id") ON DELETE RESTRICT ON UPDATE CASCADE;
