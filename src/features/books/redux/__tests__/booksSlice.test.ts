import { describe, it, expect } from 'vitest';
import booksReducer, {
  borrowBook,
  returnBook,
  toggleErrorSimulation,
  fetchBooksThunk,
  type BooksState,
} from '../booksSlice';
import type { Book } from '../../types/book';

describe('booksSlice reducer', () => {
  const sampleBooks: Book[] = [
    {
      id: 'book-1',
      title: 'React TypeScript',
      author: 'Author A',
      category: 'CNTT',
      publishedYear: 2023,
      availableCopies: 3,
    },
    {
      id: 'book-2',
      title: 'Economics 101',
      author: 'Author B',
      category: 'Kinh tế',
      publishedYear: 2022,
      availableCopies: 0,
    },
  ];

  const initialState: BooksState = {
    books: sampleBooks,
    borrowedBooks: [],
    loading: false,
    error: null,
    isSimulatingError: false,
  };

  it('1. should return initial state when passed an empty action', () => {
    const state = booksReducer(undefined, { type: 'unknown' });
    expect(state.borrowedBooks).toEqual([]);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('2. should handle borrowBook correctly: decrement copies and add to borrowedBooks', () => {
    const nextState = booksReducer(initialState, borrowBook({ bookId: 'book-1' }));
    const updatedBook = nextState.books.find((b) => b.id === 'book-1');

    expect(updatedBook?.availableCopies).toBe(2);
    expect(nextState.borrowedBooks.length).toBe(1);
    expect(nextState.borrowedBooks[0].bookId).toBe('book-1');
  });

  it('3. should handle returnBook correctly: increment copies and remove from borrowedBooks', () => {
    const stateWithBorrow: BooksState = {
      ...initialState,
      books: [{ ...sampleBooks[0], availableCopies: 2 }],
      borrowedBooks: [
        {
          id: 'rec-test-1',
          bookId: 'book-1',
          bookTitle: 'React TypeScript',
          borrowedAt: '2026-10-26 10:00:00',
        },
      ],
    };

    const nextState = booksReducer(stateWithBorrow, returnBook({ recordId: 'rec-test-1' }));
    const returnedBook = nextState.books.find((b) => b.id === 'book-1');

    expect(returnedBook?.availableCopies).toBe(3);
    expect(nextState.borrowedBooks.length).toBe(0);
  });

  it('4. should handle toggleErrorSimulation: toggle boolean flag', () => {
    const nextState = booksReducer(initialState, toggleErrorSimulation());
    expect(nextState.isSimulatingError).toBe(true);

    const toggledBack = booksReducer(nextState, toggleErrorSimulation());
    expect(toggledBack.isSimulatingError).toBe(false);
  });

  it('5. should handle fetchBooksThunk.fulfilled: update books and stop loading', () => {
    const loadingState: BooksState = {
      ...initialState,
      loading: true,
      error: 'Previous error',
    };

    const nextState = booksReducer(
      loadingState,
      fetchBooksThunk.fulfilled(sampleBooks, 'requestId')
    );

    expect(nextState.loading).toBe(false);
    expect(nextState.books).toEqual(sampleBooks);
    expect(nextState.error).toBeNull();
  });
});
