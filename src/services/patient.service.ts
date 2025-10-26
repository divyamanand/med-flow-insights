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

  // Fallback: Since backend doesn't have GET endpoints, we'll use POST to create
  // In a real scenario, you'd add GET endpoints to the backend
  getAll: async () => {
    // This will need to be implemented in backend as GET /patients
    throw new Error('GET /patients endpoint not implemented in backend yet');
  },
};
