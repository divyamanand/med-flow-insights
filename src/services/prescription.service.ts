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
  list: async () => {
    const response = await api.get('/prescriptions');
    return response.data;
  },

  create: async (data: CreatePrescriptionDto) => {
    const response = await api.post('/prescriptions', data);
    return response.data;
  },
};
