import { api } from '@/lib/api';

export interface CreateAppointmentDto {
  patientId: string;
  speciality?: string;
  timestamp: string;
}

export const appointmentService = {
  list: async (doctorId?: string, patientId?: string, date?: string, from?: string, to?: string) => {
    const params = new URLSearchParams();
    if (doctorId) params.append('doctorId', doctorId);
    if (patientId) params.append('patientId', patientId);
    if (date) params.append('date', date);
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    const response = await api.get(`/appointments?${params.toString()}`);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },

  create: async (data: CreateAppointmentDto) => {
    const response = await api.post('/appointments', data);
    return response.data;
  },
};
