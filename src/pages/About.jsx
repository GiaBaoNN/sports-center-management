import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Paper,
  Stack,
  Chip,
  Button,
  Divider,
} from '@mui/material';
import {
  EmojiEvents as TrophyIcon,
  Visibility as VisionIcon,
  TrackChanges as MissionIcon,
  Favorite as HeartIcon,
  Star as StarIcon,
  FitnessCenter as FitnessCenterIcon,
  Shield as ShieldIcon,
  Groups as GroupsIcon,
  Psychology as MindIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import SectionHeader from '../components/common/SectionHeader';
import { companyTimeline, leadershipTeam, centerStats } from '../data/sportsData';

const coreValues = [
  {
    icon: <TrophyIcon sx={{ fontSize: 32 }} />,
    color: '#FF6B35',
    title: 'Chất Lượng Vượt Trội',
    desc: 'Cam kết 100% trang thiết bị nhập khẩu chính hãng từ Ý và Mỹ, bảo dưỡng định kỳ và nâng cấp công nghệ liên tục.',
  },
  {
    icon: <HeartIcon sx={{ fontSize: 32 }} />,
    color: '#D32F2F',
    title: 'Tận Tâm Đồng Hành',
    desc: 'Mỗi hội viên là một câu chuyện riêng. Chúng tôi lắng nghe mục tiêu cá nhân và đồng hành từng bữa ăn, buổi tập.',
  },
  {
    icon: <MindIcon sx={{ fontSize: 32 }} />,
    color: '#1976D2',
    title: 'Đột Phá & Khoa Học',
    desc: 'Áp dụng các giáo trình huấn luyện chuẩn quốc tế kết hợp phân tích chỉ số y sinh học để tối ưu hóa kết quả tập luyện.',
  },
  {
    icon: <GroupsIcon sx={{ fontSize: 32 }} />,
    color: '#2E7D32',
    title: 'Cộng Đồng Tích Cực',
    desc: 'Xây dựng một môi trường văn minh, truyền cảm hứng sống lành mạnh và chia sẻ năng lượng tích cực mỗi ngày.',
  },
];

const About = () => {
  return (
    <Box sx={{ overflow: 'hidden' }}>
      {/* 1. HERO BANNER */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          background: 'linear-gradient(135deg, #09122C 0%, #11224D 100%)',
          color: '#FFFFFF',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <Container maxWidth="md">
          <Chip
            label="VỀ CHÚNG TÔI"
            sx={{
              bgcolor: 'rgba(255, 107, 53, 0.15)',
              color: '#FF8A5B',
              fontWeight: 800,
              fontSize: '0.8rem',
              letterSpacing: '0.08em',
              mb: 2,
              border: '1px solid rgba(255, 107, 53, 0.3)',
            }}
          />
          <Typography variant="h2" sx={{ fontWeight: 900, mb: 2.5, fontSize: { xs: '2.2rem', md: '3.4rem' } }}>
            Kiến Tạo Phong Cách Sống Khỏe & <br />
            <Box
              component="span"
              sx={{
                background: 'linear-gradient(135deg, #FF6B35 0%, #FFA07A 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Thể Lực Đỉnh Cao
            </Box>
          </Typography>
          <Typography variant="body1" sx={{ color: '#CBD5E1', fontSize: { xs: '1.05rem', md: '1.2rem' }, lineHeight: 1.8 }}>
            AURA SPORT được thành lập với sứ mệnh định nghĩa lại chuẩn mực trung tâm thể thao tại Việt Nam — nơi kết hợp hoàn hảo giữa cơ sở vật chất đẳng cấp quốc tế và dịch vụ chăm sóc sức khỏe toàn diện.
          </Typography>
        </Container>
      </Box>

      {/* 2. STATS BAR */}
      <Box sx={{ bgcolor: '#FFFFFF', py: 5, borderBottom: '1px solid #E2E8F0' }}>
        <Container maxWidth="xl">
          <Grid container spacing={3} justifyContent="center">
            {centerStats.map((stat, idx) => (
              <Grid size={{ xs: 6, sm: 3 }} key={idx} sx={{ textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 900, color: 'primary.main', mb: 0.5 }}>
                  {stat.value}
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  {stat.label}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {stat.note}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 3. SỨ MỆNH & TẦM NHÌN */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.default' }}>
        <Container maxWidth="xl">
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=900&auto=format&fit=crop"
                alt="Gym Mission"
                sx={{
                  width: '100%',
                  borderRadius: 5,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  height: { xs: 320, md: 440 },
                  objectFit: 'cover',
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <SectionHeader
                align="left"
                badge="TẦM NHÌN & SỨ MỆNH"
                title="Định Hình Tương Lai Thể Thao & Sức Khỏe"
                subtitle="Tại AURA SPORT, chúng tôi tin rằng sức khỏe thể chất là nền tảng vững chắc nhất cho mọi thành công trong cuộc sống."
                sx={{ mb: 4 }}
              />

              <Stack spacing={3}>
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 2,
                        bgcolor: 'rgba(25, 118, 210, 0.1)',
                        color: 'primary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <VisionIcon />
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
                        Tầm Nhìn 2030
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                        Trở thành hệ sinh thái thể thao và chăm sóc sức khỏe chủ động hàng đầu Việt Nam, phục vụ hơn 50.000 hội viên và mở rộng chuỗi 15 trung tâm chuẩn 5 sao trên cả nước.
                      </Typography>
                    </Box>
                  </Box>
                </Paper>

                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, bgcolor: '#FFFFFF', border: '1px solid #E2E8F0' }}>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 2,
                        bgcolor: 'rgba(255, 107, 53, 0.1)',
                        color: 'secondary.main',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <MissionIcon />
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
                        Sứ Mệnh Phụng Sự
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                        Mang đến trải nghiệm luyện tập khoa học, an toàn và tràn đầy cảm hứng; đồng hành cùng người Việt kiến tạo thói quen sống năng động, giải tỏa áp lực và bứt phá giới hạn bản thân.
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 4. GIÁ TRỊ CỐT LÕI (CORE VALUES) */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#FFFFFF' }}>
        <Container maxWidth="xl">
          <SectionHeader
            badge="TRIẾT LÝ HOẠT ĐỘNG"
            title="4 Giá Trị Cốt Lõi Tạo Nên Sự Khác Biệt"
            subtitle="Mọi dịch vụ và nụ cười tại AURA SPORT đều xuất phát từ những nguyên tắc vững chắc này."
          />

          <Grid container spacing={3.5}>
            {coreValues.map((val, idx) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    height: '100%',
                    borderRadius: 4,
                    bgcolor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: '0 16px 30px rgba(0,0,0,0.06)',
                      bgcolor: '#FFFFFF',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 3,
                      bgcolor: `${val.color}15`,
                      color: val.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2.5,
                    }}
                  >
                    {val.icon}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5 }}>
                    {val.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {val.desc}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 5. TIMELINE HOẠT ĐỘNG (LỊCH SỬ PHÁT TRIỂN) */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#F8FAFC' }}>
        <Container maxWidth="lg">
          <SectionHeader
            badge="HÀNH TRÌNH PHÁT TRIỂN"
            title="Các Cột Mốc Đáng Tự Hào"
            highlightTitle="2019 - 2026"
            subtitle="Từ một phòng gym chuẩn quốc tế đầu tiên đến chuỗi tổ hợp thể thao cao cấp hàng đầu."
          />

          <Stack spacing={3}>
            {companyTimeline.map((item, idx) => (
              <Paper
                key={idx}
                elevation={0}
                sx={{
                  p: { xs: 3, md: 4 },
                  borderRadius: 4,
                  bgcolor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: { xs: 'flex-start', sm: 'center' },
                  gap: 3,
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: '0 10px 25px rgba(25, 118, 210, 0.08)',
                  },
                }}
              >
                <Box
                  sx={{
                    px: 2.5,
                    py: 1,
                    borderRadius: 3,
                    bgcolor: 'primary.main',
                    color: '#FFFFFF',
                    fontWeight: 900,
                    fontSize: '1.25rem',
                    textAlign: 'center',
                    minWidth: 100,
                  }}
                >
                  {item.year}
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5, color: 'text.primary' }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {item.description}
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* 6. BAN LÃNH ĐẠO & ĐỘI NGŨ CHUYÊN MÔN */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#FFFFFF' }}>
        <Container maxWidth="xl">
          <SectionHeader
            badge="BAN ĐIỀU HÀNH"
            title="Đội Ngũ Lãnh Đạo & Cố Vấn Chuyên Môn"
            subtitle="Những chuyên gia tận tâm với hơn 15 năm kinh nghiệm trong ngành quản lý thể thao và y học vận động."
          />

          <Grid container spacing={3.5}>
            {leadershipTeam.map((leader, idx) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 4,
                    overflow: 'hidden',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: '0 16px 30px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    height="300"
                    image={leader.image}
                    alt={leader.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ p: 3, flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
                      {leader.name}
                    </Typography>
                    <Typography variant="subtitle2" color="secondary.main" sx={{ fontWeight: 700, mb: 1.5 }}>
                      {leader.role}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {leader.bio}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default About;
