import React from 'react';
import { Row, Col, Card, Statistic, Typography, Divider, Alert, Spin, Button, Space } from 'antd';
import {
  ReadOutlined,
  BookOutlined,
  PieChartOutlined,
  TagsOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import {
  selectLibraryStats,
  selectBooksLoading,
  selectBooksError,
  MAX_BORROW_LIMIT,
} from '../features/books/redux/booksSlice';
import { CategoryStatsCard } from '../features/stats/components/CategoryStatsCard';
import type { Category } from '../features/books/types/book';

const { Title, Paragraph, Text } = Typography;

export const StatsPage: React.FC = () => {
  const navigate = useNavigate();
  const stats = useAppSelector(selectLibraryStats);
  const loading = useAppSelector(selectBooksLoading);
  const error = useAppSelector(selectBooksError);

  const categoryConfig: Record<Category, { color: string }> = {
    'CNTT': { color: '#1677ff' },
    'Kinh tế': { color: '#52c41a' },
    'Ngoại ngữ': { color: '#722ed1' },
  };

  if (loading) {
    return (
      <Card style={{ textAlign: 'center', padding: '60px 0', borderRadius: 8 }}>
        <Spin size="large" tip="Đang tổng hợp dữ liệu thống kê thư viện...">
          <div style={{ minHeight: 80 }} />
        </Spin>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert
        message="Không thể hiển thị thống kê"
        description="Đã xảy ra lỗi khi lấy dữ liệu sách từ hệ thống. Vui lòng quay lại trang thư viện để thử lại."
        type="error"
        showIcon
        action={
          <Button type="primary" onClick={() => navigate('/')}>
            Về trang Thư viện
          </Button>
        }
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <Title level={3} style={{ marginBottom: 4 }}>
            Báo Cáo & Thống Kê Thư Viện
          </Title>
          <Paragraph type="secondary" style={{ marginBottom: 0 }}>
            Dữ liệu được cập nhật theo thời gian thực từ Redux Store.
          </Paragraph>
        </div>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/')}
        >
          Quay lại Thư viện
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={8}>
          <Card
            style={{
              borderRadius: 8,
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              borderLeft: '4px solid #1677ff',
            }}
          >
            <Statistic
              title={
                <Text strong style={{ fontSize: 14 }}>
                  Tổng số đầu sách
                </Text>
              }
              value={stats.totalTitles}
              suffix="đầu sách"
              prefix={<ReadOutlined style={{ color: '#1677ff', marginRight: 8 }} />}
              valueStyle={{ color: '#1677ff', fontWeight: 'bold' }}
            />
            <Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>
              Số bản ghi sách khác nhau trong danh mục
            </Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card
            style={{
              borderRadius: 8,
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              borderLeft: '4px solid #fa8c16',
            }}
          >
            <Statistic
              title={
                <Text strong style={{ fontSize: 14 }}>
                  Tổng sách đang mượn
                </Text>
              }
              value={stats.totalBorrowedCopies}
              suffix={`/ ${MAX_BORROW_LIMIT} cuốn tối đa`}
              prefix={<BookOutlined style={{ color: '#fa8c16', marginRight: 8 }} />}
              valueStyle={{
                color: stats.totalBorrowedCopies >= MAX_BORROW_LIMIT ? '#ff4d4f' : '#fa8c16',
                fontWeight: 'bold',
              }}
            />
            <Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>
              Số cuốn sinh viên hiện đang giữ
            </Text>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card
            style={{
              borderRadius: 8,
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              borderLeft: '4px solid #52c41a',
            }}
          >
            <Statistic
              title={
                <Text strong style={{ fontSize: 14 }}>
                  Số thể loại sách
                </Text>
              }
              value={Object.keys(stats.categoryBreakdown).length}
              suffix="lĩnh vực"
              prefix={<TagsOutlined style={{ color: '#52c41a', marginRight: 8 }} />}
              valueStyle={{ color: '#52c41a', fontWeight: 'bold' }}
            />
            <Text type="secondary" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>
              CNTT, Kinh tế, Ngoại ngữ
            </Text>
          </Card>
        </Col>
      </Row>

      <Divider titlePlacement="start" style={{ margin: '8px 0' }}>
        <Space>
          <PieChartOutlined />
          <span>Phân Bố Đầu Sách Theo Từng Thể Loại</span>
        </Space>
      </Divider>

      <Row gutter={[16, 16]}>
        {(Object.keys(stats.categoryBreakdown) as Category[]).map((category) => (
          <Col xs={24} md={8} key={category}>
            <CategoryStatsCard
              category={category}
              count={stats.categoryBreakdown[category]}
              total={stats.totalTitles}
              color={categoryConfig[category].color}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
};
