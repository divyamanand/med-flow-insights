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
  list: async (page?: number, pageSize?: number, role?: string) => {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (pageSize) params.append('pageSize', pageSize.toString());
    if (role) params.append('role', role);
    const response = await api.get(`/staff?${params.toString()}`);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/staff/${id}`);
    return response.data;
  },

  getLeaves: async (id: string, from?: string, to?: string, upcoming?: boolean) => {
    const params = new URLSearchParams();
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    if (upcoming !== undefined) params.append('upcoming', upcoming.toString());
    const response = await api.get(`/staff/${id}/leaves?${params.toString()}`);
    return response.data;
  },

  getAvailable: async (role?: string, at?: string) => {
    const params = new URLSearchParams();
    if (role) params.append('role', role);
    if (at) params.append('at', at);
    const response = await api.get(`/staff/available?${params.toString()}`);
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
