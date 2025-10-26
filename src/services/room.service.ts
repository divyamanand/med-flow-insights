import { api } from '@/lib/api';

export interface CreateRoomTypeDto {
  name: string;
  description?: string;
}

export interface CreateRoomDto {
  roomNumber: string;
  roomTypeId: number;
  floor: number;
}

export interface AllocateRoomDto {
  roomId: number;
  admissionId: number;
}

export interface ChangeRoomStatusDto {
  status: string;
}

export interface AddRoomStaffRequirementDto {
  roomTypeId: number;
  role: string;
  count: number;
}

export interface AddRoomEquipmentRequirementDto {
  roomTypeId: number;
  equipmentName: string;
  count: number;
}

export const roomService = {
  createType: async (data: CreateRoomTypeDto) => {
    const response = await api.post('/rooms/types', data);
    return response.data;
  },

  create: async (data: CreateRoomDto) => {
    const response = await api.post('/rooms', data);
    return response.data;
  },

  list: async () => {
    const response = await api.get('/rooms');
    return response.data;
  },

  allocate: async (data: AllocateRoomDto) => {
    const response = await api.post('/rooms/allocate', data);
    return response.data;
  },

  changeStatus: async (roomId: number, data: ChangeRoomStatusDto) => {
    const response = await api.patch(`/rooms/${roomId}/status`, data);
    return response.data;
  },

  addStaffRequirement: async (data: AddRoomStaffRequirementDto) => {
    const response = await api.post('/rooms/requirements/staff', data);
    return response.data;
  },

  addEquipmentRequirement: async (data: AddRoomEquipmentRequirementDto) => {
    const response = await api.post('/rooms/requirements/equipment', data);
    return response.data;
  },
};
