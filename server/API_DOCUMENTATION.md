# Hospital Management System - API Documentation

## Base URL
`http://localhost:4000/api`

## Authentication
Most endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_token>
```

## Authentication Endpoints

### POST /auth/login
Login with email and password.
```json
{
  "email": "admin@hospital.com",
  "password": "password123"
}
```

### POST /auth/register
Register a new staff member. First registration creates an admin. After that, only admins can register new users.
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "dob": "1990-01-01",
  "gender": "Male",
  "email": "john@hospital.com",
  "contact": "1234567890",
  "bloodGroup": "O+",
  "role": "Admin",
  "password": "password123"
}
```

**Roles:** Admin, Doctor, Nurse, Receptionist, Pharmacist

---

## Patient Management

### GET /patients
List all patients (Requires authentication)

### GET /patients/:id
Get a specific patient by ID

### POST /patients
Create a new patient (Admin, Receptionist only)
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "dob": "1985-05-15",
  "gender": "Female",
  "email": "jane@example.com",
  "contact": "9876543210",
  "bloodGroup": "A+",
  "password": "patient123"
}
```

### POST /patients/issues
Add an issue to a patient (Doctor, Admin only)
```json
{
  "patientId": "uuid-here",
  "issue": "Fever and Cough"
}
```

### POST /patients/admissions
Admit a patient to a room (Admin, Receptionist only)
```json
{
  "patientId": "uuid-here",
  "roomId": 1
}
```

### POST /patients/admissions/with-staff
Admit a patient and automatically request staff based on room requirements
```json
{
  "patientId": "uuid-here",
  "roomId": 1,
  "minutes": 120
}
```

### POST /patients/admissions/full
Full admission flow: admit patient, create appointment, and request staff
```json
{
  "patientId": "uuid-here",
  "roomId": 1,
  "issues": ["Fever", "Cough"],
  "apptDuration": 30,
  "staffMinutes": 120
}
```

### POST /patients/discharge
Discharge a patient
```json
{
  "patientId": "uuid-here"
}
```

---

## Staff Management

### GET /staff
List all staff members

### GET /staff/:id
Get a specific staff member by ID

### POST /staff
Create a new staff member (Admin only)
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "dob": "1990-01-01",
  "gender": "Male",
  "email": "john@hospital.com",
  "contact": "1234567890",
  "bloodGroup": "O+",
  "role": "Nurse",
  "password": "password123"
}
```

### GET /staff/doctors
List all doctors

### POST /staff/doctors
Create a doctor profile for a staff member (Admin only)
```json
{
  "staffId": "uuid-here",
  "specialities": ["Cardiology", "Internal Medicine"]
}
```

### POST /staff/timings
Add working timings for a doctor (Admin only)
```json
{
  "staffId": "uuid-here",
  "day": "Monday",
  "startTime": "09:00",
  "endTime": "17:00"
}
```

### POST /staff/leaves
Request leave (Any authenticated staff)
```json
{
  "staffId": "uuid-here",
  "startDate": "2025-02-01",
  "endDate": "2025-02-05"
}
```

---

## Staff Allotment

### POST /allotments/request
Request staff for a room (Admin only)
```json
{
  "roomId": 1,
  "role": "Nurse",
  "minutes": 120
}
```

### GET /allotments/assignments/staff
List assignments for a specific staff member
Query params: `staffId=uuid-here`

### GET /allotments/assignments/room
List assignments for a specific room
Query params: `roomId=1`

### POST /allotments/release
Release staff from a room (Admin only)
```json
{
  "staffId": "uuid-here",
  "roomId": 1
}
```

### POST /allotments/process/pending
Process pending staff allotment requests (Admin only)

### POST /allotments/process/room-requirements
Process permanent room staff requirements (Admin only)

---

## Room Management

### GET /rooms
List all rooms

### POST /rooms/types
Create a new room type (Admin only)
```json
{
  "name": "ICU"
}
```

### POST /rooms
Create a new room (Admin only)
```json
{
  "roomNumber": 101,
  "roomName": "ICU-1",
  "typeId": 1
}
```

### POST /rooms/allocate
Allocate a room to an employee (Admin, Receptionist)
```json
{
  "userId": "uuid-here",
  "requiredRoomType": "ICU"
}
```

