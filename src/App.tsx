
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Doctors from "./pages/Doctors";
import Supplies from "./pages/Supplies";
import BloodBank from "./pages/BloodBank";
import Robots from "./pages/Robots";
import NotFound from "./pages/NotFound";
import MedicinesPage from "./pages/MedicinesPage";
import Prescription from "./pages/Prescription";
import DashboardPage from "./components/patient_monitoring/PatientMonitoring";
import "./lib/firebase";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="patients" element={<Patients />} />
            <Route path="doctors" element={<Doctors />} />
            <Route path="supplies" element={<Supplies />} />
            <Route path="blood-bank" element={<BloodBank />} />
            <Route path="robots" element={<Robots />} />
            <Route path="medicines" element={<MedicinesPage />} />
            <Route path="prescription" element={<Prescription />} />
            <Route path="rtpatientmonitoring" element={<DashboardPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
