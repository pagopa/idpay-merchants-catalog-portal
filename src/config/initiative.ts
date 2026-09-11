import decoder from './bonus_decoder/config.json';
import valore from './bonus_valore/config.json';
import elettrodomestici from './bonus_elettrodomestici/config.json';

export type StoreField = 'franchiseName' | 'address' | 'city' | 'region' | 'province' | 'zipCode' | 'channelPhone' | 'website';
export type TableColumn = {
  key: StoreField | 'actions';
  label: string;
  sortable: boolean;
  align: 'left' | 'right' | 'center';
  width: string;
};
export type InitiativeConfig = {
  initiativeName: string;
  initiativeId: string;
  tableColumns: { physical: TableColumn[]; online: TableColumn[] };
  copy: {
    searchPage: { title: string; description: string };
    realizationPrefix: string;
  };
};
const initiatives = Object.fromEntries(
  [decoder, valore, elettrodomestici].map(config => [config.initiativeName, config as InitiativeConfig]),
);

export const getAppConfig = (initiative: string | undefined, isDevServer: boolean) => {
  const id = initiative || (isDevServer ? 'bonusdecoder' : '');
  if (!Object.hasOwn(initiatives, id)) {
    throw new Error(`VITE_INITIATIVE must be one of: ${Object.keys(initiatives).join(', ')}. Received: "${id}"`);
  }

  const selected = initiatives[id];
  const datasetFile = `pos_export_${selected.initiativeId}.json`;

  const basePath = `/${id}/lista-punti-vendita/`;
  const usersPortalPath = `/${id}/utente`;
  const usersPortalOrigin = isDevServer ? 'https://dev.pari.pagopa.it' : '';

  return {
    ...selected,
    initiative: id,
    basePath,
    storesUrl: `${basePath}data/${datasetFile}`,
    usersPortalLinks: {
      privacy: `${usersPortalOrigin}${usersPortalPath}/privacy-policy`,
      terms: `${usersPortalOrigin}${usersPortalPath}/terms-of-service`,
    },
  };
};
