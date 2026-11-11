import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  Chip,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import {
  PeopleAlt as UsersIcon,
  CardMembership as MembershipIcon,
  AttachMoney as RevenueIcon,
  FitnessCenter as ClassIcon,
  AppRegistration as RegIcon,
  TrendingUp as TrendingIcon,
} from '@mui/icons-material';
import { adminApi } from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi
      .getDashboardStats()
      .then((data) => {
        setStats(data);
      })
      .catch((err) => {
        setError(err.message || 'Không thể tải báo cáo thống kê quản lý.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Banner */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 4,
          background: 'linear-gradient(135deg, #312E81 0%, #0F172A 100%)',
          color: '#FFFFFF',
          mb: 4,
        }}
      >
        <Typography variant="overline" sx={{ color: '#A5B4FC', fontWeight: 800, letterSpacing: '0.1em' }}>
          TRUNG TÂM ĐIỀU HÀNH & BÁO CÁO TỔNG QUAN (MANAGER)
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5, mb: 1 }}>
          Bảng Thống Kê Hoạt Động AURA SPORT
        </Typography>
        <Typography variant="body2" sx={{ color: '#CBD5E1', maxWidth: 650 }}>
          Dữ liệu thống kê thời gian thực từ cơ sở dữ liệu SCMS: hội viên, doanh thu thực tế, số lượng lớp học và tỷ lệ đăng ký.
        </Typography>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Primary KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none' }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                  DOANH THU ĐÃ THU
                </Typography>
                <RevenueIcon sx={{ color: '#16A34A' }} />
              </Stack>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#16A34A' }}>
                {Number(stats?.totalRevenue || 0).toLocaleString('vi-VN')} đ
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Doanh thu gói tập đã xác nhận
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none' }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                  HỘI VIÊN ACTIVE
                </Typography>
                <MembershipIcon sx={{ color: '#1976D2' }} />
              </Stack>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#1976D2' }}>
                {stats?.activeMembers || 0}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Thẻ tập đang có hiệu lực
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none' }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                  TỔNG LỚP HỌC
                </Typography>
                <ClassIcon sx={{ color: '#E0531E' }} />
              </Stack>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#E0531E' }}>
                {stats?.totalClasses || 0}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {stats?.upcomingClasses || 0} lớp sắp diễn ra
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none' }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                  LƯỢT GHI DANH LỚP
                </Typography>
                <RegIcon sx={{ color: '#7C3AED' }} />
              </Stack>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#7C3AED' }}>
                {stats?.totalRegistrations || 0}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Lượt học viên tham gia
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Breakdown Breakdown Sections */}
      <Grid container spacing={3}>
        {/* Users by Role Breakdown */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <UsersIcon color="primary" /> Phân Bố Tài Khoản Theo Vai Trò (Role)
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Tổng số tài khoản trong CSDL: <strong>{stats?.totalUsers || 0}</strong> tài khoản
            </Typography>

            <Stack spacing={2}>
              {stats?.membersByRole &&
                Object.entries(stats.membersByRole).map(([role, count]) => (
                  <Box
                    key={role}
                    sx={{
                      p: 2,
                      bgcolor: '#F8FAFC',
                      borderRadius: 2,
                      border: '1px solid #E2E8F0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        {role === 'Manager'
                          ? 'Quản lý (Manager)'
                          : role === 'Coach'
                          ? 'Huấn luyện viên (Coach)'
                          : role === 'Receptionist'
                          ? 'Lễ tân (Receptionist)'
                          : 'Hội viên (Member)'}
                      </Typography>
                    </Box>
                    <Chip label={`${count} tài khoản`} color="primary" size="small" sx={{ fontWeight: 800 }} />
                  </Box>
                ))}
            </Stack>
          </Paper>
        </Grid>

        {/* Memberships by Package Breakdown */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrendingIcon color="secondary" /> Thẻ Hội Viên Theo Gói Dịch Vụ
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Tỷ lệ học viên lựa chọn các gói 30 ngày (Basic), 90 ngày (Premium) và 365 ngày (Annual).
            </Typography>

            <Stack spacing={2}>
              {stats?.membershipsByPackage &&
                Object.entries(stats.membershipsByPackage).map(([pkgName, count]) => (
                  <Box
                    key={pkgName}
                    sx={{
                      p: 2,
                      bgcolor: '#F8FAFC',
                      borderRadius: 2,
                      border: '1px solid #E2E8F0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      Gói {pkgName}
                    </Typography>
                    <Chip label={`${count} thẻ`} color="secondary" size="small" sx={{ fontWeight: 800 }} />
                  </Box>
                ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
