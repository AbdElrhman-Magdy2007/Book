-- AlterTable
ALTER TABLE "CartItem" ADD COLUMN     "guestSessionId" TEXT,
ADD COLUMN     "userId" TEXT;

-- CreateIndex
CREATE INDEX "CartItem_userId_idx" ON "CartItem"("userId");

-- CreateIndex
CREATE INDEX "CartItem_guestSessionId_idx" ON "CartItem"("guestSessionId");
