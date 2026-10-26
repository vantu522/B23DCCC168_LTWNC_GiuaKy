import React, { useState } from 'react';
import { Layout, Typography } from 'antd';
import { Outlet } from 'react-router-dom';
import { AppSidebar } from '../components/AppSidebar';
import { AppHeader } from '../components/AppHeader';
import { useTheme } from '../context/ThemeContext';

const { Content, Footer } = Layout;
const { Text } = Typography;

export const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const { isDarkMode } = useTheme();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AppSidebar
        collapsed={collapsed}
        onCollapse={(val) => setCollapsed(val)}
      />

      <Layout
        style={{
          backgroundColor: isDarkMode ? '#000000' : '#f5f7fa',
          transition: 'all 0.2s ease',
        }}
      >
        <AppHeader
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
        />

        <Content
          style={{
            margin: '24px',
            padding: 0,
            minHeight: 'calc(100vh - 64px - 70px)',
          }}
        >
          <Outlet />
        </Content>

        <Footer
          style={{
            textAlign: 'center',
            backgroundColor: 'transparent',
            padding: '16px 24px',
            borderTop: `1px solid ${isDarkMode ? '#1f1f1f' : '#eaedf1'}`,
          }}
        >
          <Text type="secondary" style={{ fontSize: 13 }}>
            Mini Library Admin Portal © {new Date().getFullYear()} - Ứng dụng tra cứu & mượn sách thư viện sinh viên
          </Text>
        </Footer>
      </Layout>
    </Layout>
  );
};
