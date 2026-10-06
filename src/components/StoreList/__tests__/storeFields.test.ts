import { getStoreField } from '../storeFields';
import { physicalStore, onlineStore } from '../../../../test/storeFixtures';

describe('getStoreField', () => {
  it('formats physical addresses with an optional street number', () => {
    expect(getStoreField(physicalStore, 'address')).toBe('Via Roma, 10');
    expect(getStoreField({ ...physicalStore, streetNumber: undefined }, 'address')).toBe('Via Roma');
  });
  it('returns empty strings for actions and missing fields', () => {
    expect(getStoreField(physicalStore, 'actions')).toBe('');
    expect(getStoreField(onlineStore, 'address')).toBe('');
    expect(getStoreField({ ...onlineStore, website: undefined }, 'website')).toBe('');
  });
  it('returns shared fields and online websites', () => {
    expect(getStoreField(physicalStore, 'franchiseName')).toBe('Alpha Store');
    expect(getStoreField(onlineStore, 'website')).toBe('https://online.example');
  });
});
