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
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Lock as LockIcon,
  FitnessCenter as FitnessCenterIcon,
  Google as GoogleIcon,
  Facebook as FacebookIcon,
  Apple as AppleIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    if (error) setError('');
  };

  const handleQuickLogin = (email, pass) => {
    setFormData({
      ...formData,
      email: email,
      password: pass,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Vui lòng nhập đầy đủ Email và Mật khẩu.');
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Định dạng email không hợp lệ.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 1500);
    }, 800);
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
                label="CỔNG THÀNH VIÊN"
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
                Đăng nhập để theo dõi lịch tập, đặt chỗ lớp học và quản lý gói hội viên.
              </Typography>
            </Box>

            {/* Quick Demo Fill Buttons */}
            <Box sx={{ p: 2, bgcolor: '#F1F5F9', borderRadius: 3, mb: 3 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 1 }}>
                ⚡ TÀI KHOẢN MẪU DÙNG THỬ NHANH:
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleQuickLogin('member@aurasport.vn', '123456')}
                  sx={{ fontSize: '0.75rem', py: 0.5 }}
                >
                  Hội Viên (Member)
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleQuickLogin('trainer@aurasport.vn', '123456')}
                  sx={{ fontSize: '0.75rem', py: 0.5 }}
                >
                  Huấn Luyện Viên (Trainer)
                </Button>
              </Stack>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mb: 3 }}>
                Đăng nhập thành công! Đang chuyển hướng về trang chủ...
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2.5}>
                <TextField
                  fullWidth
                  label="Email của bạn"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />

                <TextField
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
                  disabled={loading || success}
                  sx={{
                    py: 1.5,
                    fontWeight: 700,
                    fontSize: '1rem',
                    boxShadow: '0 6px 16px rgba(25, 118, 210, 0.35)',
                  }}
                >
                  {loading ? 'Đang xác thực...' : 'Đăng Nhập'}
                </Button>
              </Stack>
            </Box>

            {/* Social Logins */}
            <Box sx={{ my: 3 }}>
              <Divider sx={{ '&::before, &::after': { borderColor: '#E2E8F0' } }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', px: 1 }}>
                  HOẶC TIẾP TỤC VỚI
                </Typography>
              </Divider>

              <Stack direction="row" spacing={1.5} sx={{ mt: 2.5 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<GoogleIcon sx={{ color: '#EA4335' }} />}
                  sx={{ py: 1, borderColor: '#CBD5E1', color: 'text.primary', fontWeight: 600 }}
                  onClick={() => alert('Chức năng đăng nhập Google (Mock UI)')}
                >
                  Google
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<FacebookIcon sx={{ color: '#1877F2' }} />}
                  sx={{ py: 1, borderColor: '#CBD5E1', color: 'text.primary', fontWeight: 600 }}
                  onClick={() => alert('Chức năng đăng nhập Facebook (Mock UI)')}
                >
                  Facebook
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<AppleIcon sx={{ color: '#000000' }} />}
                  sx={{ py: 1, borderColor: '#CBD5E1', color: 'text.primary', fontWeight: 600 }}
                  onClick={() => alert('Chức năng đăng nhập Apple (Mock UI)')}
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
