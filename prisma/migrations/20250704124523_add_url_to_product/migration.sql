/*
  Warnings:

  - You are about to drop the column `pdfPath` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "pdfPath",
ADD COLUMN     "url" TEXT;
