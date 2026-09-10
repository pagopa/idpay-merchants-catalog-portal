import { render, screen, waitFor } from '@testing-library/react';
import SearchStorePage from '../SearchStorePage';
import { appConfig } from '../../../config/app';
import { physicalStore } from '../../../../test/storeFixtures';
import StoreList from '../../../components/StoreList/StoreList';

jest.mock('../../../components/StoreList/StoreList', () => ({ __esModule: true, default: jest.fn(() => <div>Loaded stores</div>) }));

describe('SearchStorePage', () => {
  beforeEach(() => { global.fetch = jest.fn(); jest.clearAllMocks(); });
  afterEach(() => jest.restoreAllMocks());

  it('shows loading content then passes the fetched stores to the list', async () => {
    let resolveFetch!: (response: Response) => void;
    jest.mocked(fetch).mockReturnValue(new Promise(resolve => { resolveFetch = resolve; }));
    render(<SearchStorePage />);
    expect(screen.getByRole('heading', { name: appConfig.copy.searchPage.title })).toBeInTheDocument();
    expect(screen.queryByText('Loaded stores')).not.toBeInTheDocument();
    resolveFetch({ ok: true, json: async () => [physicalStore] } as Response);
    await screen.findByText('Loaded stores');
    expect(fetch).toHaveBeenCalledWith(appConfig.storesUrl);
    expect(jest.mocked(StoreList).mock.calls.at(-1)?.[0].data).toEqual([physicalStore]);
  });

  it.each(['http', 'network', 'json'])('finishes loading after a %s error', async (failure) => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    if (failure === 'network') jest.mocked(fetch).mockRejectedValue(new Error('Network failed'));
    else jest.mocked(fetch).mockResolvedValue({ ok: failure !== 'http', json: async () => { throw new Error('Invalid JSON'); } } as unknown as Response);
    render(<SearchStorePage />);
    await screen.findByText('Loaded stores');
    await waitFor(() => expect(console.log).toHaveBeenCalled());
    expect(jest.mocked(StoreList).mock.calls.at(-1)?.[0].data).toEqual([]);
  });
});
