import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Stack,
  IconButton,
  TextField,
  Button,
  Divider,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  FitnessCenter as FitnessCenterIcon,
  PhoneInTalk as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  AccessTime as AccessTimeIcon,
  Facebook as FacebookIcon,
  Instagram as InstagramIcon,
  YouTube as YouTubeIcon,
  Send as SendIcon,
  Map as MapIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [openAlert, setOpenAlert] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setOpenAlert(true);
      setEmail('');
    }
  };

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#0B132B',
        color: '#E2E8F0',
        pt: { xs: 8, md: 10 },
        pb: 4,
        position: 'relative',
        overflow: 'hidden',
        borderTop: '4px solid #FF6B35',
      }}
    >
      {/* Background ambient decorative shapes */}
      <Box
        sx={{
          position: 'absolute',
          top: -120,
          right: -120,
          width: 320,
          height: 320,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(25, 118, 210, 0.15) 0%, rgba(11, 19, 43, 0) 70%)',
          pointerEvents: 'none',
        }}
      />

      <Container maxWidth="xl">
        <Grid container spacing={{ xs: 4, md: 6 }}>
          {/* Col 1: Brand & Bio */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #1976D2 0%, #FF6B35 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                }}
              >
                <FitnessCenterIcon sx={{ fontSize: 26 }} />
              </Box>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 900, color: '#FFFFFF' }}>
                  AURA <span style={{ color: '#FF6B35' }}>SPORT</span>
                </Typography>
                <Typography variant="caption" sx={{ color: '#94A3B8', letterSpacing: '0.1em' }}>
                  FITNESS & WELLNESS CENTER
                </Typography>
              </Box>
            </Box>

            <Typography variant="body2" sx={{ color: '#94A3B8', lineHeight: 1.7, mb: 3 }}>
              Hệ thống tổ hợp thể thao & sức khỏe tiêu chuẩn 5 sao với thiết bị máy tập Technogym nhập khẩu Ý, hồ bơi nước mặn 4 mùa và đội ngũ Master Trainer tận tâm hàng đầu.
            </Typography>

            <Typography variant="subtitle2" sx={{ color: '#FFFFFF', mb: 1.5, fontWeight: 700 }}>
              KẾT NỐI VỚI CHÚNG TÔI:
            </Typography>
            <Stack direction="row" spacing={1.5}>
              {[
                { icon: <FacebookIcon />, color: '#1877F2', label: 'Facebook' },
                { icon: <InstagramIcon />, color: '#E4405F', label: 'Instagram' },
                { icon: <YouTubeIcon />, color: '#FF0000', label: 'YouTube' },
              ].map((social, idx) => (
                <IconButton
                  key={idx}
                  aria-label={social.label}
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.08)',
                    color: '#FFFFFF',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: social.color,
                      transform: 'translateY(-3px)',
                    },
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Stack>
          </Grid>

          {/* Col 2: Quick Links */}
          <Grid size={{ xs: 6, sm: 6, md: 2 }}>
            <Typography variant="subtitle1" sx={{ color: '#FFFFFF', fontWeight: 700, mb: 2.5 }}>
              Khám Phá
            </Typography>
            <Stack spacing={1.5}>
              {[
                { label: 'Trang Chủ', path: '/' },
                { label: 'Gói Hội Viên', path: '/packages' },
                { label: 'Lịch Lớp Học', path: '/classes' },
                { label: 'Về Chúng Tôi', path: '/about' },
                { label: 'Đăng Ký Tập Thử', path: '/register' },
                { label: 'Đăng Nhập Hội Viên', path: '/login' },
              ].map((link, idx) => (
                <Typography
                  key={idx}
                  component={RouterLink}
                  to={link.path}
                  variant="body2"
                  sx={{
                    color: '#94A3B8',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    '&:hover': { color: '#FF6B35', transform: 'translateX(4px)' },
                    display: 'inline-block',
                  }}
                >
                  {link.label}
                </Typography>
              ))}
            </Stack>
          </Grid>

          {/* Col 3: Sports & Facilities */}
          <Grid size={{ xs: 6, sm: 6, md: 2 }}>
            <Typography variant="subtitle1" sx={{ color: '#FFFFFF', fontWeight: 700, mb: 2.5 }}>
              Bộ Môn Thể Thao
            </Typography>
            <Stack spacing={1.5}>
              {[
                'Gym & Bodybuilding',
                'Bể Bơi Nước Mặn 4 Mùa',
                'Yoga & Thiền Định',
                'Boxing & Kickfit',
                'Pilates Reformer',
                'Zumba & GroupX',
                'Xông Hơi Đá Muối Sauna',
              ].map((sport, idx) => (
                <Typography
                  key={idx}
                  component={RouterLink}
                  to="/classes"
                  variant="body2"
                  sx={{
                    color: '#94A3B8',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                    '&:hover': { color: '#FF6B35', transform: 'translateX(4px)' },
                    display: 'inline-block',
                  }}
                >
                  {sport}
                </Typography>
              ))}
            </Stack>
          </Grid>

          {/* Col 4: Contact, Hours & Map Mock */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Typography variant="subtitle1" sx={{ color: '#FFFFFF', fontWeight: 700, mb: 2.5 }}>
              Thông Tin Liên Hệ & Chi Nhánh
            </Typography>

            <Stack spacing={2} sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                <LocationIcon sx={{ color: '#FF6B35', fontSize: 20, mt: 0.3 }} />
                <Typography variant="body2" sx={{ color: '#CBD5E1', lineHeight: 1.5 }}>
                  <strong>Cơ sở Hà Nội:</strong> 456 Hoàng Quốc Việt, Cầu Giấy, Hà Nội
                  <br />
                  <strong>Cơ sở TP.HCM:</strong> 128 Nguyễn Thị Minh Khai, Q.3, TP.HCM
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <PhoneIcon sx={{ color: '#FF6B35', fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: '#CBD5E1' }}>
                  Hotline tư vấn: <strong style={{ color: '#FFFFFF' }}>1900 8888</strong> (06:00 - 22:00)
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <EmailIcon sx={{ color: '#FF6B35', fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: '#CBD5E1' }}>
                  Email: info@aurasport.vn
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <AccessTimeIcon sx={{ color: '#FF6B35', fontSize: 20 }} />
                <Typography variant="body2" sx={{ color: '#CBD5E1' }}>
                  Giờ mở cửa: <strong>05:30 - 22:00</strong> (Thứ 2 - Chủ Nhật)
                </Typography>
              </Box>
            </Stack>

            {/* Map Preview Mockup Box */}
            <Box
              sx={{
                p: 2,
                borderRadius: 3,
                bgcolor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.08)',
                  borderColor: '#1976D2',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 2,
                    bgcolor: 'rgba(25, 118, 210, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#42A5F5',
                  }}
                >
                  <MapIcon />
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: '#FFFFFF', fontWeight: 600 }}>
                    Bản Đồ Chỉ Đường
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                    4 trung tâm thể thao toàn quốc
                  </Typography>
                </Box>
              </Box>
              <Button
                size="small"
                variant="outlined"
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: '#FF6B35',
                  borderColor: 'rgba(255, 107, 53, 0.5)',
                  fontSize: '0.75rem',
                  py: 0.5,
                  '&:hover': {
                    borderColor: '#FF6B35',
                    bgcolor: 'rgba(255, 107, 53, 0.1)',
                  },
                }}
              >
                Mở Bản Đồ
              </Button>
            </Box>

            {/* Newsletter Subscription */}
            <Box component="form" onSubmit={handleSubscribe} sx={{ mt: 3 }}>
              <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', mb: 1 }}>
                Nhận lịch tập thử miễn phí & ưu đãi hội viên độc quyền:
              </Typography>
              <Stack direction="row" spacing={1}>
                <TextField
                  size="small"
                  fullWidth
                  placeholder="Nhập email của bạn..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.08)',
                    borderRadius: 2,
                    '& .MuiOutlinedInput-root': {
                      color: '#FFFFFF',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.15)' },
                      '&:hover fieldset': { borderColor: '#1976D2' },
                    },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  sx={{ minWidth: 48, px: 2 }}
                >
                  <SendIcon sx={{ fontSize: 18 }} />
                </Button>
              </Stack>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.08)' }} />

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: '#64748B', textAlign: { xs: 'center', sm: 'left' } }}>
            © {new Date().getFullYear()} AURA SPORT Management System. Tất cả quyền được bảo lưu.
          </Typography>
          <Stack direction="row" spacing={3}>
            <Typography
              component={RouterLink}
              to="/about"
              variant="caption"
              sx={{ color: '#94A3B8', textDecoration: 'none', '&:hover': { color: '#FFFFFF' } }}
            >
              Điều khoản dịch vụ
            </Typography>
            <Typography
              component={RouterLink}
              to="/about"
              variant="caption"
              sx={{ color: '#94A3B8', textDecoration: 'none', '&:hover': { color: '#FFFFFF' } }}
            >
              Chính sách bảo mật
            </Typography>
            <Typography
              component={RouterLink}
              to="/about"
              variant="caption"
              sx={{ color: '#94A3B8', textDecoration: 'none', '&:hover': { color: '#FFFFFF' } }}
            >
              Quy định phòng tập
            </Typography>
          </Stack>
        </Box>
      </Container>

      <Snackbar
        open={openAlert}
        autoHideDuration={4000}
        onClose={() => setOpenAlert(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }} onClose={() => setOpenAlert(false)}>
          Cảm ơn bạn! Chúng tôi đã gửi mã quà tặng tập thử 3 ngày miễn phí tới email của bạn.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Footer;
