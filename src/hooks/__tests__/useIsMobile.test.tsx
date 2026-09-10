import { renderHook } from '@testing-library/react';
import { useIsMobile } from '../useIsMobile';

describe('useIsMobile', () => {
  const originalMatchMedia = window.matchMedia;
  afterEach(() => { window.matchMedia = originalMatchMedia; });
  it.each([true, false])('returns %s when the mobile media query matches accordingly', (matches) => {
    window.matchMedia = jest.fn().mockImplementation((query: string) => ({
      matches, media: query, onchange: null,
      addListener: jest.fn(), removeListener: jest.fn(),
      addEventListener: jest.fn(), removeEventListener: jest.fn(), dispatchEvent: jest.fn(),
    }));
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(matches);
    expect(window.matchMedia).toHaveBeenCalledWith(expect.stringContaining('max-width'));
  });
});
