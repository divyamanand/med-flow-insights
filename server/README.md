# MedFlow Backend (TypeScript + Express + TypeORM)

A modular, layered backend skeleton for a Hospital Management System based on the provided Python design.

- Architecture: entities → DTOs → repositories → services → controllers → routers
- Database: PostgreSQL via TypeORM
- Patterns: Factory and Strategy across rooms, staff, doctors, inventory, appointments
- Modules: Rooms, Staff/Doctors, Patients, Appointments, Prescriptions, Inventory

## Quick start

1. Copy env template and adjust DB creds
   powershell: Copy-Item .env.example .env

2. Install dependencies
   powershell: npm install

3. Start dev server (auto-reload)
   powershell: npm run dev

The server reads .env and connects to PostgreSQL. For first run, TypeORM synchronize is enabled in development to create tables.

## Example routes

- Rooms
  - POST /api/rooms/types          (create room type)
  - POST /api/rooms                (create room via factory)
  - GET  /api/rooms                (list rooms)
  - POST /api/rooms/allocate       (allocate room using strategy)
  - PATCH /api/rooms/:id/status    (change status)

- Staff & Doctors
  - POST /api/staff                (create staff via factory)
  - POST /api/doctors              (create doctor linked to staff)
  - GET  /api/doctors              (list doctors)

- Patients
  - POST /api/patients             (create patient)
  - POST /api/patients/:id/issues  (add issue)
  - POST /api/admissions           (admit patient to room)

- Appointments
  - POST /api/appointments         (create via centralized manager & strategy)

- Prescriptions
  - POST /api/prescriptions        (create prescription)

- Inventory
  - POST /api/inventory/items      (add item via factory)
  - POST /api/inventory/sell       (sell via FIFO strategy)

See controllers for payloads; DTO validation ensures required fields.

## Tech

- Express + express-async-errors
- TypeORM + PostgreSQL
- class-validator + class-transformer
- reflect-metadata

## Notes

- Modules are loosely coupled; services communicate through IDs and the database only.
- For production, set synchronize: false and use migrations.
- Auth middleware is a placeholder (header-based). Replace with JWT/Passport in real deployments.