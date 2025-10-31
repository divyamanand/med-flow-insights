# Frontend Integration Documentation

## Overview
The frontend is now fully integrated with all backend API routes with proper RBAC, pagination support, and comprehensive service layers.

## Architecture

### Service Layer (`src/services/`)
All API interactions are abstracted through service files:

#### Authentication Service (`auth.service.ts`)
- `login(email, password)` - User login
- `register(data)` - User registration  
- `logout()` - User logout
- `me()` - Get current user profile

#### Dashboard Service (`dashboard.service.ts`)
Role-based dashboard views:
- `patientView(patientId)` - Patient-specific dashboard
- `doctorView(doctorId)` - Doctor dashboard with appointments & timings
- `receptionView()` - Reception desk overview
- `adminView()` - Admin system overview

#### Patient Service (`patient.service.ts`)
- `list(page?, pageSize?, search?)` - List patients with pagination
- `getById(id)` - Get patient details
- `getIssues(id)` - Get patient issues
- `getAppointments(id, from?, to?, upcoming?)` - Get patient appointments
- `getCurrentAdmission(id)` - Get current admission
- `getAdmissions(id)` - Get admission history
- `getPrescriptions(id)` - Get prescriptions
- `create(data)` - Create new patient
- `addIssue(data)` - Add patient issue
- `admit(data)` - Admit patient
- `discharge(patientId)` - Discharge patient

#### Staff Service (`staff.service.ts`)
- `list(page?, pageSize?, role?)` - List staff with filters
- `getById(id)` - Get staff details
- `getLeaves(id, from?, to?, upcoming?)` - Get leave records
- `getAvailable(role?, at?)` - Get available staff
- `createStaff(data)` - Create staff member
- `createDoctor(data)` - Convert staff to doctor
- `addTiming(data)` - Add doctor timing
- `requestLeave(data)` - Request leave
- `listDoctors()` - List all doctors

#### Room Service (`room.service.ts`)
- `list()` - List all rooms
- `getById(id)` - Get room details
- `createType(data)` - Create room type
- `create(data)` - Create room
- `allocate(data)` - Allocate room to patient
- `changeStatus(id, data)` - Change room status
- `vacate(id)` - Vacate room
- `statusSummary()` - Get room status counts
- `staffAllocations(id)` - Get staff assigned to room
- `equipmentAllocations(id)` - Get equipment in room
- `occupancy()` - Get occupancy data

#### Appointment Service (`appointment.service.ts`)
- `list(doctorId?, patientId?, date?, from?, to?)` - Search appointments
- `getById(id)` - Get appointment details
- `create(data)` - Create appointment

#### Prescription Service (`prescription.service.ts`)
- `list(doctorId?, patientId?, from?, to?)` - Search prescriptions
- `getById(id)` - Get prescription details
- `create(data)` - Create prescription

#### Inventory Service (`inventory.service.ts`)
- `list(kind?, name?, page?, pageSize?)` - List inventory items
- `getById(id)` - Get item details
- `getStocks(id)` - Get stock entries
- `getAvailability(itemName)` - Get available units
- `addItem(data)` - Add new item
- `sell(data)` - Sell/issue item
- `addStock(itemIdOrName, quantity)` - Add stock

#### Allotment Service (`allotment.service.ts`)
- `request(data)` - Request staff allotment
- `listStaff()` - List staff assignments
- `listRoom()` - List room assignments

## Pages (`src/pages/`)

### Dashboard (`Dashboard.tsx`)
- **Role-based views**: Shows different metrics based on user role
- **Admin**: System overview (rooms, doctors, staff counts)
- **Receptionist**: Reception desk view (admissions, availability)
- **Doctor**: Personal schedule and patients
- Uses `dashboardService` for data fetching

### Patients (`Patients.tsx`)
- List all patients with search functionality
- Integrated with `patientService.list()`
- Displays patient demographics and status
- **RBAC**: Admin, Receptionist access

### Staff (`Staff.tsx`)
- Manage hospital staff
- List with role filtering
- Search by name, email, or role
- **RBAC**: Admin access

### Rooms (`Rooms.tsx`)
- Room management and status overview
- Shows room status summary (available, occupied, maintenance)
- List all rooms with type and status
- **RBAC**: Admin, Receptionist access

### Appointments (`Appointments.tsx`)
- Schedule and view appointments
- Search by patient or doctor
- Shows appointment date, time, duration
- **RBAC**: Admin, Receptionist, Doctor access

### Doctors (`Doctors.tsx`)
- List doctors with specialities
- View doctor profiles and schedules
- **RBAC**: Public (within authenticated users)

### Prescription (`Prescription.tsx`)
- Create and view prescriptions
- Link to patients and doctors
- **RBAC**: Doctor, Admin access

### Inventory Pages
- **Supplies**: General supplies management
- **BloodBank**: Blood inventory tracking
- **Medicines**: Medicine stock management
- **RBAC**: Admin, Pharmacist access

## Authentication & Authorization

### Auth Context (`src/contexts/AuthContext.tsx`)
- Cookie-based authentication (no localStorage)
- Auto-refresh on page load via `/auth/me`
- Provides: `user`, `login`, `register`, `logout`, `isLoading`

