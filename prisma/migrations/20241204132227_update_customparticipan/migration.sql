-- AlterTable
ALTER TABLE "RunnerParticipation" ADD COLUMN     "runnerId" INTEGER;

-- AddForeignKey
ALTER TABLE "RunnerParticipation" ADD CONSTRAINT "RunnerParticipation_runnerId_fkey" FOREIGN KEY ("runnerId") REFERENCES "Runner"("id") ON DELETE SET NULL ON UPDATE CASCADE;
