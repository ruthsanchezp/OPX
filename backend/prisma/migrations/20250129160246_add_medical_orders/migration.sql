-- CreateTable
CREATE TABLE "MedicalOrder" (
    "order_id" SERIAL NOT NULL,
    "client_id" INTEGER NOT NULL,
    "created_by" INTEGER NOT NULL,
    "reviewed_by" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MedicalOrder_pkey" PRIMARY KEY ("order_id")
);

-- CreateTable
CREATE TABLE "Graduation" (
    "graduation_id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "eye" VARCHAR(10) NOT NULL,
    "SPH" DOUBLE PRECISION,
    "CYL" DOUBLE PRECISION,
    "EJE" DOUBLE PRECISION,
    "DP" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Graduation_pkey" PRIMARY KEY ("graduation_id")
);

-- AddForeignKey
ALTER TABLE "MedicalOrder" ADD CONSTRAINT "MedicalOrder_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client"("client_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalOrder" ADD CONSTRAINT "MedicalOrder_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicalOrder" ADD CONSTRAINT "MedicalOrder_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Graduation" ADD CONSTRAINT "Graduation_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "MedicalOrder"("order_id") ON DELETE RESTRICT ON UPDATE CASCADE;
