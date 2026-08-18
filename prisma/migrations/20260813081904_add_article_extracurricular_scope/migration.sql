-- AlterTable
ALTER TABLE "article" ADD COLUMN     "extracurricularId" TEXT;

-- AddForeignKey
ALTER TABLE "article" ADD CONSTRAINT "article_extracurricularId_fkey" FOREIGN KEY ("extracurricularId") REFERENCES "extracurricular"("id") ON DELETE SET NULL ON UPDATE CASCADE;
