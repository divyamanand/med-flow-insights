import { Routes, Route } from 'react-router-dom'
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
import ItemFulfillmentsPage from './routes/ItemFulfillmentsPage'
import StaffFulfillmentsPage from './routes/StaffFulfillmentsPage'
import RoomFulfillmentsPage from './routes/RoomFulfillmentsPage'
import StaffTimingsOverview from './routes/StaffTimings'
import StaffLeaveManagement from './routes/StaffLeaves'
import HomeLanding from './routes/HomeLanding'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
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
        <Route path='requirements/items' element={<ItemRequirementsManagement/>}/>
        <Route path='requirements/items/:id/fulfillments' element={<ItemFulfillmentsPage/>}/>
        <Route path='requirements/staff' element={<StaffingRequirements/>}/>
        <Route path='requirements/staff/:id/fulfillments' element={<StaffFulfillmentsPage/>}/>
        <Route path='requirements/rooms' element={<RoomRequirementsManagement/>}/>
        <Route path='requirements/rooms/:id/fulfillments' element={<RoomFulfillmentsPage/>}/>
        <Route path='settings' element={<AdministratorSettings/>}/>
        <Route path='timings' element={<StaffTimingsOverview/>}/>
        <Route path='leaves' element={<StaffLeaveManagement/>}/>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
