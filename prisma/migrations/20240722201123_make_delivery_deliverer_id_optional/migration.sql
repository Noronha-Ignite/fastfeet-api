-- DropForeignKey
ALTER TABLE "deliveries" DROP CONSTRAINT "deliveries_deliverer_id_fkey";

-- AlterTable
ALTER TABLE "deliveries" ALTER COLUMN "deliverer_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_deliverer_id_fkey" FOREIGN KEY ("deliverer_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
