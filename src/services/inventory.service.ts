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
  list: async (kind?: string, name?: string, page?: number, pageSize?: number) => {
    const params = new URLSearchParams();
    if (kind) params.append('kind', kind);
    if (name) params.append('name', name);
    if (page) params.append('page', page.toString());
    if (pageSize) params.append('pageSize', pageSize.toString());
    const response = await api.get(`/inventory/items?${params.toString()}`);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/inventory/items/${id}`);
    return response.data;
  },

  getStocks: async (id: string) => {
    const response = await api.get(`/inventory/items/${id}/stocks`);
    return response.data;
  },

  getAvailability: async (itemName: string) => {
    const response = await api.get(`/inventory/availability?itemName=${itemName}`);
    return response.data;
  },

  addItem: async (data: AddInventoryItemDto) => {
    const response = await api.post('/inventory/items', data);
    return response.data;
  },

  sell: async (data: SellInventoryDto) => {
    const response = await api.post('/inventory/sell', data);
    return response.data;
  },

  addStock: async (itemIdOrName: string, quantity: number) => {
    const response = await api.post('/inventory/stock', { itemIdOrName, quantity });
    return response.data;
  },
};
