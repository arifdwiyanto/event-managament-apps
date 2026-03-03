/*
  Warnings:

  - A unique constraint covering the columns `[invoice]` on the table `transactions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `invoice` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "invoice" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "transactions_invoice_key" ON "transactions"("invoice");
