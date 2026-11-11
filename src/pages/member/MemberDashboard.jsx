import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Stack,
  CircularProgress,
  Alert,
  Divider,
  Paper,
} from '@mui/material';
import {
  CardMembership as MembershipIcon,
  FitnessCenter as ClassIcon,
  Notifications as NotifIcon,
  Assignment as PlanIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as ActiveIcon,
  HourglassEmpty as PendingIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { membershipApi, classApi, notificationApi, trainingApi } from '../../services/api';

const MemberDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeMembership, setActiveMembership] = useState(null);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [unreadNotifs, setUnreadNotifs] = useState([]);
  const [myPlans, setMyPlans] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    Promise.allSettled([
      membershipApi.getMyActive(),
      classApi.getMyRegistrations(),
      notificationApi.getUnread(),
      trainingApi.getMyPlans(),
    ])
      .then(([activeMemRes, regsRes, notifsRes, plansRes]) => {
        if (!isMounted) return;
        if (activeMemRes.status === 'fulfilled') setActiveMembership(activeMemRes.value || null);
        if (regsRes.status === 'fulfilled') setMyRegistrations(regsRes.value || []);
        if (notifsRes.status === 'fulfilled') setUnreadNotifs(notifsRes.value || []);
        if (plansRes.status === 'fulfilled') setMyPlans(plansRes.value || []);
      })
      .catch((err) => {
        if (isMounted) setError(err.message || 'Không thể tải toàn bộ dữ liệu trang tổng quan.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Welcome Banner */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 4,
          background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
          color: '#FFFFFF',
          mb: 4,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Typography variant="overline" sx={{ color: '#FF8A5B', fontWeight: 800, letterSpacing: '0.1em' }}>
          TRANG THÀNH VIÊN CHÍNH THỨC
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5, mb: 1 }}>
          Xin Chào, {user?.fullName || user?.username}!
        </Typography>
        <Typography variant="body2" sx={{ color: '#94A3B8', maxWidth: 600 }}>
          Theo dõi thẻ hội viên, thời khóa biểu các lớp học thể thao, lịch tập luyện và các thông báo mới nhất từ trung tâm AURA SPORT.
        </Typography>
      </Paper>

      {error && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Quick Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none' }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                  GÓI HỘI VIÊN
                </Typography>
                <MembershipIcon sx={{ color: '#1976D2' }} />
              </Stack>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                {activeMembership ? activeMembership.packageName || activeMembership.packageEntity?.name || 'Gói Đang Tập' : 'Chưa kích hoạt'}
              </Typography>
              <Chip
                icon={activeMembership ? <ActiveIcon /> : <PendingIcon />}
                label={activeMembership ? `Hạn đến ${activeMembership.endDate}` : 'Cần đăng ký'}
                size="small"
                color={activeMembership ? 'success' : 'default'}
                sx={{ mt: 1, fontWeight: 700 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none' }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                  LỚP ĐÃ GHI DANH
                </Typography>
                <ClassIcon sx={{ color: '#E0531E' }} />
              </Stack>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#E0531E' }}>
                {myRegistrations.filter((r) => r.status === 'Registered').length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Lớp học đang có hiệu lực
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none' }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                  KẾ HOẠCH TẬP LUYỆN
                </Typography>
                <PlanIcon sx={{ color: '#7C3AED' }} />
              </Stack>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#7C3AED' }}>
                {myPlans.length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Giáo trình HLV xây dựng
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none' }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                  THÔNG BÁO CHƯA ĐỌC
                </Typography>
                <NotifIcon sx={{ color: '#0284C7' }} />
              </Stack>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#0284C7' }}>
                {unreadNotifs.length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Cần kiểm tra
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content Sections */}
      <Grid container spacing={3}>
        {/* Left: Active Membership & Registered Classes */}
        <Grid item xs={12} md={7}>
          {/* Active Membership Details */}
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', mb: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Thẻ Hội Viên Hiện Tại
              </Typography>
              <Button component={RouterLink} to="/member/memberships" size="small" endIcon={<ArrowForwardIcon />}>
                Lịch sử gói
              </Button>
            </Stack>

            {activeMembership ? (
              <Box sx={{ p: 2.5, bgcolor: '#F8FAFC', borderRadius: 2.5, border: '1px solid #CBD5E1' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1976D2' }}>
                    {activeMembership.packageName || activeMembership.packageEntity?.name || 'Gói Hội Viên'}
                  </Typography>
                  <Chip label="Đang Hoạt Động (Active)" color="success" size="small" sx={{ fontWeight: 700 }} />
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                  Mã thẻ: <strong>#{activeMembership.membershipId}</strong> | Thời hạn: Từ{' '}
                  <strong>{activeMembership.startDate}</strong> đến <strong>{activeMembership.endDate}</strong>
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  Phương thức thanh toán ban đầu: <strong>{activeMembership.paymentMethod || 'Tiền mặt/MoMo'}</strong>
                </Typography>
              </Box>
            ) : (
              <Alert severity="info" action={<Button component={RouterLink} to="/packages" color="inherit" size="small">Xem Gói</Button>}>
                Bạn chưa có gói hội viên đang hoạt động. Hãy đăng ký một gói để bắt đầu sử dụng phòng tập và bể bơi.
              </Alert>
            )}
          </Paper>

          {/* Registered Classes */}
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Lớp Học Đã Đăng Ký
              </Typography>
              <Button component={RouterLink} to="/member/classes" size="small" endIcon={<ArrowForwardIcon />}>
                Xem tất cả
              </Button>
            </Stack>

            {myRegistrations.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Bạn chưa đăng ký lớp học nào. Khám phá ngay lịch học tại mục "Lịch Lớp Học".
              </Typography>
            ) : (
              <Stack spacing={1.5}>
                {myRegistrations.slice(0, 3).map((reg) => (
                  <Box
                    key={reg.registrationId}
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
                        {reg.classEntity?.className || `Lớp học mã #${reg.classId}`}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Đăng ký: {new Date(reg.registrationDate).toLocaleDateString('vi-VN')} | Mã ghi danh: #{reg.registrationId}
                      </Typography>
                    </Box>
                    <Chip
                      label={reg.status === 'Registered' ? 'Đã ghi danh' : reg.status === 'Cancelled' ? 'Đã hủy' : reg.status}
                      size="small"
                      color={reg.status === 'Registered' ? 'primary' : 'default'}
                      sx={{ fontWeight: 700 }}
                    />
                  </Box>
                ))}
              </Stack>
            )}
          </Paper>
        </Grid>

        {/* Right: Notifications & Quick Support */}
        <Grid item xs={12} md={5}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', mb: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Thông Báo Mới Nhất
              </Typography>
              <Button component={RouterLink} to="/member/notifications" size="small">
                Xem hết
              </Button>
            </Stack>

            {unreadNotifs.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Không có thông báo chưa đọc.
              </Typography>
            ) : (
              <Stack spacing={1.5}>
                {unreadNotifs.slice(0, 3).map((notif) => (
                  <Box key={notif.notificationId} sx={{ p: 1.5, bgcolor: 'rgba(25, 118, 210, 0.04)', borderRadius: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      {notif.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
                      {notif.message}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            )}
          </Paper>

          {/* Training Plan Teaser */}
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5 }}>
              Kế Hoạch Huấn Luyện Của Bạn
            </Typography>
            {myPlans.length > 0 ? (
              <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#7C3AED' }}>
                  🎯 Mục tiêu: {myPlans[0].goals}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                  💡 Lời khuyên HLV: {myPlans[0].aiRecommendation || 'Tập luyện chuyên cần'}
                </Typography>
                <Button
                  component={RouterLink}
                  to="/member/training"
                  size="small"
                  sx={{ mt: 1.5, fontWeight: 700 }}
                >
                  Xem chi tiết kết quả
                </Button>
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Chưa có giáo trình riêng. Huấn luyện viên đứng lớp sẽ lập kế hoạch cho bạn khi bắt đầu khóa học.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MemberDashboard;
