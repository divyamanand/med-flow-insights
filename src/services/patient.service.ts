import { api } from '@/lib/api';

export interface CreatePatientDto {
  name: string;
  email?: string;
  phone: string;
  address?: string;
  dateOfBirth?: string;
  gender?: string;
}

export interface AddIssueDto {
  patientId: number;
  issue: string;
}

export interface AdmitPatientDto {
  patientId: number;
  roomId: number;
  admissionDate: string;
}

export const patientService = {
  list: async () => {
    const response = await api.get('/patients');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  },

  create: async (data: CreatePatientDto) => {
    const response = await api.post('/patients', data);
    return response.data;
  },

  addIssue: async (data: AddIssueDto) => {
    const response = await api.post('/patients/issues', data);
    return response.data;
  },

  admit: async (data: AdmitPatientDto) => {
    const response = await api.post('/patients/admissions', data);
    return response.data;
  },

  discharge: async (patientId: string) => {
    const response = await api.post('/patients/discharge', { patientId });
    return response.data;
  },
};
