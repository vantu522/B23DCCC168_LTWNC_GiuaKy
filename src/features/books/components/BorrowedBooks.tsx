import React from 'react';
import { Card, List, Button, Tag, Typography, Empty, Space, Progress, Badge, message } from 'antd';
import { UndoOutlined, CheckCircleOutlined, BookOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectBorrowedBooks, returnBook, MAX_BORROW_LIMIT } from '../redux/booksSlice';
import type { BorrowRecord } from '../types/book';

const { Text } = Typography;

export const BorrowedBooks: React.FC = () => {
  const dispatch = useAppDispatch();
  const borrowedBooks = useAppSelector(selectBorrowedBooks);

  const borrowPercent = Math.round((borrowedBooks.length / MAX_BORROW_LIMIT) * 100);

  const handleReturn = (record: BorrowRecord) => {
    dispatch(returnBook({ recordId: record.id }));
    message.success(`Đã trả sách "${record.bookTitle}" thành công!`);
  };

  return (
    <Card
      title={
        <Space size="middle" align="center">
          <BookOutlined style={{ color: '#1677ff' }} />
          <span>Sách đang mượn</span>
          <Badge
            count={`${borrowedBooks.length}/${MAX_BORROW_LIMIT}`}
            style={{
              backgroundColor: borrowedBooks.length >= MAX_BORROW_LIMIT ? '#ff4d4f' : '#52c41a',
            }}
          />
        </Space>
      }
      style={{
        borderRadius: 8,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}
      extra={
        <div style={{ width: 100 }}>
          <Progress
            percent={borrowPercent}
            size="small"
            status={borrowedBooks.length >= MAX_BORROW_LIMIT ? 'exception' : 'normal'}
            format={() => `${borrowedBooks.length}/${MAX_BORROW_LIMIT}`}
          />
        </div>
      }
    >
      {borrowedBooks.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Bạn chưa mượn cuốn sách nào từ thư viện."
        />
      ) : (
        <List<BorrowRecord>
          itemLayout="horizontal"
          dataSource={borrowedBooks}
          renderItem={(record) => (
            <List.Item
              key={record.id}
              actions={[
                <Button
                  key="return"
                  type="default"
                  danger
                  size="small"
                  icon={<UndoOutlined />}
                  onClick={() => handleReturn(record)}
                >
                  Trả sách
                </Button>,
              ]}
            >
              <List.Item.Meta
                avatar={<CheckCircleOutlined style={{ color: '#52c41a', fontSize: 18, marginTop: 4 }} />}
                title={<Text strong>{record.bookTitle}</Text>}
                description={
                  <Space direction="horizontal" size={8}>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Mượn lúc: {record.borrowedAt}
                    </Text>
                    <Tag color="cyan" style={{ fontSize: 11 }}>
                      Mã lượt: {record.id.slice(0, 15)}...
                    </Tag>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      )}
    </Card>
  );
};
