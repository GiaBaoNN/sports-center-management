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
  Paper,
} from '@mui/material';
import {
  SportsKabaddi as ClassIcon,
  HowToReg as AttendanceIcon,
  Assignment as PlanIcon,
  People as StudentIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { coachApi, trainingApi } from '../../services/api';

const CoachDashboard = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    Promise.allSettled([coachApi.getMyClasses(), trainingApi.getCoachPlans()])
      .then(([classesRes, plansRes]) => {
        if (!isMounted) return;
        if (classesRes.status === 'fulfilled') setClasses(classesRes.value || []);
        if (plansRes.status === 'fulfilled') setPlans(plansRes.value || []);
      })
      .catch((err) => {
        if (isMounted) setError(err.message || 'Không thể tải dữ liệu HLV.');
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
          background: 'linear-gradient(135deg, #1E1B4B 0%, #0F172A 100%)',
          color: '#FFFFFF',
          mb: 4,
        }}
      >
        <Typography variant="overline" sx={{ color: '#FF8A5B', fontWeight: 800, letterSpacing: '0.1em' }}>
          KHU VỰC HUẤN LUYỆN VIÊN (COACH PORTAL)
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5, mb: 1 }}>
          Chào Thầy {user?.fullName || user?.username}!
        </Typography>
        <Typography variant="body2" sx={{ color: '#94A3B8', maxWidth: 650 }}>
          Quản lý các lớp học được phân công, theo dõi lịch giảng dạy, điểm danh học viên mỗi buổi và xây dựng giáo trình cá nhân hóa.
        </Typography>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none' }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                  LỚP HỌC PHỤ TRÁCH
                </Typography>
                <ClassIcon sx={{ color: '#E0531E' }} />
              </Stack>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#E0531E' }}>
                {classes.length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Lớp đang hoạt động
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card sx={{ borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none' }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                  GIÁO TRÌNH ĐÃ LẬP
                </Typography>
                <PlanIcon sx={{ color: '#7C3AED' }} />
              </Stack>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#7C3AED' }}>
                {plans.length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Kế hoạch rèn luyện cho học viên
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card sx={{ borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none' }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                  ĐIỂM DANH HỌC VIÊN
                </Typography>
                <AttendanceIcon sx={{ color: '#0284C7' }} />
              </Stack>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#0284C7', mt: 0.5 }}>
                Sẵn sàng
              </Typography>
              <Button
                component={RouterLink}
                to="/coach/attendance"
                size="small"
                variant="outlined"
                color="info"
                sx={{ mt: 1, fontWeight: 700, fontSize: '0.75rem' }}
              >
                Vào Điểm Danh Ngay
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Assigned Classes List */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', mb: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Lớp Học Đang Đứng Lớp ({classes.length})
          </Typography>
          <Button component={RouterLink} to="/coach/classes" endIcon={<ArrowForwardIcon />} size="small">
            Xem lịch chi tiết
          </Button>
        </Stack>

        {classes.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Bạn chưa được phân công lớp học nào.
          </Typography>
        ) : (
          <Grid container spacing={2.5}>
            {classes.map((c) => (
              <Grid item xs={12} md={6} key={c.classId}>
                <Box
                  sx={{
                    p: 2.5,
                    bgcolor: '#F8FAFC',
                    borderRadius: 2.5,
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box sx={{ mb: 1.5 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                      <Chip label={c.sport?.name || 'Môn thể thao'} size="small" color="primary" sx={{ fontWeight: 700 }} />
                      <Chip label={c.status || 'Upcoming'} size="small" variant="outlined" />
                    </Stack>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                      {c.className}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Phòng: {c.room?.roomName || 'Phòng tập'}
                    </Typography>
                  </Box>

                  <Stack direction="row" spacing={1.5}>
                    <Button
                      component={RouterLink}
                      to={`/coach/classes?classId=${c.classId}`}
                      size="small"
                      variant="outlined"
                      sx={{ fontWeight: 700 }}
                    >
                      Danh Sách Học Viên
                    </Button>
                    <Button
                      component={RouterLink}
                      to={`/coach/attendance?classId=${c.classId}`}
                      size="small"
                      variant="contained"
                      color="secondary"
                      sx={{ fontWeight: 700 }}
                    >
                      Điểm Danh Buổi Tập
                    </Button>
                  </Stack>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>
    </Box>
  );
};

export default CoachDashboard;
