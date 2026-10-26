import React from 'react';
import { Layout, Menu, Typography } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { ReadOutlined, BarChartOutlined, BookFilled } from '@ant-design/icons';
import { useTheme } from '../context/ThemeContext';

const { Sider } = Layout;
const { Text } = Typography;

interface AppSidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({ collapsed, onCollapse }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDarkMode } = useTheme();

  const selectedKey = location.pathname === '/stats' ? '/stats' : '/';

  const menuItems = [
    {
      key: '/',
      icon: <ReadOutlined style={{ fontSize: 16 }} />,
      label: 'Thư viện sách',
    },
    {
      key: '/stats',
      icon: <BarChartOutlined style={{ fontSize: 16 }} />,
      label: 'Báo cáo thống kê',
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      breakpoint="lg"
      width={240}
      theme={isDarkMode ? 'dark' : 'light'}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'sticky',
        top: 0,
        left: 0,
        borderRight: `1px solid ${isDarkMode ? '#303030' : '#f0f0f0'}`,
        boxShadow: '1px 0 6px rgba(0,0,0,0.04)',
        zIndex: 100,
      }}
    >
      <div
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          padding: collapsed ? '0' : '0 20px',
          gap: 12,
          borderBottom: `1px solid ${isDarkMode ? '#303030' : '#f0f0f0'}`,
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onClick={() => navigate('/')}
      >
        <div
          style={{
            backgroundColor: '#1677ff',
            color: '#fff',
            borderRadius: 8,
            minWidth: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 20,
            boxShadow: '0 2px 6px rgba(22, 119, 255, 0.35)',
          }}
        >
          <BookFilled />
        </div>

        {!collapsed && (
          <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
            <Text strong style={{ fontSize: 16, display: 'block', lineHeight: 1.2 }}>
              Mini Library
            </Text>
            <Text type="secondary" style={{ fontSize: 11, letterSpacing: 0.5 }}>
              PORTAL ADMIN
            </Text>
          </div>
        )}
      </div>

      <Menu
        theme={isDarkMode ? 'dark' : 'light'}
        mode="inline"
        selectedKeys={[selectedKey]}
        items={menuItems}
        onClick={handleMenuClick}
        style={{ borderRight: 'none', marginTop: 12, padding: '0 8px' }}
      />
    </Sider>
  );
};
