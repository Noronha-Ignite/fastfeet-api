/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `packages` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "packages_slug_key" ON "packages"("slug");
