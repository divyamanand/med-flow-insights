import { api } from '@/lib/api';

export interface AddInventoryItemDto {
  kind: 'medicine' | 'blood' | 'equipment';
  name?: string;
  manufacturer?: string;
  bloodGroup?: string;
  quantity: number;
}

export interface SellInventoryDto {
  itemIdOrName: string;
  quantity: number;
}

export const inventoryService = {
  addItem: async (data: AddInventoryItemDto) => {
    const response = await api.post('/inventory/items', data);
    return response.data;
  },

  sell: async (data: SellInventoryDto) => {
    const response = await api.post('/inventory/sell', data);
    return response.data;
  },
};
