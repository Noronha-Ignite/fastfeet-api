/*
  Warnings:

  - A unique constraint covering the columns `[package_id]` on the table `deliveries` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "deliveries_package_id_key" ON "deliveries"("package_id");
