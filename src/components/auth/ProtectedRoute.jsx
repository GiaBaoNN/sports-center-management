import React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Box, Container, Paper, Typography, Button, Stack, Chip } from '@mui/material';
import { Lock as LockIcon, ArrowBack as ArrowBackIcon, Dashboard as DashboardIcon } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const roleDashboardMap = {
  Member: '/member',
  Coach: '/coach',
  Receptionist: '/reception',
  Manager: '/admin',
};

const roleLabelMap = {
  Member: 'Hội Viên (Member)',
  Coach: 'Huấn Luyện Viên (Coach)',
  Receptionist: 'Lễ Tân (Receptionist)',
  Manager: 'Quản Lý (Manager)',
};

export const getRoleHomePath = (role) => roleDashboardMap[role] || '/';

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && Array.isArray(allowedRoles) && !allowedRoles.includes(user?.role)) {
    const userRoleText = roleLabelMap[user?.role] || user?.role || 'Khách';
    const allowedRolesText = allowedRoles.map((r) => roleLabelMap[r] || r).join(', ');
    const myDashboard = getRoleHomePath(user?.role);

    return (
      <Box
        sx={{
          minHeight: 'calc(100vh - 120px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 8,
          px: 2,
          bgcolor: '#F8FAFC',
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, sm: 6 },
              borderRadius: 4,
              border: '1px solid #E2E8F0',
              textAlign: 'center',
              boxShadow: '0 12px 32px rgba(0,0,0,0.06)',
              bgcolor: '#FFFFFF',
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                bgcolor: 'rgba(239, 68, 68, 0.1)',
                color: 'error.main',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2.5,
              }}
            >
              <LockIcon sx={{ fontSize: 32 }} />
            </Box>

            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, color: '#0F172A' }}>
              Quyền Truy Cập Bị Giới Hạn (403 Forbidden)
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>
              Tài khoản của bạn hiện tại có vai trò <strong>{userRoleText}</strong>. Khu vực này chỉ dành riêng cho:{' '}
              <span style={{ color: '#1976D2', fontWeight: 700 }}>{allowedRolesText}</span>.
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                variant="contained"
                color="primary"
                startIcon={<DashboardIcon />}
                onClick={() => navigate(myDashboard)}
                sx={{ fontWeight: 700, py: 1.2 }}
              >
                Về Khu Vực Của Tôi ({user?.role})
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate('/')}
                sx={{ fontWeight: 600, py: 1.2, borderColor: '#CBD5E1' }}
              >
                Về Trang Chủ
              </Button>
            </Stack>
          </Paper>
        </Container>
      </Box>
    );
  }

  return children;
};

export default ProtectedRoute;
