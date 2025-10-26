import { api } from '@/lib/api';

export interface CreateAppointmentDto {
  patientId: string;
  speciality?: string;
  timestamp: string;
}

export const appointmentService = {
  create: async (data: CreateAppointmentDto) => {
    const response = await api.post('/appointments', data);
    return response.data;
  },
};
