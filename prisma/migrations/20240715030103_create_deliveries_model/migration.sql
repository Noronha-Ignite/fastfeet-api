-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM ('WAITING_FOR_PICKUP', 'IN_TRANSIT', 'DELIVERED', 'RETURNED');

-- CreateTable
CREATE TABLE "deliveries" (
    "id" TEXT NOT NULL,
    "status" "DeliveryStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "package_id" TEXT NOT NULL,
    "deliverer_id" TEXT NOT NULL,
    "destination_address_id" TEXT NOT NULL,

    CONSTRAINT "deliveries_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "packages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_deliverer_id_fkey" FOREIGN KEY ("deliverer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_destination_address_id_fkey" FOREIGN KEY ("destination_address_id") REFERENCES "addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
