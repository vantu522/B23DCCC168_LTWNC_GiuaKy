import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { message } from 'antd';
import type { Book, BorrowRecord, Category, LibraryStats } from '../features/books/types/book';
import { isApiSuccess } from '../features/books/types/book';
import { fetchBooksApi } from '../api/booksApi';

export const MAX_BORROW_LIMIT = 3;

interface LibraryContextType {
  books: Book[];
  borrowedBooks: BorrowRecord[];
  loading: boolean;
  error: string | null;
  isSimulatingError: boolean;
  fetchBooks: () => Promise<void>;
  borrowBook: (bookId: string) => boolean;
  returnBook: (recordId: string) => void;
  toggleErrorSimulation: () => void;
  stats: LibraryStats;
  maxBorrowLimit: number;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSimulatingError, setIsSimulatingError] = useState<boolean>(false);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchBooksApi(isSimulatingError);
      if (isApiSuccess(response)) {
        setBooks(response.data);
      } else {
        setError(response.error);
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Error';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  }, [isSimulatingError]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const borrowBook = useCallback((bookId: string): boolean => {
    if (borrowedBooks.length >= MAX_BORROW_LIMIT) {
      message.warning(`Mỗi sinh viên chỉ được mượn tối đa ${MAX_BORROW_LIMIT} cuốn cùng lúc! Vui lòng trả bớt sách trước khi mượn thêm.`);
      return false;
    }

    const targetBook = books.find((b) => b.id === bookId);
    if (!targetBook) {
      message.error('Không tìm thấy thông tin sách!');
      return false;
    }

    if (targetBook.availableCopies <= 0) {
      message.error(`Sách "${targetBook.title}" đã hết, không thể mượn!`);
      return false;
    }

    setBooks((prev) =>
      prev.map((item) =>
        item.id === bookId ? { ...item, availableCopies: item.availableCopies - 1 } : item
      )
    );

    const newRecord: BorrowRecord = {
      id: `record-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      bookId: targetBook.id,
      bookTitle: targetBook.title,
      borrowedAt: new Date().toLocaleString('vi-VN'),
    };

    setBorrowedBooks((prev) => [newRecord, ...prev]);
    message.success(`Mượn sách "${targetBook.title}" thành công!`);
    return true;
  }, [books, borrowedBooks.length]);

  const returnBook = useCallback((recordId: string): void => {
    const record = borrowedBooks.find((r) => r.id === recordId);
    if (!record) {
      message.error('Lượt mượn này không tồn tại hoặc đã được trả trước đó!');
      return;
    }

    setBorrowedBooks((prev) => prev.filter((r) => r.id !== recordId));
    setBooks((prev) =>
      prev.map((item) =>
        item.id === record.bookId ? { ...item, availableCopies: item.availableCopies + 1 } : item
      )
    );

    message.success(`Đã trả sách "${record.bookTitle}" thành công!`);
  }, [borrowedBooks]);

  const toggleErrorSimulation = useCallback(() => {
    setIsSimulatingError((prev) => {
      const nextState = !prev;
      if (nextState) {
        message.info('Đã BẬT mô phỏng lỗi API (lần tải tiếp theo sẽ trả về lỗi 500).');
      } else {
        message.info('Đã TẮT mô phỏng lỗi API (hệ thống hoạt động bình thường).');
      }
      return nextState;
    });
  }, []);

  const stats: LibraryStats = useMemo(() => {
    const categoryBreakdown: Record<Category, number> = {
      'CNTT': 0,
      'Kinh tế': 0,
      'Ngoại ngữ': 0,
    };
    books.forEach((b) => {
      if (categoryBreakdown[b.category] !== undefined) {
        categoryBreakdown[b.category] += 1;
      }
    });

    return {
      totalTitles: books.length,
      categoryBreakdown,
      totalBorrowedCopies: borrowedBooks.length,
    };
  }, [books, borrowedBooks]);

  return (
    <LibraryContext.Provider
      value={{
        books,
        borrowedBooks,
        loading,
        error,
        isSimulatingError,
        fetchBooks,
        borrowBook,
        returnBook,
        toggleErrorSimulation,
        stats,
        maxBorrowLimit: MAX_BORROW_LIMIT,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = (): LibraryContextType => {
  const context = useContext(LibraryContext);
  if (!context) throw new Error('useLibrary must be used within LibraryProvider');
  return context;
};
