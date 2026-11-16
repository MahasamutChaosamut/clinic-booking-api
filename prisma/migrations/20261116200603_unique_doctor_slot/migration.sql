/*
  Warnings:

  - A unique constraint covering the columns `[doctor_id,appointment_at]` on the table `appointments` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "appointments_doctor_id_appointment_at_key" ON "appointments"("doctor_id", "appointment_at") WHERE (status <> 'cancelled');
