import { api } from '@/lib/api';

export interface CreateAppointmentDto {
  patientId: string;
  speciality?: string;
  timestamp: string;
}

export const appointmentService = {
  list: async () => {
    const response = await api.get('/appointments');
    return response.data;
  },

  create: async (data: CreateAppointmentDto) => {
    const response = await api.post('/appointments', data);
    return response.data;
  },
};
