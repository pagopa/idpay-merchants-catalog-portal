import type { PhysicalStore, OnlineStore } from '../src/components/StoreList/StoreList';

export const physicalStore: PhysicalStore = {
  id: 'physical-1', type: 'PHYSICAL', franchiseName: 'Alpha Store',
  address: 'Via Roma', streetNumber: '10', city: 'Milano', province: 'MI',
  region: 'Lombardia', zipCode: '20100', channelPhone: '021234567',
  website: 'https://alpha.example',
};

export const onlineStore: OnlineStore = {
  id: 'online-1', type: 'ONLINE', franchiseName: 'Online Shop', website: 'https://online.example',
};
