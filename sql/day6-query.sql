INSERT INTO appointments (patient_id, doctor_id, appointment_at, status)
SELECT
  (random() * 6)::int + 1,                                   -- patient 1..7
  (random() * 3)::int + 1,                                   -- doctor 1..4
  timestamp  '2024-01-01 08:00+07'
    + (random() * 1000)::int * interval '1 day'               -- สุ่มวันในช่วง ~1000 วัน
    + (random() * 8)::int    * interval '1 hour',              -- สุ่มชั่วโมง 08:00–16:00
  'completed'
FROM generate_series(1, 200000);

ANALYZE appointments;

EXPLAIN ANALYZE
SELECT id, patient_id, doctor_id, appointment_at
FROM appointments
WHERE doctor_id = 2
  AND appointment_at >= '2025-06-10' AND appointment_at < '2025-06-11'
;

CREATE INDEX appointments_at_index ON appointments (appointment_at);

CREATE INDEX doctor_id_index ON appointments (doctor_id);

DROP index doctor_id_index;

create index idx_appointments_doctor_id_appointment_at on appointments(doctor_id, appointment_at);

EXPLAIN ANALYZE
SELECT id, patient_id, doctor_id, appointment_at
FROM appointments
WHERE doctor_id = 2
  AND appointment_at >= '2025-06-10'
  AND appointment_at <  '2025-06-11';

SELECT id, patient_id, doctor_id, appointment_at, status FROM appointments WHERE id = 1;
SELECT count(*) FROM appointments;

BEGIN;
UPDATE appointments SET status = 'cancelled' WHERE id = 1;
INSERT INTO appointments (patient_id, doctor_id, appointment_at)
VALUES (1, 1, '2026-12-01 10:00+07');
SELECT id, status FROM appointments WHERE id = 1;     
SELECT count(*) FROM appointments;                     
ROLLBACK;
SELECT id, status FROM appointments WHERE id = 1;     
SELECT count(*) FROM appointments;                    

UPDATE appointments SET status = 'completed' WHERE id = 1;

DELETE FROM appointments
WHERE patient_id = 1 AND doctor_id = 1
  AND appointment_at = '2026-12-01 10:00+07';
