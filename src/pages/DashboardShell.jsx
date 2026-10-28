import React from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Chip,
  Button,
  Stack,
  Avatar,
  Divider,
  Card,
  CardContent,
} from '@mui/material';
import {
  FitnessCenter as FitnessCenterIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  EventNote as EventNoteIcon,
  ReceiptLong as ReceiptIcon,
  Assessment as AssessmentIcon,
  Security as SecurityIcon,
  SupportAgent as SupportIcon,
  CalendarMonth as CalendarIcon,
  CheckCircle as CheckCircleIcon,
  SwapHoriz as SwitchIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth, ROLES, MOCK_ACCOUNTS } from '../context/AuthContext';

const DashboardShell = ({ roleKey }) => {
  const { user, roleConfig, switchRole } = useAuth();

  // Danh sách các phân hệ tính năng theo từng vai trò (dựa trên SCMS Screen Flow)
  const roleFeatures = {
    [ROLES.MEMBER]: [
      { title: 'Hồ Sơ & Thông Tin Cá Nhân', code: 'FE-01', desc: 'Xem và cập nhật thông tin cá nhân, số điện thoại, mật khẩu.', icon: <PeopleIcon /> },
      { title: 'Lịch Tập & Đặt Lớp Chính Thức', code: 'FE-09, FE-10, FE-11', desc: 'Xem thời khóa biểu, đăng ký lớp học và hủy giữ chỗ.', icon: <EventNoteIcon />, link: '/classes' },
      { title: 'Gói Hội Viên & Thanh Toán Online', code: 'FE-03, FE-04, FE-18', desc: 'Gia hạn gói tập, xem hạn dùng và thanh toán qua MoMo.', icon: <ReceiptIcon />, link: '/packages' },
      { title: 'Lịch Tập Cá Nhân (My Schedule)', code: 'FE-14', desc: 'Theo dõi các ca học đã được xác nhận trong tuần/tháng.', icon: <CalendarIcon />, link: '/classes' },
    ],
    [ROLES.COACH]: [
      { title: 'Lịch Dạy Giảng Dạy Cá Nhân', code: 'FE-12', desc: 'Xem ca dạy theo ngày/tuần, phòng tập và thông tin bộ môn.', icon: <CalendarIcon /> },
      { title: 'Danh Sách Học Viên & Điểm Danh', code: 'FE-12, FE-30', desc: 'Kiểm tra danh sách học viên trong lớp, ghi nhận có mặt/vắng.', icon: <CheckCircleIcon /> },
      { title: 'Kế Hoạch & Đánh Giá Tiến Độ', code: 'FE-28, FE-29', desc: 'Lập lộ trình bài tập, theo dõi chỉ số InBody và ghi nhận kết quả.', icon: <AssessmentIcon /> },
      { title: 'Thông Báo Bài Tập & Dặn Dò', code: 'FE-38', desc: 'Gửi dặn dò dinh dưỡng và bài tập về nhà cho học viên.', icon: <SupportIcon /> },
    ],
    [ROLES.RECEPTIONIST]: [
      { title: 'Tra Cứu & Check-in Hội Viên', code: 'FE-33, FE-35', desc: 'Tìm kiếm theo SĐT, họ tên, kiểm tra trạng thái thẻ ACTIVE/EXPIRED.', icon: <PeopleIcon /> },
      { title: 'Đăng Ký & Bán Gói Tại Quầy', code: 'FE-34', desc: 'Tạo tài khoản hội viên mới và kích hoạt gói trực tiếp.', icon: <ReceiptIcon /> },
      { title: 'Ghi Nhận Thu Tiền Mặt / POS', code: 'FE-19, FE-21, FE-22', desc: 'Xác nhận thanh toán, xuất và in hóa đơn/biên lai A4.', icon: <ReceiptIcon /> },
      { title: 'Đăng Ký / Hủy Lớp Hộ Khách', code: 'FE-36, FE-37', desc: 'Hỗ trợ hội viên đặt chỗ hoặc ghi nhận yêu cầu hỗ trợ/khiếu nại.', icon: <SupportIcon /> },
    ],
    [ROLES.CENTER_MANAGER]: [
      { title: 'Quản Trị Người Dùng Hệ Thống', code: 'FE-02', desc: 'Quản lý tài khoản Hội viên, Huấn luyện viên và Lễ tân.', icon: <PeopleIcon /> },
      { title: 'Cấu Hình Gói Tập, Bộ Môn & Phòng', code: 'FE-03, FE-07', desc: 'Thiết lập bảng giá gói, sức chứa phòng tập, môn thể thao.', icon: <FitnessCenterIcon /> },
      { title: 'Quản Lý Lớp Học & Phân Công HLV', code: 'FE-08, FE-13, FE-26', desc: 'Xếp lịch dạy, gán HLV phụ trách, kiểm tra trùng lịch.', icon: <EventNoteIcon /> },
      { title: 'Báo Cáo Doanh Thu & Hội Viên', code: 'FE-23, FE-24, FE-25', desc: 'Thống kê doanh thu theo thời gian, tỷ lệ lấp đầy lớp.', icon: <AssessmentIcon /> },
      { title: 'Phân Quyền & Nhật Ký Hoạt Động', code: 'FE-31, FE-32', desc: 'Cấp quyền vai trò RBAC và theo dõi audit logs hệ thống.', icon: <SecurityIcon /> },
    ],
  };

  const currentFeatures = roleFeatures[roleKey || user?.role] || [];

  return (
    <Box sx={{ py: { xs: 5, md: 8 }, bgcolor: 'background.default', minHeight: 'calc(100vh - 80px)' }}>
      <Container maxWidth="xl">
        {/* Welcome Profile Banner */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            border: '1px solid #E2E8F0',
            bgcolor: '#FFFFFF',
            mb: 4,
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid size={{ xs: 12, md: 8 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                <Avatar
                  src={user?.avatar}
                  alt={user?.fullName}
                  sx={{ width: { xs: 60, md: 76 }, height: { xs: 60, md: 76 }, border: '3px solid #E2E8F0' }}
                />
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                    <Typography variant="h5" sx={{ fontWeight: 800 }}>
                      Xin chào, {user?.fullName}!
                    </Typography>
                    <Chip
                      size="small"
                      label={roleConfig?.label}
                      color={roleConfig?.color || 'primary'}
                      sx={{ fontWeight: 800 }}
                    />
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    SĐT: <strong>{user?.phone}</strong> • Email: {user?.email}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600, display: 'block', mt: 0.5 }}>
                    {roleConfig?.description}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Quick Role Switcher for Testing/Demo */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 3, border: '1px dashed #CBD5E1' }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                  <SwitchIcon fontSize="small" /> CHUYỂN VAI TRÒ NHANH (DEMO / TEST):
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {MOCK_ACCOUNTS.map((acc) => (
                    <Button
                      key={acc.role}
                      size="small"
                      variant={user?.role === acc.role ? 'contained' : 'outlined'}
                      color={acc.role === ROLES.CENTER_MANAGER ? 'error' : acc.role === ROLES.COACH ? 'secondary' : acc.role === ROLES.RECEPTIONIST ? 'warning' : 'primary'}
                      onClick={() => switchRole(acc.role)}
                      sx={{ fontSize: '0.7rem', py: 0.4 }}
                    >
                      {acc.role === ROLES.MEMBER ? 'Hội Viên' : acc.role === ROLES.COACH ? 'Huấn Luyện Viên' : acc.role === ROLES.RECEPTIONIST ? 'Lễ Tân' : 'Quản Lý'}
                    </Button>
                  ))}
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Section Title */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Phân Hệ Chức Năng Dành Cho {roleConfig?.label?.toUpperCase()} (SCMS)
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Các màn hình nghiệp vụ tương ứng theo tài liệu Screen Flow và Swimlane SCMS
          </Typography>
        </Box>

        {/* Features Grid */}
        <Grid container spacing={3}>
          {currentFeatures.map((feat, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 6, lg: 3 }} key={index}>
              <Card
                sx={{
                  height: '100%',
                  borderRadius: 3.5,
                  border: '1px solid #E2E8F0',
                  boxShadow: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: 'primary.main',
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.06)',
                  },
                }}
              >
                <CardContent sx={{ p: 3, flexGrow: 1 }}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2.5,
                      bgcolor: 'rgba(25, 118, 210, 0.08)',
                      color: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                    }}
                  >
                    {feat.icon}
                  </Box>
                  <Chip
                    size="small"
                    label={feat.code}
                    sx={{ fontWeight: 800, fontSize: '0.65rem', mb: 1, bgcolor: '#F1F5F9' }}
                  />
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1, lineHeight: 1.3 }}>
                    {feat.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {feat.desc}
                  </Typography>
                </CardContent>

                {feat.link && (
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Button
                      component={RouterLink}
                      to={feat.link}
                      fullWidth
                      variant="outlined"
                      size="small"
                      sx={{ fontWeight: 700 }}
                    >
                      Truy Cập Tính Năng
                    </Button>
                  </Box>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default DashboardShell;
