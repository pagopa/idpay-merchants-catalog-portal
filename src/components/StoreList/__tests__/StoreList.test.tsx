import { fireEvent, render, screen, within, waitFor } from '@testing-library/react';
import StoreList from '../StoreList';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { physicalStore, onlineStore } from '../../../../test/storeFixtures';

jest.mock('../../../hooks/useIsMobile', () => ({ useIsMobile: jest.fn() }));

describe('StoreList', () => {
  beforeEach(() => { jest.mocked(useIsMobile).mockReturnValue(false); });

  it('clears filters and restores stores', () => {
    render(<StoreList data={[physicalStore]} />);
    fireEvent.change(screen.getByRole('combobox', { name: 'Esercente' }), { target: { value: 'missing' } });
    expect(within(screen.getByRole('table')).queryByText('Alpha Store')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Rimuovi filtri' }));
    expect(within(screen.getByRole('table')).getByText('Alpha Store')).toBeInTheDocument();
  });

  it('opens desktop details and closes them on Escape', async () => {
    render(<StoreList data={[physicalStore]} />);
    fireEvent.click(screen.getByRole('button', { name: 'Mostra dettagli' }));
    fireEvent.keyDown(screen.getByRole('button', { name: 'Copia informazioni' }), { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('button', { name: 'Copia informazioni' })).not.toBeInTheDocument());
  }, 15000);

  it('switches mobile channels and displays missing online websites', () => {
    jest.mocked(useIsMobile).mockReturnValue(true);
    render(<StoreList data={[physicalStore, { ...onlineStore, website: undefined }]} />);
    fireEvent.click(screen.getByRole('button', { name: 'Online' }));
    expect(screen.getByText('Online Shop')).toBeInTheDocument();
    expect(within(screen.getByText('Online Shop').closest('.MuiCard-root') as HTMLElement).getByText('-')).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Fisico' }));
    expect(screen.getByText('Alpha Store')).toBeInTheDocument();
  });

  it('normalizes names, sorts physical stores and switches between channels', () => {
    render(<StoreList data={[{ ...physicalStore, franchiseName: '  Zebra   Shop ' }, physicalStore, onlineStore]} />);
    expect(screen.queryByText('Online Shop')).not.toBeInTheDocument();
    expect(within(screen.getAllByRole('row')[1]).getByText('Alpha Store')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Esercente' }));
    expect(within(screen.getAllByRole('row')[1]).getByText('Zebra Shop')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Negozio online' }));
    expect(screen.getByText('Online Shop')).toBeInTheDocument();
    expect(screen.queryByText('Alpha Store')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Punti vendita' }));
    expect(screen.getByText('Alpha Store')).toBeInTheDocument();
  });

  it('filters by merchant name ignoring spaces and case', () => {
    render(<StoreList data={[physicalStore, { ...physicalStore, id: '2', franchiseName: 'Beta'}]} />);
    fireEvent.change(screen.getByRole('combobox', { name: 'Esercente' }), { target: { value: 'aLpHaSt' } });
    expect(within(screen.getByRole('table')).getByText('Alpha Store')).toBeInTheDocument();
    expect(within(screen.getByRole('table')).queryByText('Beta')).not.toBeInTheDocument();
  });

  it('opens website links from the online table', () => {
    const open = jest.spyOn(window, 'open').mockImplementation(() => null);
    render(<StoreList data={[onlineStore]} />);
    fireEvent.click(screen.getByRole('button', { name: 'Negozio online' }));
    fireEvent.click(screen.getByText(onlineStore.website!));
    expect(open).toHaveBeenCalledWith(onlineStore.website, '_blank', 'noopener,noreferrer');
    open.mockRestore();
  });

  it('shows mobile cards and opens store details', () => {
    jest.mocked(useIsMobile).mockReturnValue(true);
    render(<StoreList data={[physicalStore, onlineStore]} />);
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Mostra dettagli' }));
    expect(screen.getByRole('button', { name: 'Copia informazioni' })).toBeInTheDocument();
  });
});
