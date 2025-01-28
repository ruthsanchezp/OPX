-- CreateTable
CREATE TABLE "Client" (
    "client_id" SERIAL NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100),
    "id_fiscal" VARCHAR(50) NOT NULL,
    "phone" VARCHAR(20),
    "email" VARCHAR(100),
    "address" VARCHAR(255),
    "city" VARCHAR(100),
    "country" VARCHAR(100),
    "birth_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("client_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_id_fiscal_key" ON "Client"("id_fiscal");
