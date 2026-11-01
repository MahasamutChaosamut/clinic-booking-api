CREATE TABLE patients (
   id INT GENERATED ALWAYS AS IDENTITY  PRIMARY KEY,
   first_name TEXT NOT NULL,
   last_name TEXT NOT NULL,
   birth_date DATE NOT NULL,
   phone VARCHAR(20),
   created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);