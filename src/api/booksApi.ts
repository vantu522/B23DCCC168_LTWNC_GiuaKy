import { MOCK_BOOKS } from '../data/mockBooks';
import type { Book, ApiResponse } from '../types/book';

export const fetchBooksApi = (shouldFail: boolean = false): Promise<ApiResponse<Book[]>> => {
  return new Promise<ApiResponse<Book[]>>((resolve) => {
    setTimeout(() => {
      if (shouldFail) {
        resolve({
          ok: false,
          error: 'Lỗi máy chủ (500 Internal Server Error): Không thể kết nối tới cơ sở dữ liệu sách thư viện!',
          statusCode: 500,
        });
        return;
      }

      const clonedBooks: Book[] = JSON.parse(JSON.stringify(MOCK_BOOKS));
      resolve({
        ok: true,
        data: clonedBooks,
      });
    }, 500);
  });
};

export const getBooksApi = fetchBooksApi;
