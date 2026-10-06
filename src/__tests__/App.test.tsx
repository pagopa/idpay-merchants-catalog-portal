import { act, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { appConfig } from '../config/app';

describe('App', () => {
  beforeEach(() => { global.fetch = jest.fn().mockResolvedValue({ ok: true, json: async () => [] }); });
  it.each(['/', '/unknown'])('renders the catalog and shared layout at %s', async (path) => {
    await act(async () => {
      render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>);
    });
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: appConfig.copy.searchPage.title })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Negozio online' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Informativa Privacy' })).toHaveAttribute('href', appConfig.usersPortalLinks.privacy);
    expect(screen.getByRole('link', { name: "Termini e condizioni d'uso" })).toHaveAttribute('href', appConfig.usersPortalLinks.terms);
    expect(screen.getByRole('link', { name: 'Google Play' })).toHaveAttribute('href', 'https://play.google.com/store/apps/details?id=it.pagopa.io.app');
  }, 15000);
});
