import type { Store } from './StoreList'
import type { StoreField } from '../../config/initiative'

export const getStoreField = (store: Store, key: StoreField | 'actions'): string => {
  if (key === 'actions') return '';
  if (key === 'address' && store.type === 'PHYSICAL') {
    return store.address + (store.streetNumber ? ', ' + store.streetNumber : '');
  }
  return key in store ? String(store[key as keyof typeof store] ?? '') : '';
};

