-- AlterTable
ALTER TABLE "user" ADD COLUMN     "extracurricularId" TEXT;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_extracurricularId_fkey" FOREIGN KEY ("extracurricularId") REFERENCES "extracurricular"("id") ON DELETE SET NULL ON UPDATE CASCADE;
