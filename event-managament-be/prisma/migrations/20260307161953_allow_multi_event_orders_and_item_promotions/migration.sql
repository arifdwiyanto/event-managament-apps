-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_event_id_fkey";

-- AlterTable
ALTER TABLE "transaction_items" ADD COLUMN     "promotion_id" TEXT;

-- AlterTable
ALTER TABLE "transactions" ALTER COLUMN "event_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction_items" ADD CONSTRAINT "transaction_items_promotion_id_fkey" FOREIGN KEY ("promotion_id") REFERENCES "promotions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
