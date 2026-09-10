import { fireEvent, render, screen, within, waitFor } from '@testing-library/react';
import PhysicalStoreFilters from '../PhysicalStoreFilters';
import { physicalStore } from '../../../../test/storeFixtures';
import { useIsMobile } from '../../../hooks/useIsMobile';

jest.mock('../../../hooks/useIsMobile', () => ({ useIsMobile: jest.fn() }));

describe('PhysicalStoreFilters', () => {
  const stores = [physicalStore, { ...physicalStore, id: '2', franchiseName: 'Beta', region: 'Lazio', province: 'RM', city: 'Roma' }];
  beforeEach(() => jest.mocked(useIsMobile).mockReturnValue(false));
  const select = (name: string, option: string) => {
    fireEvent.mouseDown(screen.getByRole('combobox', { name }));
    fireEvent.click(screen.getByRole('option', { name: option }));
  };

  it.each([false, true])('offers merchant suggestions only after three characters with mobile=%s', (mobile) => {
    jest.mocked(useIsMobile).mockReturnValue(mobile);
    const onFilter = jest.fn();
    render(<PhysicalStoreFilters stores={stores} filters={{}} onFilter={onFilter} onClear={jest.fn()} />);
    if (mobile) fireEvent.click(screen.getByRole('button', { name: 'Filtra' }));
    const input = screen.getByRole('combobox', { name: 'Esercente' });
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'Al' } });
    expect(screen.queryByRole('option')).not.toBeInTheDocument();
    fireEvent.change(input, { target: { value: 'aLPha' } });
    fireEvent.click(screen.getByRole('option', { name: 'Alpha Store' }));
    expect(onFilter).toHaveBeenLastCalledWith({ franchiseName: 'Alpha Store', region: null, province: null, city: null });
    fireEvent.blur(input);
    fireEvent.focus(input);
    // JSDOM does not consistently resolve MUI's focused clear-button visibility.
    fireEvent.click(screen.getByTitle('Clear'));
    expect(onFilter).toHaveBeenLastCalledWith({ franchiseName: null, region: null, province: null, city: null });
  });

  it.each(['Regione', 'Provincia', 'Città'])('clears %s and its dependent selections', (name) => {
    const onFilter = jest.fn();
    render(<PhysicalStoreFilters stores={stores} filters={{ region: 'Lombardia', city: 'Milano' }} onFilter={onFilter} onClear={jest.fn()} />);
    select('Provincia', 'Milano');
    select('Città', 'Milano');
    const control = screen.getByRole('combobox', { name }).parentElement!;
    fireEvent.click(within(control).getByRole('button'));
    fireEvent.click(screen.getByRole('button', { name: 'Filtra' }));
    expect(onFilter).toHaveBeenLastCalledWith({ franchiseName: null, region: name === 'Regione' ? null : 'Lombardia', province: name === 'Città' ? 'MI' : null, city: null });
  });

  it('applies all mobile geographic filters and clears them', async () => {
    jest.mocked(useIsMobile).mockReturnValue(true);
    const onFilter = jest.fn();
    const onClear = jest.fn();
    render(<PhysicalStoreFilters stores={stores} filters={{}} onFilter={onFilter} onClear={onClear} />);
    fireEvent.click(screen.getByRole('button', { name: 'Filtra' }));
    select('Regione', 'Lombardia');
    select('Provincia', 'Milano');
    select('Città', 'Milano');
    fireEvent.change(screen.getByRole('combobox', { name: 'Esercente' }), { target: { value: 'Alpha' } });
    fireEvent.blur(screen.getByRole('combobox', { name: 'Esercente' }));
    fireEvent.click(screen.getByRole('button', { name: 'Filtra' }));
    expect(onFilter).toHaveBeenLastCalledWith({ franchiseName: 'Alpha', region: 'Lombardia', province: 'MI', city: 'Milano' });
    await waitFor(() => expect(screen.queryByRole('combobox')).not.toBeInTheDocument());
    fireEvent.click(screen.getByRole('button', { name: 'Filtra (4)' }));
    fireEvent.click(screen.getByRole('button', { name: 'Annulla filtri' }));
    expect(onClear).toHaveBeenCalled();
    expect(screen.getByRole('combobox', { name: 'Esercente' })).toHaveValue('');
  }, 15000);

  it.each(['escape', 'close'])('dismisses the mobile drawer using %s without applying filters', async (method) => {
    jest.mocked(useIsMobile).mockReturnValue(true);
    const onFilter = jest.fn();
    render(<PhysicalStoreFilters stores={stores} filters={{}} onFilter={onFilter} onClear={jest.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: 'Filtra' }));
    if (method === 'escape') fireEvent.keyDown(screen.getByRole('combobox', { name: 'Esercente' }), { key: 'Escape' });
    else fireEvent.click(screen.getByTestId('CloseIcon').closest('button')!);
    await waitFor(() => expect(screen.queryByRole('combobox')).not.toBeInTheDocument());
    expect(onFilter).not.toHaveBeenCalled();
  });

  it('enables dependent fields and submits province abbreviations', () => {
    const onFilter = jest.fn();
    render(<PhysicalStoreFilters stores={stores} filters={{}} onFilter={onFilter} onClear={jest.fn()} />);
    expect(screen.getByRole('combobox', { name: 'Provincia' })).toHaveAttribute('aria-disabled', 'true');
    select('Regione', 'Lombardia');
    select('Provincia', 'Milano');
    select('Città', 'Milano');
    fireEvent.click(screen.getByRole('button', { name: 'Filtra' }));
    expect(onFilter).toHaveBeenLastCalledWith({ franchiseName: null, region: 'Lombardia', province: 'MI', city: 'Milano' });
    select('Regione', 'Lazio');
    fireEvent.click(screen.getByRole('button', { name: 'Filtra' }));
    expect(onFilter).toHaveBeenLastCalledWith({ franchiseName: null, region: 'Lazio', province: null, city: null });
  });

  it('clears selected filters', () => {
    const onClear = jest.fn();
    render(<PhysicalStoreFilters stores={stores} filters={{ region: 'Lombardia', franchiseName: 'Alpha Store' }} onFilter={jest.fn()} onClear={onClear} />);
    fireEvent.click(screen.getByRole('button', { name: 'Rimuovi filtri' }));
    expect(onClear).toHaveBeenCalled();
    expect(screen.getByRole('combobox', { name: 'Esercente' })).toHaveValue('');
  });

  it('opens mobile filters and applies a region selection', () => {
    jest.mocked(useIsMobile).mockReturnValue(true);
    const onFilter = jest.fn();
    render(<PhysicalStoreFilters stores={stores} filters={{}} onFilter={onFilter} onClear={jest.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: 'Filtra' }));
    select('Regione', 'Lombardia');
    fireEvent.click(screen.getByRole('button', { name: 'Filtra' }));
    expect(onFilter).toHaveBeenLastCalledWith({ franchiseName: null, region: 'Lombardia', province: null, city: null });
  });
});
