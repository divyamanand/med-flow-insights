import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Layout } from "@/components/layout/Layout";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Patients from "@/pages/Patients";
import Doctors from "@/pages/Doctors";
import Staff from "@/pages/Staff";
import Rooms from "@/pages/Rooms";
import Appointments from "@/pages/Appointments";
import NotFound from "@/pages/NotFound";
import Prescription from "@/pages/Prescription";
import InventoryPrediction from "@/pages/InventoryPrediction";
import Auth from "@/pages/Auth";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/app" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="patients" element={<Patients />} />
          <Route path="doctors" element={<Doctors />} />
          <Route path="staff" element={<Staff />} />
          <Route path="rooms" element={<Rooms />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="inventory" element={<InventoryPrediction />} />
          <Route path="prescription" element={<Prescription />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
