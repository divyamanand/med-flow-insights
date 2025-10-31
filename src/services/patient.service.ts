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
  list: async (page?: number, pageSize?: number, search?: string) => {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (pageSize) params.append('pageSize', pageSize.toString());
    if (search) params.append('search', search);
    const response = await api.get(`/patients?${params.toString()}`);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  },

  getIssues: async (id: string) => {
    const response = await api.get(`/patients/${id}/issues`);
    return response.data;
  },

  getAppointments: async (id: string, from?: string, to?: string, upcoming?: boolean) => {
    const params = new URLSearchParams();
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    if (upcoming !== undefined) params.append('upcoming', upcoming.toString());
    const response = await api.get(`/patients/${id}/appointments?${params.toString()}`);
    return response.data;
  },

  getCurrentAdmission: async (id: string) => {
    const response = await api.get(`/patients/${id}/admission`);
    return response.data;
  },

  getAdmissions: async (id: string) => {
    const response = await api.get(`/patients/${id}/admissions`);
    return response.data;
  },

  getPrescriptions: async (id: string) => {
    const response = await api.get(`/patients/${id}/prescriptions`);
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
