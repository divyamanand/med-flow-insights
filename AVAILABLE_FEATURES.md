# Available Features

This document lists all features currently implemented and supported by the backend API.

## Configuration

- **Backend Server**: http://localhost:4000
- **Frontend**: http://localhost:5173
- **API Base**: http://localhost:4000/api

## Implemented Features

### ✅ Authentication
- Login (email/password)
- Registration (Admin can create new users)
- Logout (cookie-based session)
- Current user profile (`GET /auth/me`)

### ✅ Patient Management
- List patients with pagination
- View patient details
- Create new patients
- View patient issues
- View patient appointments
- View patient admissions (current and history)
- View patient prescriptions

### ✅ Doctor Management
- List doctors with specialities
- View doctor profile
- View doctor timings (weekly schedule)
- View doctor appointments
- View doctor's patients

### ✅ Staff Management
- List all staff (filter by role)
- View staff profile
- Create new staff
- Create doctor records
- Add doctor timings
- Request leave
- View staff leaves
- Check staff availability

### ✅ Room Management
- List all rooms
- View room details
- View room status summary
- View room staff allocations
- View room equipment allocations
- View room requirements (staff & equipment)
- View room occupancy

### ✅ Appointments
- List appointments (filter by doctor/patient/date)
- View appointment details
- Create new appointments

### ✅ Prescriptions
- List prescriptions (filter by doctor/patient)
- View prescription details
- Create new prescriptions

### ✅ Inventory Management
- List inventory items (filter by kind: medicine/blood/equipment)
- View item details
- View item stocks
- Check item availability
- Add new inventory items
- Sell/issue inventory
- Add stock
- View equipment requirements
- View equipment allotments

### ✅ Staff Allotments
- Request staff allotment
- List active staff assignments
- View staff assignment history
- View temporary staff requests

### ✅ Dashboards (Role-Based)
- Patient Dashboard (admission, appointments, prescriptions, issues)
- Doctor Dashboard (today's appointments, timings, patients)
- Reception Dashboard (rooms, admitted patients, doctors, staff)
- Admin Dashboard (system overview, counts, statistics)

## Role-Based Access Control (RBAC)

All routes are protected by authentication and role-based permissions:

- **Admin**: Full access to all features
- **Receptionist**: Access to patients, appointments, rooms, inventory
- **Doctor**: Access to their appointments, patients, prescriptions
- **Nurse**: Access to patients, rooms, inventory
- **Pharmacist**: Access to inventory, prescriptions

## Removed Features

The following features were removed as they are not supported by the backend:

- ❌ Robots/Automation (was using Firebase WebSocket)
- ❌ Real-time Patient Monitoring (was using Firebase)
- ❌ Separate Blood Bank page (now part of Inventory with kind=blood)
- ❌ Separate Supplies page (now part of Inventory)
- ❌ Separate Medicines page (now part of Inventory with kind=medicine)

All inventory management (medicines, blood, equipment) is now unified under the **Inventory** page.
