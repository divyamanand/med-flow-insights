import { api } from '@/lib/api';

export const dashboardService = {
  // Patient dashboard view
  patientView: async (patientId: string) => {
    const response = await api.get(`/dashboard/patient/${patientId}`);
    return response.data;
  },

  // Doctor dashboard view
  doctorView: async (doctorId: string) => {
    const response = await api.get(`/dashboard/doctor/${doctorId}`);
    return response.data;
  },

  // Reception dashboard view
  receptionView: async () => {
    const response = await api.get('/dashboard/reception');
    return response.data;
  },

  // Admin dashboard view
  adminView: async () => {
    const response = await api.get('/dashboard/admin');
    return response.data;
  },
};
