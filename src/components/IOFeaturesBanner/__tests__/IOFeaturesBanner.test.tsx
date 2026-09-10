import { render, screen } from '@testing-library/react';
import { IOFeaturesBanner } from '../IOFeaturesBanner';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { useMediaQuery } from '@mui/system';

jest.mock('../../../hooks/useIsMobile', () => ({ useIsMobile: jest.fn() }));
jest.mock('@mui/system', () => ({ ...jest.requireActual('@mui/system'), useMediaQuery: jest.fn() }));

describe('IOFeaturesBanner', () => {
  it('shows the app preview on tablets', () => {
    jest.mocked(useIsMobile).mockReturnValue(false);
    jest.mocked(useMediaQuery).mockReturnValue(true);
    render(<IOFeaturesBanner />);
    expect(screen.getByRole('img', { name: 'Anteprima App IO' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Scopri di/ })).toHaveAttribute('href', 'https://io.italia.it');
  });
  it.each([true, false])('links to the IO website with mobile=%s', (isMobile) => {
    jest.mocked(useMediaQuery).mockReturnValue(false);
    jest.mocked(useIsMobile).mockReturnValue(isMobile);
    render(<IOFeaturesBanner />);
    expect(screen.getByRole('link', { name: /Scopri di/ })).toHaveAttribute('href', 'https://io.italia.it');
  });
});
