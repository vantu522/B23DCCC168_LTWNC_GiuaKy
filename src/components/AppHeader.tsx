import React from 'react';
import { Layout, Button, Space, Typography, Breadcrumb, Avatar, Tooltip } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SunOutlined,
  MoonOutlined,
  UserOutlined,
  BookOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { useTheme } from '../context/ThemeContext';
import { useAppSelector } from '../app/hooks';
import { selectBorrowedBooks, MAX_BORROW_LIMIT } from '../features/books/redux/booksSlice';

const { Header } = Layout;
const { Text } = Typography;

interface AppHeaderProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ collapsed, onToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const borrowedBooks = useAppSelector(selectBorrowedBooks);

  const isStats = location.pathname === '/stats';

  return (
    <Header
      style={{
        padding: '0 24px',
        background: isDarkMode ? '#141414' : '#ffffff',
        borderBottom: `1px solid ${isDarkMode ? '#303030' : '#f0f0f0'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 99,
        height: 64,
        boxShadow: '0 1px 4px rgba(0, 21, 41, 0.04)',
      }}
    >
      <Space size="middle" align="center">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onToggle}
          style={{
            fontSize: '16px',
            width: 40,
            height: 40,
          }}
        />

        <Breadcrumb
          items={[
            {
              title: (
                <Space size={4} style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
                  <HomeOutlined />
                  <span>Trang chủ</span>
                </Space>
              ),
            },
            {
              title: isStats ? 'Báo cáo & Thống kê' : 'Quản lý thư viện',
            },
          ]}
        />
      </Space>

      <Space size="middle" align="center">
        <Tooltip title={`Sinh viên hiện đang mượn ${borrowedBooks.length} trong tối đa ${MAX_BORROW_LIMIT} cuốn`}>
          <div
            onClick={() => {
              if (location.pathname !== '/') navigate('/');
              setTimeout(() => {
                document.getElementById('borrowed-books-section')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '4px 12px',
              borderRadius: 20,
              backgroundColor: isDarkMode ? '#1f1f1f' : '#f5f5f5',
              border: `1px solid ${isDarkMode ? '#303030' : '#e8e8e8'}`,
            }}
          >
            <BookOutlined style={{ color: '#1677ff' }} />
            <Text style={{ fontSize: 13 }}>
              Đang mượn: <strong style={{ color: borrowedBooks.length >= MAX_BORROW_LIMIT ? '#ff4d4f' : '#1677ff' }}>
                {borrowedBooks.length}/{MAX_BORROW_LIMIT}
              </strong>
            </Text>
          </div>
        </Tooltip>

        <Tooltip title={isDarkMode ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối'}>
          <Button
            type="text"
            shape="circle"
            icon={isDarkMode ? <SunOutlined style={{ color: '#faad14', fontSize: 17 }} /> : <MoonOutlined style={{ fontSize: 17 }} />}
            onClick={toggleTheme}
          />
        </Tooltip>

        <Space size={8} style={{ borderLeft: `1px solid ${isDarkMode ? '#303030' : '#f0f0f0'}`, paddingLeft: 16 }}>
          <Avatar
            style={{ backgroundColor: '#1677ff', verticalAlign: 'middle' }}
            icon={<UserOutlined />}
            size="small"
          />
          <div style={{ lineHeight: 1.2, display: 'inline-block' }}>
            <Text strong style={{ fontSize: 13, display: 'block' }}>
              Sinh viên
            </Text>
            <Text type="secondary" style={{ fontSize: 11 }}>
              ID: SV2026-IT
            </Text>
          </div>
        </Space>
      </Space>
    </Header>
  );
};
