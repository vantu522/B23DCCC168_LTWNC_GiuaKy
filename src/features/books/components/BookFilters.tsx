import React from 'react';
import { Input, Select, Space, Card, Switch, Tooltip, Tag, Button, message } from 'antd';
import { SearchOutlined, FilterOutlined, BugOutlined, ReloadOutlined } from '@ant-design/icons';
import type { Category } from '../types/book';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectIsSimulatingError, toggleErrorSimulation, fetchBooksThunk } from '../redux/booksSlice';
import { useFilterStore } from '../store/useFilterStore';

interface BookFiltersProps {
  filteredCount: number;
  totalCount: number;
}

export const BookFilters: React.FC<BookFiltersProps> = ({ filteredCount, totalCount }) => {
  const dispatch = useAppDispatch();
  const isSimulatingError = useAppSelector(selectIsSimulatingError);

  const { searchTerm, selectedCategory, setSearchTerm, setSelectedCategory } = useFilterStore();

  const handleToggleError = () => {
    dispatch(toggleErrorSimulation());
    if (!isSimulatingError) {
      message.info('Đã BẬT mô phỏng lỗi API (nhấn Tải lại để kiểm tra giao diện lỗi 500).');
    } else {
      message.info('Đã TẮT mô phỏng lỗi API (hoạt động bình thường).');
    }
  };

  const handleReload = () => {
    dispatch(fetchBooksThunk());
  };

  return (
    <Card
      size="small"
      style={{ marginBottom: 16, borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Space wrap direction="horizontal" style={{ flex: 1, minWidth: 280 }}>
          <Input
            placeholder="Tìm theo tên sách hoặc tác giả..."
            prefix={<SearchOutlined style={{ color: '#8c8c8c' }} />}
            allowClear
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 280 }}
          />

          <Select<Category | 'All'>
            value={selectedCategory}
            onChange={(val) => setSelectedCategory(val)}
            style={{ width: 170 }}
            suffixIcon={<FilterOutlined style={{ color: '#8c8c8c' }} />}
            options={[
              { value: 'All', label: 'Tất cả thể loại' },
              { value: 'CNTT', label: 'CNTT' },
              { value: 'Kinh tế', label: 'Kinh tế' },
              { value: 'Ngoại ngữ', label: 'Ngoại ngữ' },
            ]}
          />

          <Tag color="blue" style={{ fontSize: 13, padding: '2px 8px' }}>
            Hiển thị: <strong>{filteredCount}</strong> / {totalCount} cuốn
          </Tag>
        </Space>

        <Space size="middle">
          <Tooltip title="Bật tùy chọn này để giả lập lỗi API (500) khi tải lại dữ liệu">
            <Space size={6} style={{ cursor: 'pointer' }}>
              <BugOutlined style={{ color: isSimulatingError ? '#ff4d4f' : '#8c8c8c' }} />
              <span style={{ fontSize: 13 }}>Mô phỏng lỗi API:</span>
              <Switch checked={isSimulatingError} onChange={handleToggleError} size="small" />
            </Space>
          </Tooltip>

          <Button
            size="small"
            icon={<ReloadOutlined />}
            onClick={handleReload}
          >
            Tải lại API
          </Button>
        </Space>
      </div>
    </Card>
  );
};
