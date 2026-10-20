import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Chip,
  Stack,
  Rating,
  Avatar,
  IconButton,
  Paper,
  Tabs,
  Tab,
} from '@mui/material';
import {
  FitnessCenter as FitnessCenterIcon,
  Pool as PoolIcon,
  SelfImprovement as YogaIcon,
  SportsMma as BoxingIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Star as StarIcon,
  ArrowBackIos as PrevIcon,
  ArrowForwardIos as NextIcon,
  Whatshot as FireIcon,
  Security as SecurityIcon,
  WorkspacePremium as PremiumIcon,
  Speed as SpeedIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import SectionHeader from '../components/common/SectionHeader';
import PackageModal from '../components/common/PackageModal';
import {
  sportsCategories,
  membershipPackages,
  trainers,
  testimonials,
  centerStats,
  centerFacilities,
} from '../data/sportsData';

const Home = () => {
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'
  const [activeTrainerIndex, setActiveTrainerIndex] = useState(0);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [packageModalOpen, setPackageModalOpen] = useState(false);

  const handleOpenPackageModal = (pkg) => {
    setSelectedPackage(pkg);
    setPackageModalOpen(true);
  };

  const handleNextTrainer = () => {
    setActiveTrainerIndex((prev) => (prev + 1) % trainers.length);
  };

  const handlePrevTrainer = () => {
    setActiveTrainerIndex((prev) => (prev - 1 + trainers.length) % trainers.length);
  };

  return (
    <Box sx={{ overflow: 'hidden' }}>
      {/* 1. HERO SECTION */}
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: '85vh', md: '90vh' },
          display: 'flex',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #09122C 0%, #11224D 50%, #0A192F 100%)',
          color: '#FFFFFF',
          pt: { xs: 8, md: 4 },
          pb: { xs: 8, md: 10 },
        }}
      >
        {/* Ambient background glow */}
        <Box
          sx={{
            position: 'absolute',
            top: '10%',
            right: '5%',
            width: 450,
            height: 450,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 107, 53, 0.25) 0%, rgba(255, 107, 53, 0) 70%)',
            filter: 'blur(40px)',
            pointerEvents: 'none',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '10%',
            left: '5%',
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(25, 118, 210, 0.25) 0%, rgba(25, 118, 210, 0) 70%)',
            filter: 'blur(50px)',
            pointerEvents: 'none',
          }}
        />

        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={{ xs: 6, md: 4 }} alignItems="center">
            {/* Left Col: Hero Copy */}
            <Grid size={{ xs: 12, md: 7 }}>
              <Box sx={{ mb: 2 }}>
                <Chip
                  icon={<FireIcon sx={{ color: '#FF6B35 !important', fontSize: 18 }} />}
                  label="TỔ HỢP THỂ THAO & SỨC KHỎE 5 SAO"
                  sx={{
                    bgcolor: 'rgba(255, 107, 53, 0.15)',
                    color: '#FF8A5B',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    letterSpacing: '0.06em',
                    border: '1px solid rgba(255, 107, 53, 0.3)',
                    px: 1,
                    py: 2,
                  }}
                />
              </Box>

              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.2rem' },
                  fontWeight: 900,
                  lineHeight: 1.15,
                  mb: 2.5,
                  letterSpacing: '-0.03em',
                }}
              >
                Bứt Phá Giới Hạn <br />
                <Box
                  component="span"
                  sx={{
                    background: 'linear-gradient(135deg, #FF6B35 0%, #FFA07A 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Nâng Tầm Thể Lực
                </Box>
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: '#CBD5E1',
                  fontSize: { xs: '1.05rem', md: '1.2rem' },
                  lineHeight: 1.7,
                  mb: 4,
                  maxWidth: 620,
                }}
              >
                Trải nghiệm hệ thống máy tập Technogym nhập khẩu Ý, hồ bơi bốn mùa nước mặn và các lớp Yoga, Boxing cùng đội ngũ Huấn luyện viên Quốc tế chuẩn 5 sao.
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 5 }}>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  color="secondary"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    py: 1.6,
                    px: 4,
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    boxShadow: '0 8px 25px rgba(255, 107, 53, 0.45)',
                  }}
                >
                  Đăng Ký Tập Ngay
                </Button>
                <Button
                  component={RouterLink}
                  to="/classes"
                  variant="outlined"
                  size="large"
                  sx={{
                    py: 1.6,
                    px: 3.5,
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: '#FFFFFF',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    '&:hover': {
                      borderColor: '#FFFFFF',
                      bgcolor: 'rgba(255, 255, 255, 0.08)',
                    },
                  }}
                >
                  Khám Phá Lớp Học
                </Button>
              </Stack>

              {/* Stats Highlights */}
              <Grid container spacing={3} sx={{ pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.12)' }}>
                {centerStats.map((stat, idx) => (
                  <Grid size={{ xs: 6, sm: 3 }} key={idx}>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 800,
                        color: idx === 0 ? '#FF6B35' : idx === 1 ? '#42A5F5' : '#4CAF50',
                        fontSize: { xs: '1.6rem', md: '2rem' },
                      }}
                    >
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#F1F5F9', mt: 0.2 }}>
                      {stat.label}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                      {stat.note}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            {/* Right Col: Hero Visual Card */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Box
                sx={{
                  position: 'relative',
                  mx: 'auto',
                  maxWidth: { xs: 450, md: '100%' },
                }}
              >
                {/* Main Hero Image */}
                <Box
                  sx={{
                    position: 'relative',
                    borderRadius: 5,
                    overflow: 'hidden',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
                    border: '2px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <Box
                    component="img"
                    src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=900&auto=format&fit=crop"
                    alt="Sports Center Gym"
                    sx={{
                      width: '100%',
                      height: { xs: 380, sm: 480 },
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      p: 3,
                      background: 'linear-gradient(180deg, transparent 0%, rgba(9, 18, 44, 0.95) 100%)',
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#FFFFFF' }}>
                      Không Gian Tập Luyện Chuẩn Olympic
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#CBD5E1' }}>
                      Khu vực mở rộng 2.500m² với trang thiết bị tối tân
                    </Typography>
                  </Box>
                </Box>

                {/* Floating Badge 1: Trial Offer */}
                <Paper
                  elevation={6}
                  sx={{
                    position: 'absolute',
                    top: -20,
                    left: { xs: -10, sm: -30 },
                    p: 2,
                    borderRadius: 3,
                    bgcolor: '#FFFFFF',
                    color: '#0F172A',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.25)',
                    border: '1px solid rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                      bgcolor: 'rgba(255, 107, 53, 0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'secondary.main',
                    }}
                  >
                    <FireIcon />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                      Tập Thử 03 Ngày
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                      Miễn phí 100% trải nghiệm
                    </Typography>
                  </Box>
                </Paper>

                {/* Floating Badge 2: Member Satisfaction */}
                <Paper
                  elevation={6}
                  sx={{
                    position: 'absolute',
                    bottom: 30,
                    right: { xs: -10, sm: -25 },
                    p: 2,
                    borderRadius: 3,
                    bgcolor: 'rgba(15, 23, 42, 0.9)',
                    backdropFilter: 'blur(10px)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.35)',
                  }}
                >
                  <Avatar
                    src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop"
                    sx={{ width: 42, height: 42 }}
                  />
                  <Box>
                    <Stack direction="row" spacing={0.3} sx={{ mb: 0.3 }}>
                      {[...Array(5)].map((_, i) => (
                        <StarIcon key={i} sx={{ color: '#FFB800', fontSize: 16 }} />
                      ))}
                    </Stack>
                    <Typography variant="caption" sx={{ color: '#E2E8F0', fontWeight: 600 }}>
                      4.9/5 từ 2.800+ đánh giá
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 2. GIỚI THIỆU TRUNG TÂM (FACILITIES & HIGHLIGHTS) */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#FFFFFF' }}>
        <Container maxWidth="xl">
          <SectionHeader
            badge="KHÔNG GIAN & TIỆN ÍCH ĐẲNG CẤP"
            title="Trải Nghiệm Thể Thao Chuẩn Quốc Tế Tại"
            highlightTitle="AURA SPORT"
            subtitle="Chúng tôi kiến tạo môi trường thể thao toàn diện, nơi mọi hội viên đều được tiếp cận cơ sở vật chất 5 sao cùng dịch vụ chăm sóc sức khỏe chuyên sâu."
          />

          <Grid container spacing={4} sx={{ mb: 6 }}>
            {centerFacilities.map((facility, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3.5,
                    height: '100%',
                    bgcolor: '#F8FAFC',
                    borderRadius: 4,
                    border: '1px solid #E2E8F0',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: '0 16px 30px rgba(25, 118, 210, 0.08)',
                      borderColor: 'primary.light',
                      bgcolor: '#FFFFFF',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 52,
                      height: 52,
                      borderRadius: 3,
                      bgcolor: index % 2 === 0 ? 'rgba(25, 118, 210, 0.1)' : 'rgba(255, 107, 53, 0.1)',
                      color: index % 2 === 0 ? 'primary.main' : 'secondary.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2.5,
                    }}
                  >
                    {index === 0 && <FitnessCenterIcon sx={{ fontSize: 28 }} />}
                    {index === 1 && <PoolIcon sx={{ fontSize: 28 }} />}
                    {index === 2 && <SpeedIcon sx={{ fontSize: 28 }} />}
                    {index === 3 && <FireIcon sx={{ fontSize: 28 }} />}
                    {index === 4 && <SecurityIcon sx={{ fontSize: 28 }} />}
                    {index === 5 && <PremiumIcon sx={{ fontSize: 28 }} />}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.2, color: 'text.primary' }}>
                    {facility.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {facility.desc}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Real Photo Showcase Gallery */}
          <Grid container spacing={2}>
            {[
              {
                title: 'Khu tạ tự do & Functional Zone',
                img: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=800&auto=format&fit=crop',
              },
              {
                title: 'Hồ bơi điện phân muối khoáng 4 mùa',
                img: 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?q=80&w=800&auto=format&fit=crop',
              },
              {
                title: 'Phòng Yoga Zen Garden tĩnh lặng',
                img: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?q=80&w=800&auto=format&fit=crop',
              },
            ].map((item, idx) => (
              <Grid size={{ xs: 12, md: 4 }} key={idx}>
                <Box
                  sx={{
                    position: 'relative',
                    height: 240,
                    borderRadius: 4,
                    overflow: 'hidden',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                  }}
                >
                  <Box
                    component="img"
                    src={item.img}
                    alt={item.title}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease',
                      '&:hover': { transform: 'scale(1.06)' },
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      p: 2,
                      background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.85) 100%)',
                      color: '#FFFFFF',
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {item.title}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 3. SECTION CÁC MÔN THỂ THAO (GRID CARDS) */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.default' }}>
        <Container maxWidth="xl">
          <SectionHeader
            badge="BỘ MÔN ĐA DẠNG"
            title="Khám Phá Các Bộ Môn Thể Thao Tại"
            highlightTitle="AURA"
            subtitle="Từ tập thể hình chuyên sâu, bơi lội thư giãn đến rèn luyện sức bền Boxing và cân bằng nội tâm với Yoga."
          />

          <Grid container spacing={3.5}>
            {sportsCategories.map((sport) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={sport.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 4,
                    overflow: 'hidden',
                    position: 'relative',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 18px 36px rgba(0,0,0,0.1)',
                      '& .sport-img': {
                        transform: 'scale(1.08)',
                      },
                    },
                  }}
                >
                  <Box sx={{ position: 'relative', overflow: 'hidden', height: 220 }}>
                    <CardMedia
                      component="img"
                      className="sport-img"
                      image={sport.image}
                      alt={sport.name}
                      sx={{
                        height: '100%',
                        transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 16,
                        left: 16,
                      }}
                    >
                      <Chip
                        label={sport.tag}
                        size="small"
                        sx={{
                          bgcolor: sport.popular ? 'secondary.main' : 'rgba(15, 23, 42, 0.8)',
                          color: '#FFFFFF',
                          fontWeight: 700,
                          backdropFilter: 'blur(6px)',
                        }}
                      />
                    </Box>
                  </Box>

                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {sport.englishName}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 1.5, mt: 0.3, color: 'text.primary' }}>
                      {sport.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, mb: 2.5 }}>
                      {sport.description}
                    </Typography>

                    <Stack direction="row" spacing={2} sx={{ pt: 1, borderTop: '1px solid #F1F5F9' }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.main' }}>
                        📅 {sport.classesCount}
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                        👤 {sport.coachesCount}
                      </Typography>
                    </Stack>
                  </CardContent>

                  <CardActions sx={{ p: 3, pt: 0 }}>
                    <Button
                      component={RouterLink}
                      to="/classes"
                      fullWidth
                      variant="outlined"
                      color="primary"
                      endIcon={<ArrowForwardIcon />}
                      sx={{ fontWeight: 700, py: 1 }}
                    >
                      Xem Lịch Lớp Học
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 4. GÓI HỘI VIÊN NỔI BẬT */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#FFFFFF' }}>
        <Container maxWidth="xl">
          <SectionHeader
            badge="BẢNG GIÁ ƯU ĐÃI"
            title="Lựa Chọn Gói Hội Viên Phù Hợp Cho"
            highlightTitle="Mục Tiêu Của Bạn"
            subtitle="Linh hoạt thanh toán theo Tháng hoặc Tiết kiệm 20% khi đăng ký Gói Năm. Không phí ẩn, quyền lợi minh bạch."
          />

          {/* Billing Cycle Switcher */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 5 }}>
            <Box
              sx={{
                bgcolor: '#F1F5F9',
                p: 0.6,
                borderRadius: 3,
                display: 'inline-flex',
                gap: 1,
              }}
            >
              <Button
                variant={billingCycle === 'monthly' ? 'contained' : 'text'}
                color={billingCycle === 'monthly' ? 'primary' : 'inherit'}
                onClick={() => setBillingCycle('monthly')}
                sx={{
                  px: 3,
                  py: 1,
                  fontWeight: 700,
                  boxShadow: billingCycle === 'monthly' ? '0 4px 12px rgba(25, 118, 210, 0.25)' : 'none',
                }}
              >
                Gói Theo Tháng
              </Button>
              <Button
                variant={billingCycle === 'yearly' ? 'contained' : 'text'}
                color={billingCycle === 'yearly' ? 'secondary' : 'inherit'}
                onClick={() => setBillingCycle('yearly')}
                sx={{
                  px: 3,
                  py: 1,
                  fontWeight: 700,
                  boxShadow: billingCycle === 'yearly' ? '0 4px 12px rgba(255, 107, 53, 0.3)' : 'none',
                  display: 'flex',
                  gap: 1,
                }}
              >
                Gói Theo Năm
                <Chip
                  label="-20%"
                  size="small"
                  sx={{
                    bgcolor: '#FFFFFF',
                    color: 'secondary.main',
                    fontWeight: 800,
                    height: 20,
                    fontSize: '0.7rem',
                  }}
                />
              </Button>
            </Box>
          </Box>

          {/* Packages Cards Grid */}
          <Grid container spacing={3.5} alignItems="stretch">
            {membershipPackages.map((pkg) => {
              const displayPrice = billingCycle === 'yearly' ? Math.round(pkg.priceYearly / 12) : pkg.priceMonthly;
              return (
                <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={pkg.id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 4,
                      p: 3,
                      position: 'relative',
                      border: pkg.highlight ? '2px solid #FF6B35' : '1px solid #E2E8F0',
                      boxShadow: pkg.highlight ? '0 16px 36px rgba(255, 107, 53, 0.15)' : '0 4px 20px rgba(0,0,0,0.04)',
                      transform: pkg.highlight ? { xs: 'none', lg: 'scale(1.03)' } : 'none',
                      zIndex: pkg.highlight ? 2 : 1,
                      bgcolor: '#FFFFFF',
                    }}
                  >
                    {pkg.badge && (
                      <Chip
                        label={pkg.badge}
                        color="secondary"
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: -14,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          fontWeight: 800,
                          fontSize: '0.72rem',
                          px: 1,
                          boxShadow: '0 4px 12px rgba(255, 107, 53, 0.35)',
                        }}
                      />
                    )}

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 800, letterSpacing: '0.08em' }}>
                        {pkg.tier}
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>
                        {pkg.name}
                      </Typography>
                    </Box>

                    {/* Price display */}
                    <Box sx={{ my: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                        <Typography variant="h3" sx={{ fontWeight: 900, color: pkg.highlight ? 'secondary.main' : 'primary.main' }}>
                          {displayPrice.toLocaleString('vi-VN')}
                        </Typography>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700 }}>
                          đ / tháng
                        </Typography>
                      </Box>
                      {billingCycle === 'yearly' && (
                        <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 700, display: 'block', mt: 0.5 }}>
                          Thanh toán 1 năm: {pkg.priceYearly.toLocaleString('vi-VN')} đ
                        </Typography>
                      )}
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, minHeight: 40, lineHeight: 1.5 }}>
                      {pkg.description}
                    </Typography>

                    {/* Features list */}
                    <Stack spacing={1.5} sx={{ mb: 4, flexGrow: 1 }}>
                      {pkg.features.slice(0, 5).map((feat, idx) => (
                        <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.2 }}>
                          {feat.included ? (
                            <CheckCircleIcon sx={{ fontSize: 18, color: 'success.main', mt: 0.2 }} />
                          ) : (
                            <CancelIcon sx={{ fontSize: 18, color: '#CBD5E1', mt: 0.2 }} />
                          )}
                          <Typography
                            variant="body2"
                            sx={{
                              color: feat.included ? 'text.primary' : '#94A3B8',
                              fontWeight: feat.included ? 500 : 400,
                              fontSize: '0.88rem',
                              lineHeight: 1.4,
                            }}
                          >
                            {feat.text}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>

                    <Button
                      fullWidth
                      variant={pkg.highlight ? 'contained' : 'outlined'}
                      color={pkg.highlight ? 'secondary' : 'primary'}
                      size="large"
                      onClick={() => handleOpenPackageModal(pkg)}
                      sx={{
                        fontWeight: 700,
                        py: 1.2,
                        boxShadow: pkg.highlight ? '0 6px 18px rgba(255, 107, 53, 0.35)' : 'none',
                      }}
                    >
                      {pkg.buttonText}
                    </Button>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Button
              component={RouterLink}
              to="/packages"
              variant="text"
              color="primary"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{ fontWeight: 700, fontSize: '1rem' }}
            >
              Xem Bảng So Sánh Chi Tiết Quyền Lợi Các Gói
            </Button>
          </Box>
        </Container>
      </Box>

      {/* 5. SECTION HLV TIÊU BIỂU (CAROUSEL / SHOWCASE) */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#F8FAFC' }}>
        <Container maxWidth="xl">
          <SectionHeader
            badge="ĐỘI NGŨ CHUYÊN GIA"
            title="Huấn Luyện Viên Tiêu Biểu Chuẩn"
            highlightTitle="Quốc Tế"
            subtitle="Đội ngũ HLV được đào tạo bài bản với chứng chỉ NASM, ACE, FINA, luôn tận tình đồng hành từng buổi tập."
          />

          {/* Featured Trainer Showcase */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: 5,
              overflow: 'hidden',
              bgcolor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.05)',
            }}
          >
            <Grid container>
              {/* Trainer Photo */}
              <Grid size={{ xs: 12, md: 5 }}>
                <Box
                  component="img"
                  src={trainers[activeTrainerIndex].image}
                  alt={trainers[activeTrainerIndex].name}
                  sx={{
                    width: '100%',
                    height: { xs: 340, md: 480 },
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </Grid>

              {/* Trainer Details */}
              <Grid size={{ xs: 12, md: 7 }} sx={{ p: { xs: 3, md: 6 }, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Chip
                    label={trainers[activeTrainerIndex].experience}
                    color="primary"
                    size="small"
                    sx={{ fontWeight: 700 }}
                  />
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Rating value={trainers[activeTrainerIndex].rating} precision={0.1} readOnly size="small" />
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {trainers[activeTrainerIndex].rating} ({trainers[activeTrainerIndex].reviewsCount} đánh giá)
                    </Typography>
                  </Stack>
                </Box>

                <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, color: 'text.primary', fontSize: { xs: '1.8rem', md: '2.4rem' } }}>
                  {trainers[activeTrainerIndex].name}
                </Typography>
                <Typography variant="subtitle1" color="secondary.main" sx={{ fontWeight: 700, mb: 2 }}>
                  {trainers[activeTrainerIndex].role}
                </Typography>

                <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.7, mb: 3 }}>
                  "{trainers[activeTrainerIndex].bio}"
                </Typography>

                {/* Specialties */}
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                  LĨNH VỰC CHUYÊN SÂU:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 3 }}>
                  {trainers[activeTrainerIndex].specialties.map((spec, idx) => (
                    <Chip key={idx} label={spec} size="small" sx={{ bgcolor: '#F1F5F9', fontWeight: 600 }} />
                  ))}
                </Stack>

                {/* Certifications */}
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                  CHỨNG CHỈ QUỐC TẾ:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 4 }}>
                  {trainers[activeTrainerIndex].certifications.map((cert, idx) => (
                    <Chip key={idx} label={`✓ ${cert}`} size="small" color="success" variant="outlined" sx={{ fontWeight: 700 }} />
                  ))}
                </Stack>

                {/* Controls */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 2, borderTop: '1px solid #F1F5F9' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                    HLV {activeTrainerIndex + 1} trên {trainers.length} chuyên gia
                  </Typography>
                  <Stack direction="row" spacing={1.5}>
                    <IconButton
                      onClick={handlePrevTrainer}
                      sx={{
                        border: '1px solid #CBD5E1',
                        '&:hover': { bgcolor: 'primary.main', color: '#FFFFFF' },
                      }}
                    >
                      <PrevIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                    <IconButton
                      onClick={handleNextTrainer}
                      sx={{
                        border: '1px solid #CBD5E1',
                        '&:hover': { bgcolor: 'primary.main', color: '#FFFFFF' },
                      }}
                    >
                      <NextIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>

      {/* 6. SECTION TESTIMONIALS TỪ HỘI VIÊN */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#FFFFFF' }}>
        <Container maxWidth="xl">
          <SectionHeader
            badge="CẢM NHẬN HỘI VIÊN"
            title="Câu Chuyện Thay Đổi Vóc Dáng & Sức Khỏe"
            highlightTitle="Thực Tế"
            subtitle="Hơn 5.000 hội viên đã đạt được mục tiêu thể hình và năng lượng sống tích cực cùng AURA SPORT."
          />

          <Grid container spacing={3.5}>
            {testimonials.map((item) => (
              <Grid size={{ xs: 12, md: 4 }} key={item.id}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 4,
                    bgcolor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    position: 'relative',
                  }}
                >
                  <Stack direction="row" spacing={0.5} sx={{ mb: 2 }}>
                    {[...Array(item.rating)].map((_, i) => (
                      <StarIcon key={i} sx={{ color: '#FFB800', fontSize: 20 }} />
                    ))}
                  </Stack>

                  <Chip
                    label={`🏆 ${item.achievement}`}
                    size="small"
                    color="secondary"
                    sx={{
                      fontWeight: 700,
                      alignSelf: 'flex-start',
                      mb: 2,
                    }}
                  />

                  <Typography variant="body1" sx={{ color: 'text.primary', lineHeight: 1.7, fontStyle: 'italic', mb: 3, flexGrow: 1 }}>
                    "{item.comment}"
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, pt: 2, borderTop: '1px solid #E2E8F0' }}>
                    <Avatar src={item.avatar} alt={item.name} sx={{ width: 48, height: 48 }} />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                        {item.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.role} • {item.package}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 7. BOTTOM CTA BANNER */}
      <Box
        sx={{
          py: { xs: 8, md: 10 },
          background: 'linear-gradient(135deg, #1565C0 0%, #1976D2 50%, #FF6B35 100%)',
          color: '#FFFFFF',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" sx={{ fontWeight: 900, mb: 2, fontSize: { xs: '2rem', md: '2.8rem' } }}>
            Bắt Đầu Hành Trình Lột Xác Cùng AURA SPORT Ngay Hôm Nay
          </Typography>
          <Typography variant="body1" sx={{ color: '#E0F2FE', fontSize: '1.15rem', mb: 4, lineHeight: 1.6 }}>
            Đăng ký tài khoản ngay để nhận vé mời trải nghiệm 03 ngày tập luyện không giới hạn và nhận tư vấn chỉ số InBody miễn phí cùng chuyên gia.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button
              component={RouterLink}
              to="/register"
              variant="contained"
              sx={{
                bgcolor: '#FFFFFF',
                color: 'secondary.main',
                fontWeight: 800,
                fontSize: '1.05rem',
                py: 1.6,
                px: 4,
                '&:hover': { bgcolor: '#F1F5F9', color: '#E0531E' },
              }}
            >
              Đăng Ký Nhận Thẻ Tập Thử
            </Button>
            <Button
              component={RouterLink}
              to="/packages"
              variant="outlined"
              sx={{
                color: '#FFFFFF',
                borderColor: '#FFFFFF',
                fontWeight: 700,
                fontSize: '1rem',
                py: 1.6,
                px: 3.5,
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.15)' },
              }}
            >
              Xem Chi Tiết Bảng Giá
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Registration Modal */}
      <PackageModal
        open={packageModalOpen}
        onClose={() => setPackageModalOpen(false)}
        pkg={selectedPackage}
      />
    </Box>
  );
};

export default Home;
