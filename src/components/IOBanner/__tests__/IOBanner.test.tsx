import { render, screen } from '@testing-library/react';
import { IOBanner } from '../IOBanner';
import { useIsMobile } from '../../../hooks/useIsMobile';

jest.mock('../../../hooks/useIsMobile', () => ({ useIsMobile: jest.fn() }));

describe('IOBanner', () => {
  it.each([true, false])('offers both app downloads with mobile=%s', (isMobile) => {
    jest.mocked(useIsMobile).mockReturnValue(isMobile);
    render(<IOBanner />);
    expect(screen.getByRole('link', { name: 'Google Play' })).toHaveAttribute('href', 'https://play.google.com/store/apps/details?id=it.pagopa.io.app');
    expect(screen.getByRole('link', { name: 'App Store' })).toHaveAttribute('href', 'https://apps.apple.com/it/app/io/id1501681835');
  });
});
