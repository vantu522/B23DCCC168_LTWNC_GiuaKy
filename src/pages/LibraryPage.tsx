import React, { useMemo, useEffect, useCallback } from 'react';
import { Spin, Alert, Button, Typography, Row, Col, Card, Space } from 'antd';
import { ReloadOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import {
  selectBooks,
  selectBooksLoading,
  selectBooksError,
  selectIsSimulatingError,
  fetchBooksThunk,
  borrowBook,
  toggleErrorSimulation,
} from '../features/books/redux/booksSlice';
import { useDebounce } from '../hooks/useDebounce';
import { useFilterStore } from '../features/books/store/useFilterStore';
import { BookFilters } from '../features/books/components/BookFilters';
import { BookTable } from '../features/books/components/BookTable';
import { BorrowedBooks } from '../features/books/components/BorrowedBooks';

const { Title, Paragraph } = Typography;

export const LibraryPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const books = useAppSelector(selectBooks);
  const loading = useAppSelector(selectBooksLoading);
  const error = useAppSelector(selectBooksError);
  const isSimulatingError = useAppSelector(selectIsSimulatingError);

  const { searchTerm, selectedCategory } = useFilterStore();
  const debouncedSearchTerm = useDebounce<string>(searchTerm, 300);

  useEffect(() => {
    if (books.length === 0 && loading) {
      dispatch(fetchBooksThunk());
    }
  }, [dispatch, books.length, loading]);

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const cleanKeyword = debouncedSearchTerm.trim().toLowerCase();
      const matchesSearch =
        cleanKeyword === '' ||
        book.title.toLowerCase().includes(cleanKeyword) ||
        book.author.toLowerCase().includes(cleanKeyword);

      const matchesCategory =
        selectedCategory === 'All' || book.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [books, debouncedSearchTerm, selectedCategory]);

  const handleBorrow = useCallback(
    (bookId: string) => {
      dispatch(borrowBook({ bookId }));
    },
    [dispatch]
  );

  const handleRetryWithoutError = () => {
    if (isSimulatingError) {
      dispatch(toggleErrorSimulation());
    }
    dispatch(fetchBooksThunk(false));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <Title level={3} style={{ marginBottom: 4 }}>
          Tra Cứu & Quản Lý Sách Thư Viện
        </Title>
        <Paragraph type="secondary" style={{ marginBottom: 0 }}>
          Hệ thống mượn sách trực tuyến dành cho sinh viên.
        </Paragraph>
      </div>

      {loading && (
        <Card style={{ textAlign: 'center', padding: '60px 0', borderRadius: 8 }}>
          <Spin size="large" tip="Đang tải danh sách sách từ hệ thống...">
            <div style={{ minHeight: 80 }} />
          </Spin>
        </Card>
      )}

      {!loading && error && (
        <Alert
          message="Lỗi khi tải dữ liệu sách"
          description={
            <div style={{ marginTop: 4 }}>
              <div>{error}</div>
              {isSimulatingError && (
                <div style={{ marginTop: 8, fontSize: 13, color: '#fa8c16' }}>
                  Bạn đang bật chế độ <strong>Mô phỏng lỗi API</strong>. Nhấn <strong>"Tắt mô phỏng & Thử lại"</strong> để tải lại dữ liệu bình thường.
                </div>
              )}
            </div>
          }
          type="error"
          showIcon
          action={
            <Space size="small">
              {isSimulatingError ? (
                <Button
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  onClick={handleRetryWithoutError}
                >
                  Tắt mô phỏng & Thử lại
                </Button>
              ) : (
                <Button
                  type="primary"
                  danger
                  icon={<ReloadOutlined />}
                  onClick={() => dispatch(fetchBooksThunk())}
                >
                  Thử lại
                </Button>
              )}
            </Space>
          }
          style={{ borderRadius: 8 }}
        />
      )}

      {!loading && !error && (
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <BookFilters filteredCount={filteredBooks.length} totalCount={books.length} />
              <BookTable books={filteredBooks} onBorrow={handleBorrow} />
            </div>
          </Col>

          <Col xs={24} lg={8} id="borrowed-books-section">
            <BorrowedBooks />
          </Col>
        </Row>
      )}
    </div>
  );
};
