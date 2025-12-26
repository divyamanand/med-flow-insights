import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from '@/components/layout/AppLayout'
// import Home from './routes/Home'
import About from './routes/About'
import NotFound from './routes/NotFound'
import Login from './routes/Login'
import Dashboard from './routes/Dashboard'
import Patients from './routes/Patients'
import Doctors from './routes/Doctors'
import UserProfile from './routes/UserProfile'
import StaffDirectory from './routes/StaffDirectory'
import StaffProfile from './routes/StaffProfile'
import PatientProfile from './routes/PatientProfile'
import AppointmentsList from './routes/Appointments'
import AppointmentDetails from './routes/AppointmentDetails'
import Users from './routes/Users'
import Prescriptions from './routes/Prescriptions'
import PrescriptionDetails from './routes/PrescriptionDetails'
import InventoryManagement from './routes/Inventory'
import InventoryTransactionsPage from './routes/InventoryTransactions'
import RoomsList from './routes/Rooms'
import RoomDetails from './routes/RoomInfo'
import ItemRequirementsManagement from './routes/ItemRequiement'
import RoomRequirementsManagement from './routes/RoomRequirement'
import StaffingRequirements from './routes/StaffRequirement'
import AdministratorSettings from './routes/AdminSettings'
import StaffTimingsOverview from './routes/StaffTimings'
import StaffLeaveManagement from './routes/StaffLeaves'
import HomeLanding from './routes/HomeLanding'
import RequirementPage from './routes/Requirement'
import FulfillmentsPage from './routes/Fulfillments'
import FulfillmentsItemsPage from './routes/FulfillmentsItems'
import FulfillmentsStaffPage from './routes/FulfillmentsStaff'
import FulfillmentsRoomsPage from './routes/FulfillmentsRooms'
import { useAuth } from '@/lib/auth'

function App() {
  const { user } = useAuth()

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <Login />}
      />
      <Route path="/" element={<HomeLanding />} />
      <Route path="/" element={<AppLayout />}>
        <Route path="about" element={<About />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="patients" element={<Patients />} />
        <Route path="patients/:id" element={<PatientProfile />} />
        <Route path="appointments" element={<AppointmentsList />} />
        <Route path="appointments/:id" element={<AppointmentDetails />} />
        <Route path="users" element={<Users />} />
        <Route path="doctors" element={<Doctors />} />
        <Route path="staff" element={<StaffDirectory />} />
        <Route path="staff/:id" element={<StaffProfile />} />
        <Route path="users/:id" element={<UserProfile />} />
        <Route path="prescriptions" element={<Prescriptions />} />
        <Route path="prescriptions/:id" element={<PrescriptionDetails/>} />
        <Route path="inventory" element={<InventoryManagement/>} />
        <Route path="inventory/transactions" element={<InventoryTransactionsPage/>} />
        <Route path="rooms" element={<RoomsList/>} />
        <Route path='rooms/:id' element={<RoomDetails/>}/>
        {/* <Route path='requirements' element={<RequirementPage/>}>
          <Route index element={<Navigate to="rooms" replace />} />
          <Route path='rooms' element={<RoomRequirementsManagement/>}/>
          <Route path='staff' element={<StaffingRequirements/>}/>
          <Route path='items' element={<ItemRequirementsManagement/>}/>
        </Route>
        <Route path='fulfillments' element={<FulfillmentsPage/>}>
          <Route index element={<Navigate to="items" replace />} />
          <Route path='items' element={<FulfillmentsItemsPage/>} />
          <Route path='staff' element={<FulfillmentsStaffPage/>} />
          <Route path='rooms' element={<FulfillmentsRoomsPage/>} />
        </Route>
        <Route path='fulfillment' element={<Navigate to="/fulfillments" replace />} /> */}
        {/** Fulfillment detail routes can be added here if pages exist */}
        <Route path='settings' element={<AdministratorSettings/>}/>
        <Route path='timings' element={<StaffTimingsOverview/>}/>
        <Route path='leaves' element={<StaffLeaveManagement/>}/>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
