import { api } from '@/lib/api';

export interface CreateStaffDto {
  name: string;
  email: string;
  password: string;
  role: string;
  phone?: string;
  department?: string;
}

export interface CreateDoctorDto {
  staffId: number;
  specialities: string[];
}

export interface AddTimingDto {
  doctorId: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface RequestLeaveDto {
  staffId: number;
  startDate: string;
  endDate: string;
  reason: string;
}

export const staffService = {
  list: async () => {
    const response = await api.get('/staff');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/staff/${id}`);
    return response.data;
  },

  createStaff: async (data: CreateStaffDto) => {
    const response = await api.post('/staff', data);
    return response.data;
  },

  createDoctor: async (data: CreateDoctorDto) => {
    const response = await api.post('/staff/doctors', data);
    return response.data;
  },

  addTiming: async (data: AddTimingDto) => {
    const response = await api.post('/staff/timings', data);
    return response.data;
  },

  requestLeave: async (data: RequestLeaveDto) => {
    const response = await api.post('/staff/leaves', data);
    return response.data;
  },

  listDoctors: async () => {
    const response = await api.get('/staff/doctors');
    return response.data;
  },
};
