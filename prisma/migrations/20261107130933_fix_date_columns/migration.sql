-- AlterTable
ALTER TABLE "patients" ALTER COLUMN "birth_date" SET DATA TYPE DATE
USING ("birth_date" AT TIME ZONE 'Asia/Bangkok')::date;

-- AlterTable
ALTER TABLE "queue" ALTER COLUMN "queue_date" SET DATA TYPE DATE;


