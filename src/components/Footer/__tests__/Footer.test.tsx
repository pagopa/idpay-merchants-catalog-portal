import { fireEvent, render, screen } from '@testing-library/react';
import { Footer } from '../Footer';
import { appConfig } from '../../../config/app';

describe('Footer', () => {
  afterEach(() => jest.restoreAllMocks());

  it('opens each institutional link and focuses the new window', () => {
    const focus = jest.fn();
    const open = jest.spyOn(window, 'open').mockReturnValue({ focus } as unknown as Window);
    render(<Footer />);
    const links = [
      ['PagoPA SPA', 'https://www.pagopa.it/it/'],
      ['Informativa Privacy', appConfig.usersPortalLinks.privacy],
      ['Diritto alla protezione dei dati personali', 'https://privacyportal-de.onetrust.com/webform/77f17844-04c3-4969-a11d-462ee77acbe1/9ab6533d-be4a-482e-929a-0d8d2ab29df8'],
      ["Termini e condizioni d'uso", appConfig.usersPortalLinks.terms],
      ['Accessibilità', 'https://form.agid.gov.it/view/9b5c6ed0-bbbb-11f0-a7e5-9bac06d781c9'],
    ];
    for (const [name, url] of links) {
      fireEvent.click(screen.getByRole('link', { name }));
      expect(open).toHaveBeenLastCalledWith(url, '_blank');
    }
    expect(focus).toHaveBeenCalledTimes(links.length);
  });

  it('handles a blocked popup', () => {
    jest.spyOn(window, 'open').mockReturnValue(null);
    render(<Footer />);
    fireEvent.click(screen.getByRole('link', { name: 'Informativa Privacy' }));
    expect(window.open).toHaveBeenCalledWith(appConfig.usersPortalLinks.privacy, '_blank');
  });
});