### PATCH /rooms/:id/status
Change room status (Admin only)
```json
{
  "status": "occupied"
}
```
**Status options:** vacant, occupied, cleaning, maintenance

### POST /rooms/requirements/staff
Add staff requirement to a room (Admin only)
```json
{
  "roomId": 1,
  "role": "Nurse",
  "count": 2
}
```

### POST /rooms/requirements/equipment
Add equipment requirement to a room (Admin only)
```json
{
  "roomId": 1,
  "equipmentType": "Ventilator",
  "count": 1
}
```

### POST /rooms/:id/vacate
Vacate a room (Admin only)

---

## Appointments

### GET /appointments
List all appointments

### POST /appointments
Create an appointment (Admin, Receptionist only)
```json
{
  "patientId": "uuid-here",
  "timestamp": "2025-02-01T10:00:00Z",
  "speciality": "Cardiology",
  "duration": 30
}
```
Optional fields: `doctorId`, `duration` (defaults to 15 minutes)

---

## Prescriptions

### GET /prescriptions
List all prescriptions

### POST /prescriptions
Create a prescription (Doctor, Admin only)
```json
{
  "patientId": "uuid-here",
  "doctorId": "uuid-here",
  "items": {
    "Paracetamol": 10,
    "Amoxicillin": 7
  },
  "tests": ["Blood Test", "X-Ray"],
  "nextVisitDateDays": 15,
  "remarks": "Take medicine after meals"
}
```

---

## Inventory Management

### GET /inventory/items
List all inventory items

### POST /inventory/items
Add a new inventory item (Admin, Pharmacist only)
```json
{
  "kind": "medicine",
  "name": "Paracetamol",
  "manufacturer": "PharmaCo",
  "quantity": 100
}
```
**Kind options:** medicine, blood, equipment

For blood:
```json
{
  "kind": "blood",
  "bloodGroup": "O+",
  "quantity": 5
}
```

### POST /inventory/sell
Sell/dispense inventory (Admin, Pharmacist only)
```json
{
  "itemIdOrName": "Paracetamol",
  "quantity": 10
}
```

### POST /inventory/stock
Add stock to an existing item (Admin, Pharmacist only)
```json
{
  "itemIdOrName": "Paracetamol",
  "quantity": 50
}
```

### POST /inventory/equipment/allot
Allocate equipment to a room (Admin only)
```json
{
  "itemName": "Ventilator",
  "roomId": 1,
  "quantity": 1,
  "minutes": 480
}
```

### POST /inventory/equipment/release
Release equipment from a room (Admin only)
```json
{
  "itemName": "Ventilator",
  "roomId": 1
}
```

### POST /inventory/equipment/request
Request equipment for a room (Admin, Receptionist)
```json
{
  "roomId": 1,
  "equipmentType": "Ventilator",
  "quantity": 1,
  "minutes": 480
}
```

### POST /inventory/equipment/process-requirements
Process pending equipment requirements (Admin only)

---

## Error Responses

All endpoints return errors in the following format:
```json
{
  "success": false,
  "error": {
    "message": "Error message here",
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

Common HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request (validation error)
- 401: Unauthorized
- 403: Forbidden (insufficient permissions)
- 404: Not Found
- 500: Internal Server Error

---

## Role-Based Access Control

| Endpoint | Admin | Doctor | Nurse | Receptionist | Pharmacist |
|----------|-------|--------|-------|--------------|------------|
| Create Patient | ✓ | ✗ | ✗ | ✓ | ✗ |
| Add Issue | ✓ | ✓ | ✗ | ✗ | ✗ |
| Admit Patient | ✓ | ✗ | ✗ | ✓ | ✗ |
| Create Staff | ✓ | ✗ | ✗ | ✗ | ✗ |
| Create Prescription | ✓ | ✓ | ✗ | ✗ | ✗ |
| Manage Rooms | ✓ | ✗ | ✗ | ✗ | ✗ |
| Manage Inventory | ✓ | ✗ | ✗ | ✗ | ✓ |
| Staff Allotment | ✓ | ✗ | ✗ | ✗ | ✗ |
