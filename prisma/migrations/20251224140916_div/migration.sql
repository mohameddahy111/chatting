/*
  Warnings:

  - You are about to drop the `_MessageReceiver` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `receivedById` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_MessageReceiver" DROP CONSTRAINT "_MessageReceiver_A_fkey";

-- DropForeignKey
ALTER TABLE "_MessageReceiver" DROP CONSTRAINT "_MessageReceiver_B_fkey";

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "receivedById" TEXT NOT NULL;

-- DropTable
DROP TABLE "_MessageReceiver";

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_receivedById_fkey" FOREIGN KEY ("receivedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