### Protected Routes (`src/components/ProtectedRoute.tsx`)
- Wraps routes requiring authentication
- Supports role-based access control
- Redirects to `/auth` if not authenticated

### API Client (`src/lib/api.ts`)
- Axios instance with `withCredentials: true`
- Automatic 401 redirect to auth page
- Base URL from environment variable

## Role-Based Access Control (RBAC)

### Roles
1. **Admin**: Full system access
2. **Receptionist**: Patient management, room allocation, appointments
3. **Doctor**: View patients, create prescriptions, manage appointments
4. **Pharmacist**: Inventory management
5. **Nurse/Staff**: Patient care, room assignments

### Route Protection
Routes are protected at both frontend and backend:
- Frontend: `<ProtectedRoute allowedRoles={['admin', 'receptionist']}>`
- Backend: `requireRoles(Roles.Admin, Roles.Receptionist)`

## Pagination Support

Services support pagination where applicable:
```typescript
// Example usage
patientService.list(1, 20, 'john'); // page 1, 20 items, search 'john'
staffService.list(1, 50, 'doctor'); // page 1, 50 items, role filter
inventoryService.list('medicine', undefined, 1, 25); // medicines, page 1, 25 items
```

Current pages using pagination:
- Patients list
- Staff list
- Inventory list
- Rooms list (ready for pagination)

## Navigation

### Sidebar (`src/components/layout/Sidebar.tsx`)
All available routes:
- Dashboard (/)
- Patients (/patients)
- Doctors (/doctors)
- Staff (/staff)
- Rooms (/rooms)
- Appointments (/appointments)
- Supplies (/supplies)
- Blood Bank (/blood-bank)
- Robots (/robots)
- Medicines (/medicines)
- Prescription (/prescription)
- Patient Monitoring (/rtpatientmonitoring)

### User Profile
- Shows current user name and role
- Logout button in sidebar footer

## Backend Integration

### API Routes Structure
```
/api
  /auth
    POST /login
    POST /register
    POST /logout
    GET /me
  /dashboard
    GET /patient/:id
    GET /doctor/:id
    GET /reception
    GET /admin
  /patients
    GET / (list)
    GET /:id
    GET /:id/issues
    GET /:id/appointments
    GET /:id/admission
    GET /:id/admissions
    GET /:id/prescriptions
    POST / (create)
    POST /issues
    POST /admissions
    POST /discharge
  /staff
    GET / (list)
    GET /:id
    GET /:id/leaves
    GET /available
    GET /doctors
    POST / (create)
    POST /doctors
    POST /timings
    POST /leaves
  /rooms
    GET / (list)
    GET /:id
    GET /status/summary
    GET /:id/allocations/staff
    GET /:id/allocations/equipment
    GET /occupancy
    POST /types
    POST / (create)
    POST /allocate
    PATCH /:id/status
    POST /:id/vacate
  /appointments
    GET / (list with filters)
    GET /:id
    POST / (create)
  /prescriptions
    GET / (list with filters)
    GET /:id
    POST / (create)
  /inventory
    GET /items (list)
    GET /items/:id
    GET /items/:id/stocks
    GET /availability
    POST /items
    POST /sell
    POST /stock
  /allotments
    POST /request
    GET /assignments/staff
    GET /assignments/room
```

## Next Steps

1. **Implement Pagination UI**
   - Add pagination controls to list pages
   - Handle page state in components
   - Add page size selector

2. **Add Detail Pages**
   - Patient detail page
   - Staff detail page
   - Room detail page
   - Appointment detail page

3. **Add Forms**
   - Patient registration form
   - Staff creation form
   - Appointment scheduling form
   - Prescription creation form
   - Room allocation form

4. **Enhanced RBAC**
   - Hide/show sidebar items based on role
   - Disable actions based on permissions
   - Add role-specific dashboards

5. **Real-time Updates**
   - WebSocket integration for live updates
   - Room status changes
   - Appointment notifications

6. **Search & Filters**
   - Advanced search for patients
   - Date range filters for appointments
   - Status filters for rooms
   - Role filters for staff

## Error Handling

All services use try-catch with toast notifications:
```typescript
try {
  const response = await service.method();
  // Success handling
} catch (error: any) {
  toast({
    variant: 'destructive',
    title: 'Error',
    description: error.response?.data?.message || 'Operation failed',
  });
}
```

## Environment Variables

Required environment variables:
```
VITE_API_URL=http://localhost:4000/api  # Backend API URL
```

## Development

### Running the Application
1. Start backend server: `cd server && npm run dev`
2. Start frontend: `npm run dev`
3. Access at: `http://localhost:5173`

### Testing Authentication
1. Register a new user at `/auth`
2. Login with credentials
3. Access protected routes based on role

### API Testing
Use the backend API directly:
```bash
# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}' \
  -c cookies.txt

# Get dashboard (with cookies)
curl http://localhost:4000/api/dashboard/admin \
  -b cookies.txt
```

## Security Notes

1. **Cookie-based Auth**: HttpOnly cookies prevent XSS attacks
2. **CORS**: Configured for credentials
3. **RBAC**: Both frontend and backend enforcement
4. **Input Validation**: DTO validation on backend
5. **Error Messages**: Generic messages to prevent info leakage
