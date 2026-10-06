import { render, screen, fireEvent } from '@testing-library/react';
import CustomPaginator from '../CustomPaginator';

describe('CustomPaginator', () => {
  const props = { sortedData: Array.from({ length: 21 }), page: 1, setPage: jest.fn(), ROWS_PER_PAGE: 10, setRowsPerPage: jest.fn() };
  beforeEach(() => jest.clearAllMocks());

  it('disables previous on the first page and advances to the next page', () => {
    render(<CustomPaginator {...props} />);
    expect(screen.getByText('1 - 10 di 21')).toBeInTheDocument();
    const [previous, next] = screen.getAllByRole('button');
    expect(previous).toBeDisabled();
    fireEvent.click(next);
    expect(props.setPage).toHaveBeenCalledWith(2);
  });
  it('disables next on the last page and goes back', () => {
    render(<CustomPaginator {...props} page={3} />);
    expect(screen.getByText('21 - 21 di 21')).toBeInTheDocument();
    const [previous, next] = screen.getAllByRole('button');
    expect(next).toBeDisabled();
    fireEvent.click(previous);
    expect(props.setPage).toHaveBeenCalledWith(2);
  });
  it('resets the page when changing the page size', () => {
    render(<CustomPaginator {...props} page={2} />);
    fireEvent.mouseDown(screen.getByRole('combobox'));
    fireEvent.click(screen.getByRole('option', { name: '25' }));
    expect(props.setRowsPerPage).toHaveBeenCalledWith(25);
    expect(props.setPage).toHaveBeenCalledWith(1);
  });
});
