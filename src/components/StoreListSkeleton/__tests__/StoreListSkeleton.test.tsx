import { render } from '@testing-library/react';
import StoreListSkeleton from '../StoreListSkeleton';
import { useIsMobile } from '../../../hooks/useIsMobile';

jest.mock('../../../hooks/useIsMobile', () => ({ useIsMobile: jest.fn() }));

describe('StoreListSkeleton', () => {
  it.each([true, false])('renders loading placeholders with mobile=%s', (mobile) => {
    jest.mocked(useIsMobile).mockReturnValue(mobile);
    const { container } = render(<StoreListSkeleton />);
    expect(container.querySelectorAll('.MuiSkeleton-root').length).toBeGreaterThan(0);
    expect(container.querySelectorAll('.MuiCard-root')).toHaveLength(mobile ? 8 : 0);
  });
});
