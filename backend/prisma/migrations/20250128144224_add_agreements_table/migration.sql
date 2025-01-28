-- CreateTable
CREATE TABLE "Agreement" (
    "agreement_id" SERIAL NOT NULL,
    "client_id" INTEGER NOT NULL,
    "agreement_type" VARCHAR(50) NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "status" VARCHAR(20) NOT NULL,
    "total_amount" DOUBLE PRECISION NOT NULL,
    "total_installments" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Agreement_pkey" PRIMARY KEY ("agreement_id")
);

-- AddForeignKey
ALTER TABLE "Agreement" ADD CONSTRAINT "Agreement_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "Client"("client_id") ON DELETE CASCADE ON UPDATE CASCADE;
