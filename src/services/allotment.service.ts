import { api } from '@/lib/api';

export interface RequestStaffAllotmentDto {
  roomId: number;
  role: string;
  minutes: number;
}

export const allotmentService = {
  request: async (data: RequestStaffAllotmentDto) => {
    const response = await api.post('/allotments/request', data);
    return response.data;
  },

  listStaff: async () => {
    const response = await api.get('/allotments/assignments/staff');
    return response.data;
  },

  listRoom: async () => {
    const response = await api.get('/allotments/assignments/room');
    return response.data;
  },
};
