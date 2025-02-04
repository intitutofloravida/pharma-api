/*
  Warnings:

  - You are about to drop the column `createdAt` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `zipCode` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `manufacturers` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `manufacturers` table. All the data in the column will be lost.
  - The primary key for the `medicine_therapeutic_class` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `medicine_therapeutic_class` table. All the data in the column will be lost.
  - You are about to drop the column `medicineId` on the `medicine_therapeutic_class` table. All the data in the column will be lost.
  - You are about to drop the column `therapeuticClassId` on the `medicine_therapeutic_class` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `medicine_therapeutic_class` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `pathology` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `pathology` table. All the data in the column will be lost.
  - You are about to drop the column `addressId` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `birthDate` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `generalRegistration` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `pharmaceutical_forms` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `pharmaceutical_forms` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `unit_measures` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `unit_measures` table. All the data in the column will be lost.
  - You are about to drop the `Batch` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Batchestock` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Dispensation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Exit` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Medicine` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MedicineEntry` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MedicineStock` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `medicine_variants` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `zip_code` to the `addresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `medicine_id` to the `medicine_therapeutic_class` table without a default value. This is not possible if the table is not empty.
  - Added the required column `therapeutic_class_id` to the `medicine_therapeutic_class` table without a default value. This is not possible if the table is not empty.
  - Added the required column `adress_id` to the `patients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `birth_date` to the `patients` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Batch" DROP CONSTRAINT "Batch_manufacturerId_fkey";

-- DropForeignKey
ALTER TABLE "Batchestock" DROP CONSTRAINT "Batchestock_batchId_fkey";

-- DropForeignKey
ALTER TABLE "Batchestock" DROP CONSTRAINT "Batchestock_medicineStockId_fkey";

-- DropForeignKey
ALTER TABLE "Batchestock" DROP CONSTRAINT "Batchestock_medicineVariantId_fkey";

-- DropForeignKey
ALTER TABLE "Batchestock" DROP CONSTRAINT "Batchestock_stockId_fkey";

-- DropForeignKey
ALTER TABLE "Dispensation" DROP CONSTRAINT "Dispensation_patientId_fkey";

-- DropForeignKey
ALTER TABLE "Exit" DROP CONSTRAINT "Exit_batchestockId_fkey";

-- DropForeignKey
ALTER TABLE "Exit" DROP CONSTRAINT "Exit_dispensationId_fkey";

-- DropForeignKey
ALTER TABLE "Exit" DROP CONSTRAINT "Exit_medicineStockId_fkey";

-- DropForeignKey
ALTER TABLE "Exit" DROP CONSTRAINT "Exit_operatorId_fkey";

-- DropForeignKey
ALTER TABLE "MedicineEntry" DROP CONSTRAINT "MedicineEntry_batcheStockId_fkey";

-- DropForeignKey
ALTER TABLE "MedicineEntry" DROP CONSTRAINT "MedicineEntry_medicineStockId_fkey";

-- DropForeignKey
ALTER TABLE "MedicineEntry" DROP CONSTRAINT "MedicineEntry_movementTypeId_fkey";

-- DropForeignKey
ALTER TABLE "MedicineEntry" DROP CONSTRAINT "MedicineEntry_operatorId_fkey";

-- DropForeignKey
ALTER TABLE "MedicineStock" DROP CONSTRAINT "MedicineStock_medicineVariantId_fkey";

-- DropForeignKey
ALTER TABLE "MedicineStock" DROP CONSTRAINT "MedicineStock_stockId_fkey";

-- DropForeignKey
ALTER TABLE "medicine_therapeutic_class" DROP CONSTRAINT "medicine_therapeutic_class_medicineId_fkey";

-- DropForeignKey
ALTER TABLE "medicine_therapeutic_class" DROP CONSTRAINT "medicine_therapeutic_class_therapeuticClassId_fkey";

-- DropForeignKey
ALTER TABLE "medicine_variants" DROP CONSTRAINT "medicine_variants_medicine_id_fkey";

-- DropForeignKey
ALTER TABLE "medicine_variants" DROP CONSTRAINT "medicine_variants_pharmaceutical_form_id_fkey";

-- DropForeignKey
ALTER TABLE "medicine_variants" DROP CONSTRAINT "medicine_variants_unit_measure_id_fkey";

-- AlterTable
ALTER TABLE "addresses" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
DROP COLUMN "zipCode",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3),
ADD COLUMN     "zip_code" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "manufacturers" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "medicine_therapeutic_class" DROP CONSTRAINT "medicine_therapeutic_class_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "medicineId",
DROP COLUMN "therapeuticClassId",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "medicine_id" TEXT NOT NULL,
ADD COLUMN     "therapeutic_class_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3),
ADD CONSTRAINT "medicine_therapeutic_class_pkey" PRIMARY KEY ("medicine_id", "therapeutic_class_id");

-- AlterTable
ALTER TABLE "pathology" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "patients" DROP COLUMN "addressId",
DROP COLUMN "birthDate",
DROP COLUMN "createdAt",
DROP COLUMN "generalRegistration",
DROP COLUMN "updatedAt",
ADD COLUMN     "adress_id" TEXT NOT NULL,
ADD COLUMN     "birth_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "general_registration" VARCHAR(255),
ADD COLUMN     "updated_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "pharmaceutical_forms" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "therapeutic_classes" ADD COLUMN     "updated_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "unit_measures" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3);

-- DropTable
DROP TABLE "Batch";

-- DropTable
DROP TABLE "Batchestock";

-- DropTable
DROP TABLE "Dispensation";

-- DropTable
DROP TABLE "Exit";

-- DropTable
DROP TABLE "Medicine";

-- DropTable
DROP TABLE "MedicineEntry";

-- DropTable
DROP TABLE "MedicineStock";

-- DropTable
DROP TABLE "medicine_variants";

-- CreateTable
CREATE TABLE "medicines" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "medicines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medicines_variants" (
    "id" TEXT NOT NULL,
    "medicine_id" TEXT NOT NULL,
    "dosage" TEXT NOT NULL,
    "pharmaceutical_form_id" TEXT NOT NULL,
    "unit_measure_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "medicines_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medicines_entries" (
    "id" TEXT NOT NULL,
    "medicine_stock_id" TEXT NOT NULL,
    "batch_stock_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "operator_id" TEXT NOT NULL,
    "movement_type_id" TEXT NOT NULL,
    "entry_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "medicines_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medicines_stocks" (
    "id" TEXT NOT NULL,
    "medicine_variant_id" TEXT NOT NULL,
    "stock_id" TEXT NOT NULL,
    "current_quantity" INTEGER NOT NULL,
    "minimum_level" INTEGER NOT NULL DEFAULT 0,
    "last_move" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "medicines_stocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "batches_stocks" (
    "id" TEXT NOT NULL,
    "stock_id" TEXT NOT NULL,
    "batch_id" TEXT NOT NULL,
    "medicine_variant_id" TEXT NOT NULL,
    "medicine_stock_id" TEXT NOT NULL,
    "current_quantity" INTEGER NOT NULL,
    "last_move" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "batches_stocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "batches" (
    "id" TEXT NOT NULL,
    "manufacturer_id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiration_date" TIMESTAMP(3) NOT NULL,
    "manufacturing_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dispensations" (
    "id" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "dispensation_date" TIMESTAMP(3) NOT NULL,
    "operator_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "dispensations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exits" (
    "id" TEXT NOT NULL,
    "medicineStockId" TEXT NOT NULL,
    "batchestockId" TEXT NOT NULL,
    "operatorId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "exitType" "ExitType" NOT NULL,
    "exitDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dispensationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "exits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "medicines_name_idx" ON "medicines"("name");

-- CreateIndex
CREATE INDEX "medicines_entries_medicine_stock_id_idx" ON "medicines_entries"("medicine_stock_id");

-- CreateIndex
CREATE INDEX "medicines_entries_batch_stock_id_idx" ON "medicines_entries"("batch_stock_id");

-- CreateIndex
CREATE INDEX "medicines_entries_movement_type_id_idx" ON "medicines_entries"("movement_type_id");

-- CreateIndex
CREATE INDEX "medicines_stocks_medicine_variant_id_idx" ON "medicines_stocks"("medicine_variant_id");

-- CreateIndex
CREATE INDEX "medicines_stocks_stock_id_idx" ON "medicines_stocks"("stock_id");

-- CreateIndex
CREATE INDEX "batches_stocks_stock_id_idx" ON "batches_stocks"("stock_id");

-- CreateIndex
CREATE INDEX "batches_stocks_batch_id_idx" ON "batches_stocks"("batch_id");

-- CreateIndex
CREATE INDEX "batches_stocks_medicine_variant_id_idx" ON "batches_stocks"("medicine_variant_id");

-- CreateIndex
CREATE UNIQUE INDEX "batches_code_key" ON "batches"("code");

-- CreateIndex
CREATE INDEX "batches_manufacturer_id_idx" ON "batches"("manufacturer_id");

-- AddForeignKey
ALTER TABLE "medicines_variants" ADD CONSTRAINT "medicines_variants_medicine_id_fkey" FOREIGN KEY ("medicine_id") REFERENCES "medicines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicines_variants" ADD CONSTRAINT "medicines_variants_pharmaceutical_form_id_fkey" FOREIGN KEY ("pharmaceutical_form_id") REFERENCES "pharmaceutical_forms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicines_variants" ADD CONSTRAINT "medicines_variants_unit_measure_id_fkey" FOREIGN KEY ("unit_measure_id") REFERENCES "unit_measures"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicine_therapeutic_class" ADD CONSTRAINT "medicine_therapeutic_class_medicine_id_fkey" FOREIGN KEY ("medicine_id") REFERENCES "medicines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicine_therapeutic_class" ADD CONSTRAINT "medicine_therapeutic_class_therapeutic_class_id_fkey" FOREIGN KEY ("therapeutic_class_id") REFERENCES "therapeutic_classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicines_entries" ADD CONSTRAINT "medicines_entries_medicine_stock_id_fkey" FOREIGN KEY ("medicine_stock_id") REFERENCES "medicines_stocks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicines_entries" ADD CONSTRAINT "medicines_entries_batch_stock_id_fkey" FOREIGN KEY ("batch_stock_id") REFERENCES "batches_stocks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicines_entries" ADD CONSTRAINT "medicines_entries_movement_type_id_fkey" FOREIGN KEY ("movement_type_id") REFERENCES "MovementType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicines_entries" ADD CONSTRAINT "medicines_entries_operator_id_fkey" FOREIGN KEY ("operator_id") REFERENCES "operators"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicines_stocks" ADD CONSTRAINT "medicines_stocks_medicine_variant_id_fkey" FOREIGN KEY ("medicine_variant_id") REFERENCES "medicines_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicines_stocks" ADD CONSTRAINT "medicines_stocks_stock_id_fkey" FOREIGN KEY ("stock_id") REFERENCES "stocks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batches_stocks" ADD CONSTRAINT "batches_stocks_stock_id_fkey" FOREIGN KEY ("stock_id") REFERENCES "stocks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batches_stocks" ADD CONSTRAINT "batches_stocks_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "batches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batches_stocks" ADD CONSTRAINT "batches_stocks_medicine_variant_id_fkey" FOREIGN KEY ("medicine_variant_id") REFERENCES "medicines_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batches_stocks" ADD CONSTRAINT "batches_stocks_medicine_stock_id_fkey" FOREIGN KEY ("medicine_stock_id") REFERENCES "medicines_stocks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "batches" ADD CONSTRAINT "batches_manufacturer_id_fkey" FOREIGN KEY ("manufacturer_id") REFERENCES "manufacturers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dispensations" ADD CONSTRAINT "dispensations_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dispensations" ADD CONSTRAINT "dispensations_operator_id_fkey" FOREIGN KEY ("operator_id") REFERENCES "operators"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exits" ADD CONSTRAINT "exits_operatorId_fkey" FOREIGN KEY ("operatorId") REFERENCES "operators"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exits" ADD CONSTRAINT "exits_batchestockId_fkey" FOREIGN KEY ("batchestockId") REFERENCES "batches_stocks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exits" ADD CONSTRAINT "exits_medicineStockId_fkey" FOREIGN KEY ("medicineStockId") REFERENCES "medicines_stocks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exits" ADD CONSTRAINT "exits_dispensationId_fkey" FOREIGN KEY ("dispensationId") REFERENCES "dispensations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
