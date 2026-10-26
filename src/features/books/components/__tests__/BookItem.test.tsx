import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BookItem } from '../BookItem';
import type { Book } from '../../types/book';

describe('BookItem Component', () => {
  const inStockBook: Book = {
    id: 'b-test-1',
    title: 'Clean Code Practical',
    author: 'Uncle Bob',
    category: 'CNTT',
    publishedYear: 2020,
    availableCopies: 3,
  };

  const outOfStockBook: Book = {
    id: 'b-test-2',
    title: 'Out of Stock Book',
    author: 'Jane Doe',
    category: 'Kinh tế',
    publishedYear: 2021,
    availableCopies: 0,
  };

  it('1. displays correct book information (title, author, year, category, available copies)', () => {
    const onBorrowMock = vi.fn();
    render(
      <BookItem
        book={inStockBook}
        onBorrow={onBorrowMock}
        isMaxBorrowReached={false}
        maxBorrowLimit={3}
      />
    );

    expect(screen.getByTestId('book-title-b-test-1')).toHaveTextContent('Clean Code Practical');
    expect(screen.getByTestId('book-author-b-test-1')).toHaveTextContent('Tác giả: Uncle Bob');
    expect(screen.getByTestId('book-year-b-test-1')).toHaveTextContent('Năm XB: 2020');
    expect(screen.getByText('CNTT')).toBeInTheDocument();
    expect(screen.getByTestId('book-status-b-test-1')).toHaveTextContent('Còn 3 bản');
  });

  it('2. calls onBorrow callback with correct book id when "Mượn" button is clicked', async () => {
    const user = userEvent.setup();
    const onBorrowMock = vi.fn();

    render(
      <BookItem
        book={inStockBook}
        onBorrow={onBorrowMock}
        isMaxBorrowReached={false}
        maxBorrowLimit={3}
      />
    );

    const borrowBtn = screen.getByTestId('borrow-btn-b-test-1');
    expect(borrowBtn).not.toBeDisabled();

    await user.click(borrowBtn);
    expect(onBorrowMock).toHaveBeenCalledTimes(1);
    expect(onBorrowMock).toHaveBeenCalledWith('b-test-1');
  });

  it('3. disables the borrow button and displays "Hết sách" when availableCopies is 0', async () => {
    const user = userEvent.setup();
    const onBorrowMock = vi.fn();

    render(
      <BookItem
        book={outOfStockBook}
        onBorrow={onBorrowMock}
        isMaxBorrowReached={false}
        maxBorrowLimit={3}
      />
    );

    const borrowBtn = screen.getByTestId('borrow-btn-b-test-2');
    expect(borrowBtn).toBeDisabled();
    expect(borrowBtn).toHaveTextContent('Hết sách');
    expect(screen.getByTestId('book-status-b-test-2')).toHaveTextContent('Hết sách');

    await user.click(borrowBtn);
    expect(onBorrowMock).not.toHaveBeenCalled();
  });
});
