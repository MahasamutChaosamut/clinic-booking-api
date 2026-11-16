const token = process.argv[2];
const body = JSON.stringify({ patientId: 2, doctorId: 2, appointmentAt: '2026-11-26T10:00:00+07:00' });

const requests = Array.from({ length: 10 }, () =>
  fetch('http://localhost:3000/appointments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body,
  }).then((res) => res.status),
);

console.log(await Promise.all(requests));
