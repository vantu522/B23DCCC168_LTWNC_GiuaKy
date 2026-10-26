import { createSlice, createAsyncThunk, type PayloadAction, createSelector } from '@reduxjs/toolkit';
import type { Book, BorrowRecord, Category, LibraryStats } from '../types/book';
import { isApiSuccess } from '../types/book';
import { fetchBooksApi } from '../../../api/booksApi';

export const MAX_BORROW_LIMIT = 3;

export interface BooksState {
  books: Book[];
  borrowedBooks: BorrowRecord[];
  loading: boolean;
  error: string | null;
  isSimulatingError: boolean;
}

const initialState: BooksState = {
  books: [],
  borrowedBooks: [],
  loading: true,
  error: null,
  isSimulatingError: false,
};

export const fetchBooksThunk = createAsyncThunk<Book[], boolean | void, { rejectValue: string }>(
  'books/fetchBooks',
  async (shouldFailArg, { rejectWithValue, getState }) => {
    const state = getState() as { books: BooksState };
    const shouldFail = typeof shouldFailArg === 'boolean' ? shouldFailArg : state.books.isSimulatingError;

    const response = await fetchBooksApi(shouldFail);

    if (isApiSuccess(response)) {
      return response.data;
    }

    return rejectWithValue(response.error);
  }
);

export const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    borrowBook: (state, action: PayloadAction<{ bookId: string }>) => {
      if (state.borrowedBooks.length >= MAX_BORROW_LIMIT) {
        return;
      }

      const book = state.books.find((b) => b.id === action.payload.bookId);
      if (!book || book.availableCopies <= 0) {
        return;
      }

      book.availableCopies -= 1;

      const newRecord: BorrowRecord = {
        id: `rec-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        bookId: book.id,
        bookTitle: book.title,
        borrowedAt: new Date().toLocaleString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }),
      };

      state.borrowedBooks.unshift(newRecord);
    },

    returnBook: (state, action: PayloadAction<{ recordId: string }>) => {
      const recordIndex = state.borrowedBooks.findIndex((r) => r.id === action.payload.recordId);
      if (recordIndex === -1) {
        return;
      }

      const record = state.borrowedBooks[recordIndex];
      const book = state.books.find((b) => b.id === record.bookId);
      if (book) {
        book.availableCopies += 1;
      }

      state.borrowedBooks.splice(recordIndex, 1);
    },

    toggleErrorSimulation: (state) => {
      state.isSimulatingError = !state.isSimulatingError;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooksThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooksThunk.fulfilled, (state, action: PayloadAction<Book[]>) => {
        state.loading = false;
        state.books = action.payload;
        state.error = null;
      })
      .addCase(fetchBooksThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Đã xảy ra sự cố khi tải danh sách sách!';
      });
  },
});

export const { borrowBook, returnBook, toggleErrorSimulation } = booksSlice.actions;

export const selectBooks = (state: { books: BooksState }) => state.books.books;
export const selectBorrowedBooks = (state: { books: BooksState }) => state.books.borrowedBooks;
export const selectBooksLoading = (state: { books: BooksState }) => state.books.loading;
export const selectBooksError = (state: { books: BooksState }) => state.books.error;
export const selectIsSimulatingError = (state: { books: BooksState }) => state.books.isSimulatingError;

export const selectLibraryStats = createSelector(
  [selectBooks, selectBorrowedBooks],
  (books, borrowedBooks): LibraryStats => {
    const categoryBreakdown: Record<Category, number> = {
      'CNTT': 0,
      'Kinh tế': 0,
      'Ngoại ngữ': 0,
    };

    books.forEach((book) => {
      if (categoryBreakdown[book.category] !== undefined) {
        categoryBreakdown[book.category] += 1;
      }
    });

    return {
      totalTitles: books.length,
      categoryBreakdown,
      totalBorrowedCopies: borrowedBooks.length,
    };
  }
);

export default booksSlice.reducer;
