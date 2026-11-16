/*
  Warnings:

  - A unique constraint covering the columns `[patient_id,appointment_at]` on the table `appointments` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "appointments_patient_id_appointment_at_key" ON "appointments"("patient_id", "appointment_at") WHERE (status <> 'cancelled');
