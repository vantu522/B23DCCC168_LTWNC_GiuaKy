import React from 'react';
import { Tag, Button, Typography, Space, Tooltip } from 'antd';
import { BookOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import type { Book, Category } from '../types/book';

const { Text } = Typography;

const CATEGORY_COLORS: Record<Category, string> = {
  'CNTT': 'blue',
  'Kinh tế': 'green',
  'Ngoại ngữ': 'purple',
};

export interface BookItemProps {
  book: Book;
  onBorrow: (bookId: string) => void;
  isMaxBorrowReached: boolean;
  maxBorrowLimit: number;
}

export const BookItem: React.FC<BookItemProps> = React.memo(
  ({ book, onBorrow, isMaxBorrowReached, maxBorrowLimit }) => {
    const isOutOfStock = book.availableCopies <= 0;

    let tooltipTitle = 'Nhấn để mượn cuốn sách này';
    if (isOutOfStock) {
      tooltipTitle = 'Sách này hiện đã hết bản in trong thư viện';
    } else if (isMaxBorrowReached) {
      tooltipTitle = `Bạn đã mượn tối đa ${maxBorrowLimit} cuốn! Cần trả sách trước khi mượn tiếp`;
    }

    return (
      <div
        data-testid={`book-item-${book.id}`}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 16px',
          borderBottom: '1px solid #f0f0f0',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ flex: 1, minWidth: 200 }}>
          <Space size={8} style={{ marginBottom: 4 }}>
            <BookOutlined style={{ color: '#1677ff' }} />
            <Text strong data-testid={`book-title-${book.id}`}>
              {book.title}
            </Text>
            <Tag color={CATEGORY_COLORS[book.category]}>{book.category}</Tag>
          </Space>
          <div>
            <Text type="secondary" style={{ fontSize: 13, marginRight: 12 }} data-testid={`book-author-${book.id}`}>
              Tác giả: {book.author}
            </Text>
            <Text type="secondary" style={{ fontSize: 13 }} data-testid={`book-year-${book.id}`}>
              Năm XB: {book.publishedYear}
            </Text>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {isOutOfStock ? (
            <Tag icon={<CloseCircleOutlined />} color="error" data-testid={`book-status-${book.id}`}>
              Hết sách
            </Tag>
          ) : (
            <Tag
              icon={<CheckCircleOutlined />}
              color={book.availableCopies > 2 ? 'success' : 'warning'}
              data-testid={`book-status-${book.id}`}
            >
              Còn {book.availableCopies} bản
            </Tag>
          )}

          <Tooltip title={tooltipTitle}>
            <span>
              <Button
                type="primary"
                size="small"
                disabled={isOutOfStock}
                onClick={() => onBorrow(book.id)}
                icon={<BookOutlined />}
                data-testid={`borrow-btn-${book.id}`}
              >
                {isOutOfStock ? 'Hết sách' : 'Mượn'}
              </Button>
            </span>
          </Tooltip>
        </div>
      </div>
    );
  }
);
