import { act, fireEvent, render, screen } from '@testing-library/react';
import { StoreDetailsDrawer } from '../StoreDetailsDrawer';
import { physicalStore, onlineStore } from '../../../../test/storeFixtures';

describe('StoreDetailsDrawer', () => {
  beforeEach(() => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: jest.fn().mockResolvedValue(undefined) } });
    jest.spyOn(window, 'open').mockImplementation(() => null);
  });
  afterEach(() => { jest.restoreAllMocks(); jest.useRealTimers(); });

  it('copies a physical address without optional contacts or street number', () => {
    render(<StoreDetailsDrawer open onClose={jest.fn()} store={{ ...physicalStore, streetNumber: undefined, website: undefined, channelPhone: undefined }} />);
    fireEvent.click(screen.getByRole('button', { name: 'Copia informazioni' }));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Alpha Store\n\nIndirizzo:\nVia Roma\n20100 Milano (MI)\nLombardia\n\n');
    fireEvent.click(screen.getByRole('button', { name: 'Ottieni indicazioni' }));
    expect(window.open).toHaveBeenCalledWith(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Via Roma, 20100 Milano MI Alpha Store')}`, '_blank');
  });

  it('handles an online store without a website', () => {
    render(<StoreDetailsDrawer open onClose={jest.fn()} store={{ ...onlineStore, website: undefined }} />);
    expect(screen.queryByText('Contatti')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Copia informazioni' }));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Online Shop\n\n');
    fireEvent.click(screen.getByRole('button', { name: 'Vai al sito' }));
    expect(window.open).not.toHaveBeenCalled();
  });

  it('clears copy confirmation when reopened', () => {
    const { rerender } = render(<StoreDetailsDrawer open onClose={jest.fn()} store={onlineStore} />);
    fireEvent.click(screen.getByRole('button', { name: 'Copia informazioni' }));
    expect(screen.getByRole('alert')).toBeInTheDocument();
    rerender(<StoreDetailsDrawer open={false} onClose={jest.fn()} store={onlineStore} />);
    rerender(<StoreDetailsDrawer open onClose={jest.fn()} store={onlineStore} />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('shows contacts and copies all physical store information', () => {
    jest.useFakeTimers();
    render(<StoreDetailsDrawer open onClose={jest.fn()} store={physicalStore} />);
    expect(screen.getByRole('link', { name: physicalStore.channelPhone })).toHaveAttribute('href', 'tel:021234567');
    fireEvent.click(screen.getByRole('button', { name: 'Copia informazioni' }));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Alpha Store\n\nIndirizzo:\nVia Roma, 10\n20100 Milano (MI)\nLombardia\n\nTelefono: 021234567\nSito web: https://alpha.example\n');
    expect(screen.getByRole('alert')).toHaveTextContent('Elemento copiato.');
    act(() => { jest.advanceTimersByTime(2500); });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('truncates long drawer texts and exposes their full value in tooltips', () => {
    const longStore = {
      ...physicalStore,
      franchiseName: 'NOMELUNGHISSIMOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO',
      address: 'Via dal nome estremamente lungo che deve restare su una sola riga nel drawer',
      channelPhone: '02123456789012345678901234567890',
      website: 'https://www.example.com/percorso/molto/lungo/che/deve/essere/troncato',
    };
    const address = `${longStore.address}, ${longStore.streetNumber}, ${longStore.zipCode} ${longStore.city} ${longStore.province}`;

    render(<StoreDetailsDrawer open onClose={jest.fn()} store={longStore} />);

    const title = screen.getByText(longStore.franchiseName);
    const addressText = screen.getByText(address);
    const phoneLink = screen.getByRole('link', { name: longStore.channelPhone });
    const websiteLink = screen.getByRole('link', { name: longStore.website });

    expect(title).toHaveAttribute('aria-label', longStore.franchiseName);
    expect(title).not.toHaveClass('MuiTypography-noWrap');

    expect(addressText).toHaveAttribute('aria-label', address);
    expect(addressText).toHaveClass('MuiTypography-noWrap');

    expect(phoneLink).toHaveAttribute('aria-label', longStore.channelPhone);
    expect(websiteLink).toHaveAttribute('aria-label', longStore.website);
  });

  it.each(['Desktop', 'Android'])('opens directions on %s', (userAgent) => {
    jest.spyOn(navigator, 'userAgent', 'get').mockReturnValue(userAgent);
    render(<StoreDetailsDrawer open onClose={jest.fn()} store={physicalStore} />);
    fireEvent.click(screen.getByRole('button', { name: 'Ottieni indicazioni' }));
    const address = encodeURIComponent('Via Roma, 10, 20100 Milano MI Alpha Store');
    expect(window.open).toHaveBeenCalledWith(userAgent === 'Android' ? `geo:0,0?q=${address}` : `https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
  });

  it('copies and opens an online store website', () => {
    render(<StoreDetailsDrawer open onClose={jest.fn()} store={onlineStore} forceMode="swipeable" />);
    expect(screen.queryByText('Indirizzo')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Copia informazioni' }));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Online Shop\n\nSito web: https://online.example\n');
    fireEvent.click(screen.getByRole('button', { name: 'Vai al sito' }));
    expect(window.open).toHaveBeenCalledWith(onlineStore.website, '_blank');
  });

  it('handles missing optional contacts and closes on Escape', () => {
    const onClose = jest.fn();
    render(<StoreDetailsDrawer open onClose={onClose} store={{ ...physicalStore, streetNumber: undefined, website: undefined, channelPhone: undefined }} forceMode="drawer" />);
    expect(screen.queryByText('Contatti')).not.toBeInTheDocument();
    fireEvent.keyDown(screen.getByRole('button', { name: 'Copia informazioni' }), { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });

  it('renders no actions without a selected store', () => {
    render(<StoreDetailsDrawer open onClose={jest.fn()} store={null} />);
    expect(screen.queryByRole('button', { name: 'Copia informazioni' })).not.toBeInTheDocument();
  });
});
