import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, theme, Spin } from 'antd';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { MainLayout } from './layouts/MainLayout';
import { LibraryPage } from './pages/LibraryPage';
import './styles/global.css';

const StatsPage = React.lazy(() =>
  import('./pages/StatsPage').then((module) => ({ default: module.StatsPage }))
);

const AppContent: React.FC = () => {
  const { isDarkMode } = useTheme();

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 6,
        },
      }}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<LibraryPage />} />
            <Route
              path="stats"
              element={
                <Suspense
                  fallback={
                    <div style={{ textAlign: 'center', padding: '60px 0' }}>
                      <Spin size="large" tip="Đang tải trang thống kê..." />
                    </div>
                  }
                >
                  <StatsPage />
                </Suspense>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </Provider>
  );
}
