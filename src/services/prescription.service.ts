import { api } from '@/lib/api';

export interface CreatePrescriptionDto {
  patientId: string;
  doctorId: string;
  items: Record<string, number>;
  tests: string[];
  nextVisitDateDays?: number;
  remarks?: string;
}

export const prescriptionService = {
  list: async (doctorId?: string, patientId?: string, from?: string, to?: string) => {
    const params = new URLSearchParams();
    if (doctorId) params.append('doctorId', doctorId);
    if (patientId) params.append('patientId', patientId);
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    const response = await api.get(`/prescriptions?${params.toString()}`);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/prescriptions/${id}`);
    return response.data;
  },

  create: async (data: CreatePrescriptionDto) => {
    const response = await api.post('/prescriptions', data);
    return response.data;
  },
};
