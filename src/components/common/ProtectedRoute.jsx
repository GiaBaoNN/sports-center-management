import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Box, Container, Paper, Typography, Button } from '@mui/material';
import { LockOutlined as LockIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

/**
 * Route Guard kiểm tra trạng thái đăng nhập và phân quyền vai trò (Role-based Authorization)
 */
export const ProtectedRoute = ({ allowedRoles, children }) => {
  const { isAuthenticated, user, roleConfig } = useAuth();
  const location = useLocation();

  // 1. Chưa đăng nhập -> Chuyển hướng về trang Đăng nhập
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Kiểm tra vai trò được phép truy cập
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <Box sx={{ py: 10, bgcolor: 'background.default', minHeight: 'calc(100vh - 80px)' }}>
        <Container maxWidth="sm">
          <Paper
            elevation={0}
            sx={{
              p: 5,
              textAlign: 'center',
              borderRadius: 4,
              border: '1px solid #E2E8F0',
              bgcolor: '#FFFFFF',
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                bgcolor: 'rgba(211, 47, 47, 0.1)',
                color: 'error.main',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <LockIcon sx={{ fontSize: 32 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: 'text.primary' }}>
              Quyền Truy Cập Bị Hạn Chế (403)
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Tài khoản hiện tại của bạn là <strong>{roleConfig?.label}</strong> ({user.fullName}), không có quyền truy cập vào khu vực làm việc này.
            </Typography>
            <Box sx={{ mt: 3, display: 'flex', gap: 1.5, justifyContent: 'center' }}>
              <Button
                component={RouterLink}
                to="/"
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                sx={{ fontWeight: 600 }}
              >
                Về Trang Chủ
              </Button>
              {roleConfig && (
                <Button
                  component={RouterLink}
                  to={roleConfig.dashboardPath}
                  variant="contained"
                  color="primary"
                  sx={{ fontWeight: 700 }}
                >
                  Vào Dashboard Của Bạn
                </Button>
              )}
            </Box>
          </Paper>
        </Container>
      </Box>
    );
  }

  return children;
};

export default ProtectedRoute;
