# ER Diagram

```mermaid
erDiagram
patients ||--o{ appointments : "has"
users |o--o| doctors: "is"
appointments ||--o| queue: "has"
appointments }o--|| doctors: "has"

    patients {
        int id PK
        varchar(50) first_name
        varchar(50) last_name
        date birth_date
        varchar(20) phone
        timestamptz created_at
    }
    appointments {
        int id PK
        int patient_id FK
        int doctor_id FK
        timestamptz appointment_at
        AppointmentStatus status
        timestamptz created_at
    }
    doctors {
        int id PK
        varchar(50) first_name
        varchar(50) last_name
        varchar(100) specialty
        varchar(15) phone
        varchar(100) email
        timestamptz deleted_at
        int user_id FK, UK
    }
    users {
        int id PK
        varchar(100) email UK
        text password_hash
        Role role
        timestamptz created_at
    }
    queue{
        int id PK
        int queue_number
        date queue_date
        QueueStatus status
        timestamptz called_at
        timestamptz created_at
        int appointment_id FK,UK
    }
```
