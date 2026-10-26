export type Category = 'CNTT' | 'Kinh tế' | 'Ngoại ngữ';

export const CATEGORIES: readonly Category[] = ['CNTT', 'Kinh tế', 'Ngoại ngữ'] as const;

export interface Book {
  id: string;
  title: string;
  author: string;
  category: Category;
  publishedYear: number;
  availableCopies: number;
}

export interface BorrowRecord {
  id: string;
  bookId: string;
  bookTitle: string;
  borrowedAt: string;
}

export interface ApiSuccessResponse<T> {
  readonly ok: true;
  readonly data: T;
}

export interface ApiErrorResponse {
  readonly ok: false;
  readonly error: string;
  readonly statusCode?: number;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export function isApiSuccess<T>(response: ApiResponse<T>): response is ApiSuccessResponse<T> {
  return response.ok === true;
}

export function isApiError<T>(response: ApiResponse<T>): response is ApiErrorResponse {
  return response.ok === false;
}

export type CategoryCountMap = Record<Category, number>;

export type ImmutableBookList = Readonly<Book[]>;

export type BorrowPayload = Omit<BorrowRecord, 'id' | 'borrowedAt'>;

export type BookSummary = Pick<Book, 'id' | 'title' | 'author' | 'category'>;

export interface BookFilterParams {
  searchTerm?: string;
  category?: Category | 'All';
}

export interface LibraryStats {
  totalTitles: number;
  categoryBreakdown: CategoryCountMap;
  totalBorrowedCopies: number;
}
