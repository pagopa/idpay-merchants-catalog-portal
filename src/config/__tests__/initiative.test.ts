import { getAppConfig } from '../initiative';

describe('getAppConfig', () => {
  it.each(['bonusdecoder', 'bonusvalore', 'bonuselettrodomestici'])(
    'resolves development and production URLs for %s', (initiative) => {
      const dev = getAppConfig(initiative, true);
      const prod = getAppConfig(initiative, false);
      expect(prod.basePath).toBe(`/${initiative}/lista-punti-vendita/`);
      expect(prod.storesUrl).toBe(`/${initiative}/lista-punti-vendita/data/pos_export_${prod.initiativeId}.json`);
      expect(dev.storesUrl).toBe(`${dev.basePath}data/pos_export_${dev.initiativeId}.json`);
      expect(prod.usersPortalLinks.privacy).toBe(`/${initiative}/utente/privacy-policy`);
      expect(dev.usersPortalLinks.terms).toBe(`https://dev.pari.pagopa.it/${initiative}/utente/terms-of-service`);
    },
  );

  it('defaults to bonusdecoder only in development', () => {
    expect(getAppConfig(undefined, true).initiative).toBe('bonusdecoder');
    expect(() => getAppConfig(undefined, false)).toThrow('VITE_INITIATIVE');
  });

  it.each(['unknown', 'toString', '__proto__'])('rejects invalid initiative %s', (initiative) => {
    expect(() => getAppConfig(initiative, true)).toThrow('VITE_INITIATIVE');
  });
});
