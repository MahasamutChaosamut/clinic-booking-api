INSERT INTO doctors (first_name, last_name, specialty, phone, email) VALUES
  ('นพ.วิชัย',    'ใจดี',     'Internal Medicine', '081-111-2222', 'wichai@clinic.example'),
  ('พญ.สุดา',     'รักษ์ไทย', 'Pediatrics',        '082-333-4444', 'suda@clinic.example'),
  ('นพ.ประเสริฐ', 'ทองคำ',    'Internal Medicine', NULL,           'prasert@clinic.example'),
  ('พญ.อรุณี',    'แสงจันทร์', 'Surgery',           '084-777-8888', NULL);

INSERT INTO appointments (patient_id, doctor_id, appointment_at, status) VALUES
  (1, 1, '2026-11-03 09:00+07', 'completed'),
  (1, 1, '2026-11-10 09:00+07', 'booked'),
  (2, 2, '2026-11-03 10:00+07', 'completed'),
  (3, 1, '2026-11-03 11:00+07', 'no_show'),
  (3, 3, '2026-11-05 09:30+07', 'booked'),
  (4, 2, '2026-11-04 13:00+07', 'cancelled'),
  (4, 2, '2026-11-06 13:00+07', 'booked'),
  (5, 3, '2026-11-03 14:00+07', 'completed'),
  (5, 3, '2026-11-04 14:00+07', 'completed'),
  (5, 1, '2026-11-07 15:00+07', 'booked'),
  (7, 3, '2026-11-05 10:00+07', 'booked'),
  (2, 1, '2026-11-05 11:00+07', 'booked');
