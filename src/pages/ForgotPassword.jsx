import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Alert,
  Stack,
  Chip,
} from '@mui/material';
import {
  Email as EmailIcon,
  MarkEmailRead as MarkEmailReadIcon,
  ArrowBack as ArrowBackIcon,
  Refresh as RefreshIcon,
  FitnessCenter as FitnessCenterIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const isValidEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email);

  useEffect(() => {
    let timer;
    if (isSent && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [isSent, countdown]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (!isValidEmail) return;

    setIsSent(true);
    setCountdown(60);
    setCanResend(false);
  };

  const handleResend = () => {
    if (!canResend) return;
    setCountdown(60);
    setCanResend(false);
  };

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 80px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 2,
        background: 'linear-gradient(135deg, #F8FAFC 0%, #EEF2F6 100%)',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, sm: 6 },
            borderRadius: 4,
            border: '1px solid #E2E8F0',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.06)',
            bgcolor: '#FFFFFF',
            textAlign: 'center',
          }}
        >
          {/* Logo badge */}
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #1976D2 0%, #FF6B35 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              mb: 3,
            }}
          >
            <FitnessCenterIcon sx={{ fontSize: 28 }} />
          </Box>

          {!isSent ? (
            /* STEP 1: INPUT EMAIL */
            <Box>
              <Chip
                label="HỖ TRỢ TÀI KHOẢN"
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
                Quên Mật Khẩu?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420, mx: 'auto', mb: 4, lineHeight: 1.6 }}>
                Đừng lo lắng! Nhập địa chỉ email liên kết với tài khoản hội viên của bạn, chúng tôi sẽ gửi liên kết để đặt lại mật khẩu an toàn.
              </Typography>

              <Box component="form" onSubmit={handleSubmit} noValidate>
                <TextField
                  fullWidth
                  label="Email của bạn"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched(true)}
                  error={Boolean(touched && !isValidEmail)}
                  helperText={touched && !isValidEmail ? 'Vui lòng nhập định dạng email hợp lệ' : ''}
                  placeholder="name@example.com"
                  sx={{ mb: 3 }}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={!email || (touched && !isValidEmail)}
                  sx={{
                    py: 1.4,
                    fontWeight: 700,
                    fontSize: '1rem',
                    boxShadow: '0 6px 18px rgba(25, 118, 210, 0.35)',
                    mb: 3,
                  }}
                >
                  Gửi Liên Kết Đặt Lại Mật Khẩu
                </Button>
              </Box>
            </Box>
          ) : (
            /* STEP 2: EMAIL SENT CONFIRMATION */
            <Box>
              <Box
                sx={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  bgcolor: 'rgba(46, 125, 50, 0.1)',
                  color: 'success.main',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2.5,
                }}
              >
                <MarkEmailReadIcon sx={{ fontSize: 40 }} />
              </Box>

              <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', mb: 1 }}>
                Email Đã Được Gửi!
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 440, mx: 'auto', mb: 3, lineHeight: 1.7 }}>
                Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu tới hộp thư:{' '}
                <strong style={{ color: '#0F172A' }}>{email}</strong>. Vui lòng kiểm tra hòm thư chính và cả mục Spam/Thư rác.
              </Typography>

              <Alert severity="info" sx={{ textAlign: 'left', mb: 4, borderRadius: 2 }}>
                Liên kết bảo mật sẽ có hiệu lực trong vòng <strong>15 phút</strong>. Sau thời gian này bạn cần yêu cầu gửi lại liên kết mới.
              </Alert>

              <Stack spacing={2}>
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  disabled={!canResend}
                  onClick={handleResend}
                  startIcon={<RefreshIcon />}
                  sx={{ py: 1.2, fontWeight: 700 }}
                >
                  {canResend ? 'Gửi Lại Email Ngay' : `Gửi lại sau (${countdown}s)`}
                </Button>

                <Button
                  variant="text"
                  color="inherit"
                  fullWidth
                  onClick={() => setIsSent(false)}
                  sx={{ fontWeight: 600 }}
                >
                  Nhập địa chỉ email khác
                </Button>
              </Stack>
            </Box>
          )}

          {/* Back to Login link */}
          <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid #F1F5F9' }}>
            <Button
              component={RouterLink}
              to="/login"
              startIcon={<ArrowBackIcon />}
              sx={{ color: 'text.secondary', fontWeight: 600 }}
            >
              Quay lại Đăng nhập
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ForgotPassword;
