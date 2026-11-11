import React from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Alert,
  Stack,
  Chip,
  Divider,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  PhoneInTalk as PhoneIcon,
  Storefront as ReceptionIcon,
  FitnessCenter as FitnessCenterIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const ForgotPassword = () => {
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
              width: 56,
              height: 56,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #1976D2 0%, #FF6B35 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              mb: 3,
            }}
          >
            <FitnessCenterIcon sx={{ fontSize: 30 }} />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Chip
              label="HỖ TRỢ TÀI KHOẢN & MẬT KHẨU"
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
              Khôi Phục Mật Khẩu
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Thông tin hướng dẫn cấp lại mật khẩu truy cập hệ thống SCMS.
            </Typography>
          </Box>

          {/* Backend limitation alert */}
          <Alert severity="warning" icon={<InfoIcon />} sx={{ textAlign: 'left', mb: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
              Tính năng trực tuyến chưa khả dụng
            </Typography>
            <Typography variant="body2">
              Hệ thống API backend hiện tại chưa hỗ trợ khôi phục mật khẩu tự động qua Email hoặc SMS OTP. Để bảo đảm an toàn thông tin tài khoản, xin vui lòng thực hiện theo hướng dẫn bên dưới.
            </Typography>
          </Alert>

          <Paper elevation={0} sx={{ p: 3, bgcolor: '#F8FAFC', borderRadius: 3, border: '1px solid #E2E8F0', textAlign: 'left', mb: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary', mb: 1.5 }}>
              HƯỚNG DẪN CẤP LẠI MẬT KHẨU:
            </Typography>

            <Stack spacing={2}>
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <ReceptionIcon color="primary" sx={{ mt: 0.3 }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    1. Đến trực tiếp quầy Lễ tân
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Mang theo CMND/CCCD hoặc cung cấp số điện thoại đã đăng ký để nhân viên lễ tân xác minh và cấp lại mật khẩu mới tại quầy.
                  </Typography>
                </Box>
              </Box>

              <Divider />

              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <PhoneIcon color="secondary" sx={{ mt: 0.3 }} />
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    2. Liên hệ Hotline hỗ trợ
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Gọi tới tổng đài <strong>1900 8888</strong> (08:00 - 21:00 hàng ngày) để được nhân viên chăm sóc khách hàng hướng dẫn.
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Paper>

          <Button
            component={RouterLink}
            to="/login"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            startIcon={<ArrowBackIcon />}
            sx={{ fontWeight: 700, py: 1.3 }}
          >
            Quay Lại Trang Đăng Nhập
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default ForgotPassword;
