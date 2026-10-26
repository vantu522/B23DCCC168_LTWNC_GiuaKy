import React, { useState } from 'react';
import { Card, Pagination, Empty } from 'antd';
import type { Book } from '../types/book';
import { BookItem } from './BookItem';
import { useAppSelector } from '../../../app/hooks';
import { selectBorrowedBooks, MAX_BORROW_LIMIT } from '../redux/booksSlice';

interface BookTableProps {
  books: Book[];
  onBorrow: (bookId: string) => void;
}

export const BookTable: React.FC<BookTableProps> = ({ books, onBorrow }) => {
  const borrowedBooks = useAppSelector(selectBorrowedBooks);
  const isMaxBorrowReached = borrowedBooks.length >= MAX_BORROW_LIMIT;

  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 6;

  const paginatedBooks = books.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <Card
      style={{
        borderRadius: 8,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}
      bodyStyle={{ padding: 0 }}
    >
      {books.length === 0 ? (
        <div style={{ padding: 32 }}>
          <Empty description="Không tìm thấy cuốn sách nào phù hợp với điều kiện tìm kiếm!" />
        </div>
      ) : (
        <div>
          {paginatedBooks.map((book) => (
            <BookItem
              key={book.id}
              book={book}
              onBorrow={onBorrow}
              isMaxBorrowReached={isMaxBorrowReached}
              maxBorrowLimit={MAX_BORROW_LIMIT}
            />
          ))}

          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px' }}>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={books.length}
              onChange={(page) => setCurrentPage(page)}
              showTotal={(total) => `Tổng cộng ${total} cuốn`}
              size="small"
            />
          </div>
        </div>
      )}
    </Card>
  );
};
