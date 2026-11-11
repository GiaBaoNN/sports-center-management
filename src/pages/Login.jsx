import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  IconButton,
  Divider,
  Alert,
  Stack,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Phone as PhoneIcon,
  Lock as LockIcon,
  FitnessCenter as FitnessCenterIcon,
  Google as GoogleIcon,
  Facebook as FacebookIcon,
  Apple as AppleIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    rememberMe: true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    if (error) setError('');
  };

  const handleQuickLogin = (phone, pass) => {
    setFormData({
      ...formData,
      phone: phone,
      password: pass,
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const phoneClean = formData.phone.trim();
    if (!phoneClean || !formData.password) {
      setError('Vui lòng nhập đầy đủ Số điện thoại và Mật khẩu.');
      return;
    }

    const phoneRegex = /^\d{10,11}$/;
    if (!phoneRegex.test(phoneClean)) {
      setError('Số điện thoại phải từ 10 - 11 chữ số (ví dụ: 0901000005).');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await login({
        phone: phoneClean,
        password: formData.password,
      });

      const user = res.data;
      const roleText =
        user?.role === 'Manager'
          ? 'Quản lý'
          : user?.role === 'Coach'
          ? 'Huấn luyện viên'
          : user?.role === 'Receptionist'
          ? 'Lễ tân'
          : 'Hội viên';
      setSuccessMsg(`Đăng nhập thành công! Chào mừng ${user?.fullName || ''} (${roleText}).`);

      const roleHomeMap = {
        Manager: '/admin',
        Coach: '/coach',
        Receptionist: '/reception',
        Member: '/member',
      };

      const defaultHome = roleHomeMap[user?.role] || '/';
      const returnUrl = location.state?.from?.pathname || location.state?.from || defaultHome;

      setTimeout(() => {
        navigate(returnUrl);
      }, 1000);
    } catch (err) {
      setError(err.message || 'Đăng nhập không thành công. Vui lòng kiểm tra lại số điện thoại hoặc mật khẩu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: 'calc(100vh - 80px)', display: 'flex', bgcolor: '#F8FAFC' }}>
      <Grid container sx={{ minHeight: '100%' }}>
        {/* Left Side: Gym Hero Image & Motivational Quotes */}
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{
            display: { xs: 'none', md: 'flex' },
            position: 'relative',
            backgroundImage: 'url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            alignItems: 'flex-end',
            p: 6,
          }}
        >
          {/* Dark gradient overlay */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.4) 0%, rgba(15, 23, 42, 0.95) 100%)',
            }}
          />

          <Box sx={{ position: 'relative', zIndex: 1, color: '#FFFFFF' }}>
            <Box
              sx={{
                width: 50,
                height: 50,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #1976D2 0%, #FF6B35 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3,
              }}
            >
              <FitnessCenterIcon sx={{ fontSize: 30 }} />
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 900, mb: 2, lineHeight: 1.2 }}>
              Khơi Dậy Năng Lượng, <br />
              Chinh Phục Thể Lực Mới.
            </Typography>
            <Typography variant="body1" sx={{ color: '#CBD5E1', maxWidth: 480, lineHeight: 1.7, mb: 4 }}>
              "Hành trình một ngàn dặm bắt đầu từ một bước chân. Đừng chờ đợi ngày mai để bắt đầu chăm sóc cơ thể của chính bạn."
            </Typography>

            <Stack direction="row" spacing={3}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: 'secondary.main' }}>
                  5.000+
                </Typography>
                <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                  Hội viên hoạt động
                </Typography>
              </Box>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: 'primary.light' }}>
                  120+
                </Typography>
                <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                  Lớp học mỗi tuần
                </Typography>
              </Box>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800, color: 'success.light' }}>
                  100%
                </Typography>
                <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                  Máy tập Technogym
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Grid>

        {/* Right Side: Login Form */}
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            p: { xs: 3, sm: 6, md: 8, lg: 10 },
            bgcolor: '#FFFFFF',
          }}
        >
          <Box sx={{ maxWidth: 460, width: '100%', mx: 'auto' }}>
            <Box sx={{ mb: 4 }}>
              <Chip
                label="CỔNG ĐĂNG NHẬP HỆ THỐNG"
                size="small"
                sx={{
                  bgcolor: 'rgba(25, 118, 210, 0.1)',
                  color: 'primary.main',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  mb: 1.5,
                }}
              />
              <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', mb: 1 }}>
                Chào Mừng Trở Lại!
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Đăng nhập bằng số điện thoại để đặt chỗ lớp học, theo dõi gói tập và lịch trình.
              </Typography>
            </Box>

            {/* Quick Demo Fill Buttons with Database Accounts */}
            <Box sx={{ p: 2, bgcolor: '#F1F5F9', borderRadius: 3, mb: 3 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 1 }}>
                ⚡ TÀI KHOẢN MẪU TỪ HỆ THỐNG (MẬT KHẨU: 123456):
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleQuickLogin('0901000005', '123456')}
                  sx={{ fontSize: '0.75rem', py: 0.5 }}
                >
                  Hội Viên (0901000005)
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleQuickLogin('0901000003', '123456')}
                  sx={{ fontSize: '0.75rem', py: 0.5 }}
                >
                  HLV (0901000003)
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="info"
                  onClick={() => handleQuickLogin('0901000001', '123456')}
                  sx={{ fontSize: '0.75rem', py: 0.5 }}
                >
                  Quản Lý (0901000001)
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="warning"
                  onClick={() => handleQuickLogin('0901000002', '123456')}
                  sx={{ fontSize: '0.75rem', py: 0.5 }}
                >
                  Lễ Tân (0901000002)
                </Button>
              </Stack>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {successMsg && (
              <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mb: 3 }}>
                {successMsg}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2.5}>
                {/* Phone Field (replacing email) */}
                <TextField
                  required
                  fullWidth
                  label="Số điện thoại đăng nhập"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Ví dụ: 0901000005 (10-11 số)"
                  helperText="Đăng nhập bằng số điện thoại đã đăng ký với trung tâm"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />

                <TextField
                  required
                  fullWidth
                  label="Mật khẩu"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                            {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleChange}
                        color="primary"
                        size="small"
                      />
                    }
                    label={<Typography variant="body2">Ghi nhớ đăng nhập</Typography>}
                  />
                  <Typography
                    component={RouterLink}
                    to="/forgot-password"
                    variant="body2"
                    sx={{
                      color: 'primary.main',
                      textDecoration: 'none',
                      fontWeight: 600,
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    Quên mật khẩu?
                  </Typography>
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={loading || Boolean(successMsg)}
                  sx={{
                    py: 1.5,
                    fontWeight: 700,
                    fontSize: '1rem',
                    boxShadow: '0 6px 16px rgba(25, 118, 210, 0.35)',
                  }}
                >
                  {loading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={20} color="inherit" />
                      <span>Đang xác thực...</span>
                    </Box>
                  ) : (
                    'Đăng Nhập'
                  )}
                </Button>
              </Stack>
            </Box>

            {/* Social Logins - Disabled as Backend lacks OAuth */}
            <Box sx={{ my: 3 }}>
              <Divider sx={{ '&::before, &::after': { borderColor: '#E2E8F0' } }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', px: 1 }}>
                  ĐĂNG NHẬP MẠNG XÃ HỘI
                </Typography>
              </Divider>

              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', textAlign: 'center', mt: 1, fontStyle: 'italic' }}>
                (Chưa khả dụng - Backend SCMS chưa hỗ trợ cổng OAuth2)
              </Typography>

              <Stack direction="row" spacing={1.5} sx={{ mt: 1.5 }}>
                <Button
                  fullWidth
                  disabled
                  variant="outlined"
                  startIcon={<GoogleIcon />}
                  sx={{ py: 1, borderColor: '#CBD5E1', fontWeight: 600 }}
                >
                  Google
                </Button>
                <Button
                  fullWidth
                  disabled
                  variant="outlined"
                  startIcon={<FacebookIcon />}
                  sx={{ py: 1, borderColor: '#CBD5E1', fontWeight: 600 }}
                >
                  Facebook
                </Button>
                <Button
                  fullWidth
                  disabled
                  variant="outlined"
                  startIcon={<AppleIcon />}
                  sx={{ py: 1, borderColor: '#CBD5E1', fontWeight: 600 }}
                >
                  Apple
                </Button>
              </Stack>
            </Box>

            {/* Register Link */}
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Bạn chưa có tài khoản hội viên?{' '}
                <Typography
                  component={RouterLink}
                  to="/register"
                  variant="body2"
                  sx={{
                    color: 'secondary.main',
                    fontWeight: 700,
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  Đăng ký tài khoản ngay
                </Typography>
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Login;
