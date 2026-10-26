import type { Middleware } from '@reduxjs/toolkit';
import { message } from 'antd';
import { borrowBook, MAX_BORROW_LIMIT, type BooksState } from './booksSlice';
import type { Book } from '../types/book';

export const borrowLimitMiddleware: Middleware<{}, { books: BooksState }> =
  (storeApi) => (next) => (action) => {
    if (borrowBook.match(action)) {
      const state = storeApi.getState();
      const currentBorrowedCount = state.books.borrowedBooks.length;

      if (currentBorrowedCount >= MAX_BORROW_LIMIT) {
        message.warning(
          `Mỗi sinh viên chỉ được mượn tối đa ${MAX_BORROW_LIMIT} cuốn cùng lúc! Vui lòng trả bớt sách trước khi mượn thêm.`
        );
        return;
      }

      const targetBook = state.books.books.find((b: Book) => b.id === action.payload.bookId);
      if (!targetBook || targetBook.availableCopies <= 0) {
        message.error(`Sách "${targetBook?.title ?? ''}" hiện đã hết bản in, không thể mượn!`);
        return;
      }

      const result = next(action);
      message.success(`Mượn sách "${targetBook.title}" thành công!`);
      return result;
    }

    return next(action);
  };
