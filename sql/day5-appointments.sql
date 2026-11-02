create table appointments (
    id int generated always as identity primary key,
    patient_id int not null references patients(id),
    doctor_id int not null references doctors(id),
    appointment_at TIMESTAMPTZ NOT NULL,
    status text not null default 'booked',
    created_at TIMESTAMPTZ not null default now()
);