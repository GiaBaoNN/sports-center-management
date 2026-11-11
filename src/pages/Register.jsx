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
  Alert,
  Stack,
  Chip,
  Paper,
  CircularProgress,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person as PersonIcon,
  Badge as BadgeIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Lock as LockIcon,
  FitnessCenter as FitnessCenterIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Realtime Validation Logic matching backend constraints
  const errors = {
    username: !formData.username.trim()
      ? 'Vui lòng nhập tên tài khoản (Username)'
      : formData.username.trim().length < 3 || formData.username.trim().length > 50
      ? 'Username phải từ 3 đến 50 ký tự'
      : !/^[a-zA-Z0-9_.-]+$/.test(formData.username.trim())
      ? 'Username chỉ được gồm chữ cái, chữ số, gạch dưới (_) hoặc gạch ngang (-)'
      : '',
    fullName: !formData.fullName.trim()
      ? 'Vui lòng nhập họ và tên của bạn'
      : formData.fullName.trim().length > 100
      ? 'Họ và tên tối đa 100 ký tự'
      : '',
    phone: !formData.phone
      ? 'Vui lòng nhập số điện thoại'
      : !/^\d{10,11}$/.test(formData.phone.trim())
      ? 'Số điện thoại phải từ 10 - 11 chữ số (ví dụ: 0901000005)'
      : '',
    email: formData.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
      ? 'Địa chỉ email không hợp lệ (ví dụ: name@domain.com)'
      : '',
    password: !formData.password
      ? 'Vui lòng thiết lập mật khẩu'
      : formData.password.length < 6
      ? 'Mật khẩu phải chứa ít nhất 6 ký tự'
      : '',
    confirmPassword: !formData.confirmPassword
      ? 'Vui lòng xác nhận mật khẩu'
      : formData.confirmPassword !== formData.password
      ? 'Mật khẩu xác nhận không trùng khớp'
      : '',
    agreeTerms: !formData.agreeTerms ? 'Bạn cần đồng ý với Điều khoản dịch vụ' : '',
  };

  const hasErrors = Object.values(errors).some((err) => err !== '');

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (serverError) setServerError('');
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Mark all touched
    setTouched({
      username: true,
      fullName: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true,
      agreeTerms: true,
    });

    if (hasErrors) return;

    setIsSubmitting(true);
    setServerError('');

    try {
      await register({
        username: formData.username.trim(),
        password: formData.password,
        fullName: formData.fullName.trim(),
        email: formData.email.trim() || null,
        phone: formData.phone.trim(),
      });

      setIsSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      setServerError(err.message || 'Đăng ký không thành công. Tên tài khoản hoặc số điện thoại có thể đã tồn tại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ minHeight: 'calc(100vh - 80px)', display: 'flex', bgcolor: '#F8FAFC' }}>
      <Grid container sx={{ minHeight: '100%' }}>
        {/* Left Side: Motivational Banner */}
        <Grid
          size={{ xs: 12, md: 5 }}
          sx={{
            display: { xs: 'none', md: 'flex' },
            position: 'relative',
            backgroundImage: 'url(https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            alignItems: 'flex-end',
            p: 6,
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(180deg, rgba(25, 118, 210, 0.4) 0%, rgba(15, 23, 42, 0.95) 100%)',
            }}
          />

          <Box sx={{ position: 'relative', zIndex: 1, color: '#FFFFFF' }}>
            <Box
              sx={{
                width: 50,
                height: 50,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #FF6B35 0%, #E0531E 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3,
                color: '#FFFFFF',
              }}
            >
              <FitnessCenterIcon sx={{ fontSize: 30 }} />
            </Box>

            <Typography variant="h3" sx={{ fontWeight: 900, mb: 2, lineHeight: 1.2 }}>
              Tham Gia Cộng Đồng Thể Thao Đẳng Cấp
            </Typography>
            <Typography variant="body1" sx={{ color: '#E2E8F0', lineHeight: 1.7, mb: 4 }}>
              Đăng ký tài khoản thành viên để bắt đầu hành trình rèn luyện vóc dáng hoàn hảo, kết nối với các HLV hàng đầu và nhận ngay quà tặng chào mừng.
            </Typography>

            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3,
                bgcolor: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#FF8A5B', mb: 0.5 }}>
                🎁 ĐẶC QUYỀN HỘI VIÊN MỚI:
              </Typography>
              <Typography variant="body2" sx={{ color: '#F1F5F9' }}>
                • Tặng ngay 01 buổi đo InBody & tư vấn dinh dưỡng 1:1
                <br />
                • Tặng vé trải nghiệm miễn phí Hồ bơi nước mặn 4 mùa
              </Typography>
            </Paper>
          </Box>
        </Grid>

        {/* Right Side: Register Form */}
        <Grid
          size={{ xs: 12, md: 7 }}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            p: { xs: 3, sm: 6, md: 8 },
            bgcolor: '#FFFFFF',
          }}
        >
          <Box sx={{ maxWidth: 560, width: '100%', mx: 'auto' }}>
            <Box sx={{ mb: 4 }}>
              <Chip
                label="ĐĂNG KÝ HỘI VIÊN MỚI"
                size="small"
                sx={{
                  bgcolor: 'rgba(255, 107, 53, 0.1)',
                  color: 'secondary.main',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  mb: 1.5,
                }}
              />
              <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', mb: 1 }}>
                Tạo Tài Khoản Mới
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Điền đầy đủ thông tin bên dưới để đăng ký thẻ hội viên AURA SPORT.
              </Typography>
            </Box>

            {serverError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {serverError}
              </Alert>
            )}

            {isSuccess && (
              <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mb: 3 }}>
                Đăng ký tài khoản thành công! Hệ thống đang tự động đăng nhập và đưa bạn về trang chủ...
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <Stack spacing={2.5}>
                {/* Row 1: Username & Full Name */}
                <Grid container spacing={2}>
                  {/* Username (Mandatory in RegisterRequest.java) */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      required
                      fullWidth
                      label="Tên đăng nhập (Username)"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      onBlur={() => handleBlur('username')}
                      error={Boolean(touched.username && errors.username)}
                      helperText={touched.username && errors.username}
                      placeholder="Ví dụ: hoangnv99 (3-50 ký tự)"
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <BadgeIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  </Grid>

                  {/* Full Name */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      required
                      fullWidth
                      label="Họ và tên đầy đủ"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      onBlur={() => handleBlur('fullName')}
                      error={Boolean(touched.fullName && errors.fullName)}
                      helperText={touched.fullName && errors.fullName}
                      placeholder="Ví dụ: Nguyễn Văn Hoàng"
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  </Grid>
                </Grid>

                {/* Row 2: Phone & Email */}
                <Grid container spacing={2}>
                  {/* Phone (Mandatory in Login & Register) */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      required
                      fullWidth
                      label="Số điện thoại"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={() => handleBlur('phone')}
                      error={Boolean(touched.phone && errors.phone)}
                      helperText={touched.phone && errors.phone}
                      placeholder="Ví dụ: 0912345678 (10-11 số)"
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
                  </Grid>

                  {/* Email (Optional in DB, validated if provided) */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Địa chỉ Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={() => handleBlur('email')}
                      error={Boolean(touched.email && errors.email)}
                      helperText={touched.email && errors.email}
                      placeholder="name@example.com (Không bắt buộc)"
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
                  </Grid>
                </Grid>

                {/* Row 3: Password & Confirm Password */}
                <Grid container spacing={2}>
                  {/* Password */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      required
                      fullWidth
                      label="Mật khẩu"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={() => handleBlur('password')}
                      error={Boolean(touched.password && errors.password)}
                      helperText={touched.password && errors.password}
                      placeholder="Tối thiểu 6 ký tự"
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
                  </Grid>

                  {/* Confirm Password */}
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      required
                      fullWidth
                      label="Xác nhận mật khẩu"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onBlur={() => handleBlur('confirmPassword')}
                      error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                      helperText={touched.confirmPassword && errors.confirmPassword}
                      placeholder="Nhập lại mật khẩu vừa đặt"
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                                {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  </Grid>
                </Grid>

                {/* Terms agreement checkbox */}
                <Box>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="agreeTerms"
                        checked={formData.agreeTerms}
                        onChange={handleChange}
                        onBlur={() => handleBlur('agreeTerms')}
                        color="secondary"
                      />
                    }
                    label={
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Tôi đã đọc và đồng ý với{' '}
                        <strong style={{ color: '#1976D2' }}>Điều khoản dịch vụ</strong> và{' '}
                        <strong style={{ color: '#1976D2' }}>Chính sách bảo mật</strong> của AURA SPORT.
                      </Typography>
                    }
                  />
                  {touched.agreeTerms && errors.agreeTerms && (
                    <Typography variant="caption" color="error" sx={{ display: 'block', ml: 4 }}>
                      {errors.agreeTerms}
                    </Typography>
                  )}
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="secondary"
                  size="large"
                  disabled={isSubmitting || isSuccess}
                  sx={{
                    py: 1.5,
                    fontWeight: 700,
                    fontSize: '1.05rem',
                    boxShadow: '0 6px 18px rgba(255, 107, 53, 0.4)',
                  }}
                >
                  {isSubmitting ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress size={24} color="inherit" />
                      <span>Đang tạo tài khoản...</span>
                    </Box>
                  ) : (
                    'Hoàn Tất Đăng Ký'
                  )}
                </Button>
              </Stack>
            </Box>

            {/* Link to login */}
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography variant="body2" color="text.secondary">
                Bạn đã có tài khoản rồi?{' '}
                <Typography
                  component={RouterLink}
                  to="/login"
                  variant="body2"
                  sx={{
                    color: 'primary.main',
                    fontWeight: 700,
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  Đăng nhập tại đây
                </Typography>
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Register;
