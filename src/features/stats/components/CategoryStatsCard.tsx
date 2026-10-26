import React from 'react';
import { Card, Progress, Typography, Space, Tag } from 'antd';
import type { Category } from '../../books/types/book';

const { Text } = Typography;

interface CategoryStatsCardProps {
  category: Category;
  count: number;
  total: number;
  color: string;
}

export const CategoryStatsCard: React.FC<CategoryStatsCardProps> = ({
  category,
  count,
  total,
  color,
}) => {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <Card
      size="small"
      style={{
        borderRadius: 8,
        borderTop: `3px solid ${color}`,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <Space>
          <Tag color={color} style={{ fontWeight: 600 }}>
            {category}
          </Tag>
        </Space>
        <Text strong style={{ fontSize: 16 }}>
          {count} <span style={{ fontSize: 12, color: '#8c8c8c' }}>đầu sách</span>
        </Text>
      </div>

      <Progress
        percent={percentage}
        strokeColor={color}
        size={['100%', 10]}
        format={(pct) => `${pct}%`}
      />
      <div style={{ marginTop: 6, textAlign: 'right' }}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          Chiếm {percentage}% trong tổng {total} đầu sách
        </Text>
      </div>
    </Card>
  );
};
