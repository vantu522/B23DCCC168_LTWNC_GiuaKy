import { configureStore } from '@reduxjs/toolkit';
import booksReducer from '../features/books/redux/booksSlice';
import { borrowLimitMiddleware } from '../features/books/redux/borrowLimitMiddleware';

export const store = configureStore({
  reducer: {
    books: booksReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(borrowLimitMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
