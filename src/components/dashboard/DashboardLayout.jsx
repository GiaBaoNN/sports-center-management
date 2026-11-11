import React, { useState, useEffect } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Chip,
  Stack,
  Badge,
  Button,
  useTheme,
  useMediaQuery,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  CardMembership as MembershipIcon,
  FitnessCenter as FitnessCenterIcon,
  Notifications as NotificationsIcon,
  ContactSupport as SupportIcon,
  SportsKabaddi as CoachIcon,
  HowToReg as AttendanceIcon,
  Assignment as PlanIcon,
  PeopleAlt as PeopleIcon,
  PointOfSale as CashierIcon,
  AppRegistration as RegisterOnBehalfIcon,
  Assessment as ReportsIcon,
  ManageAccounts as AdminUsersIcon,
  Inventory2 as PackagesIcon,
  MeetingRoom as RoomIcon,
  HistoryEdu as AuditIcon,
  Home as HomeIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { Link as RouterLink, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { notificationApi } from '../../services/api';

const DRAWER_WIDTH = 270;

const roleConfig = {
  Member: {
    title: 'HỘI VIÊN (MEMBER)',
    color: '#1976D2',
    menuItems: [
      { text: 'Tổng Quan', path: '/member', icon: <DashboardIcon /> },
      { text: 'Hồ Sơ & Mật Khẩu', path: '/member/profile', icon: <PersonIcon /> },
      { text: 'Gói Tập & Hóa Đơn', path: '/member/memberships', icon: <MembershipIcon /> },
      { text: 'Lớp Học Đã Đăng Ký', path: '/member/classes', icon: <FitnessCenterIcon /> },
      { text: 'Kế Hoạch & Kết Quả Tập', path: '/member/training', icon: <PlanIcon /> },
      { text: 'Thông Báo', path: '/member/notifications', icon: <NotificationsIcon />, hasBadge: true },
      { text: 'Yêu Cầu Hỗ Trợ', path: '/member/support', icon: <SupportIcon /> },
    ],
  },
  Coach: {
    title: 'HUẤN LUYỆN VIÊN (COACH)',
    color: '#E0531E',
    menuItems: [
      { text: 'Tổng Quan', path: '/coach', icon: <DashboardIcon /> },
      { text: 'Lớp Học & Lịch Dạy', path: '/coach/classes', icon: <CoachIcon /> },
      { text: 'Điểm Danh Học Viên', path: '/coach/attendance', icon: <AttendanceIcon /> },
      { text: 'Kế Hoạch & Đánh Giá Tập', path: '/coach/training', icon: <PlanIcon /> },
    ],
  },
  Receptionist: {
    title: 'LỄ TÂN (RECEPTIONIST)',
    color: '#0284C7',
    menuItems: [
      { text: 'Bàn Làm Việc Lễ Tân', path: '/reception', icon: <DashboardIcon /> },
      { text: 'Tra Cứu & Tạo Hội Viên', path: '/reception/members', icon: <PeopleIcon /> },
      { text: 'Xác Nhận Tiền Mặt', path: '/reception/cashier', icon: <CashierIcon /> },
      { text: 'Đăng Ký Gói & Lớp Hộ', path: '/reception/on-behalf', icon: <RegisterOnBehalfIcon /> },
      { text: 'Xử Lý Hỗ Trợ Khách', path: '/reception/support', icon: <SupportIcon /> },
    ],
  },
  Manager: {
    title: 'QUẢN LÝ (MANAGER)',
    color: '#7C3AED',
    menuItems: [
      { text: 'Báo Cáo & Thống Kê', path: '/admin', icon: <ReportsIcon /> },
      { text: 'Quản Lý Tài Khoản', path: '/admin/users', icon: <AdminUsersIcon /> },
      { text: 'Quản Lý Gói Tập', path: '/admin/packages', icon: <PackagesIcon /> },
      { text: 'Quản Lý Lớp & Lịch', path: '/admin/classes', icon: <FitnessCenterIcon /> },
      { text: 'Môn Thể Thao & Phòng', path: '/admin/facilities', icon: <RoomIcon /> },
      { text: 'Toàn Bộ Thẻ Hội Viên', path: '/admin/memberships', icon: <MembershipIcon /> },
      { text: 'Xử Lý Yêu Cầu Hỗ Trợ', path: '/admin/support', icon: <SupportIcon /> },
      { text: 'Nhật Ký Hoạt Động', path: '/admin/audit-logs', icon: <AuditIcon /> },
    ],
  },
};

const DashboardLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const currentRole = user?.role || 'Member';
  const roleData = roleConfig[currentRole] || roleConfig.Member;

  useEffect(() => {
    // Fetch unread notifications count for header badge
    let mounted = true;
    notificationApi
      .getUnreadCount()
      .then((count) => {
        if (mounted) setUnreadCount(count || 0);
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, [location.pathname]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#0F172A', color: '#F8FAFC' }}>
      {/* Brand & Portal Header */}
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2.5,
            background: 'linear-gradient(135deg, #1976D2 0%, #FF6B35 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontWeight: 900,
          }}
        >
          <FitnessCenterIcon fontSize="small" />
        </Box>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 800, letterSpacing: '0.02em', lineHeight: 1.2 }}>
            AURA SPORT
          </Typography>
          <Typography variant="caption" sx={{ color: '#94A3B8', fontSize: '0.72rem' }}>
            SCMS PORTAL
          </Typography>
        </Box>
      </Box>

      {/* Role Badge Card */}
      <Box sx={{ px: 2, pb: 2 }}>
        <Box
          sx={{
            p: 1.8,
            borderRadius: 2.5,
            bgcolor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <Avatar
            sx={{
              bgcolor: roleData.color,
              color: '#FFFFFF',
              fontWeight: 800,
              width: 38,
              height: 38,
              fontSize: '0.95rem',
            }}
          >
            {user?.fullName?.charAt(0) || user?.username?.charAt(0) || 'U'}
          </Avatar>
          <Box sx={{ overflow: 'hidden' }}>
            <Typography variant="body2" sx={{ fontWeight: 700, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {user?.fullName || user?.username}
            </Typography>
            <Chip
              label={roleData.title}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.65rem',
                fontWeight: 800,
                bgcolor: roleData.color,
                color: '#FFFFFF',
                mt: 0.4,
              }}
            />
          </Box>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)' }} />

      {/* Navigation Menu */}
      <Box sx={{ flexGrow: 1, py: 1.5, overflowY: 'auto' }}>
        <List sx={{ px: 1.5 }}>
          {roleData.menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.6 }}>
                <ListItemButton
                  component={RouterLink}
                  to={item.path}
                  onClick={() => isMobile && setMobileOpen(false)}
                  sx={{
                    borderRadius: 2,
                    py: 1.1,
                    px: 1.8,
                    bgcolor: isActive ? 'rgba(255, 107, 53, 0.18)' : 'transparent',
                    color: isActive ? '#FF8A5B' : '#CBD5E1',
                    borderLeft: isActive ? '3px solid #FF6B35' : '3px solid transparent',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.08)',
                      color: '#FFFFFF',
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 36,
                      color: isActive ? '#FF8A5B' : '#94A3B8',
                    }}
                  >
                    {item.hasBadge && unreadCount > 0 ? (
                      <Badge badgeContent={unreadCount} color="error" max={99}>
                        {item.icon}
                      </Badge>
                    ) : (
                      item.icon
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: '0.88rem',
                      fontWeight: isActive ? 700 : 500,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)' }} />

      {/* Footer Navigation */}
      <Box sx={{ p: 2 }}>
        <Stack spacing={1}>
          <Button
            fullWidth
            component={RouterLink}
            to="/"
            variant="outlined"
            size="small"
            startIcon={<HomeIcon />}
            sx={{
              borderColor: 'rgba(255, 255, 255, 0.15)',
              color: '#94A3B8',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.82rem',
              justifyContent: 'flex-start',
              px: 1.5,
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.05)',
                color: '#FFFFFF',
                borderColor: 'rgba(255, 255, 255, 0.3)',
              },
            }}
          >
            Trang Chủ Trung Tâm
          </Button>

          <Button
            fullWidth
            onClick={handleLogout}
            variant="text"
            size="small"
            startIcon={<LogoutIcon />}
            sx={{
              color: '#EF4444',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.82rem',
              justifyContent: 'flex-start',
              px: 1.5,
              '&:hover': {
                bgcolor: 'rgba(239, 68, 68, 0.1)',
              },
            }}
          >
            Đăng Xuất
          </Button>
        </Stack>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F8FAFC' }}>
      {/* Top App Bar for Mobile / Tablet */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          bgcolor: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          color: '#0F172A',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', height: 68 }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F172A', display: { xs: 'none', sm: 'block' } }}>
              Trung Tâm Quản Lý & Rèn Luyện AURA SPORT
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1.5} alignItems="center">
            {currentRole === 'Member' && (
              <Tooltip title="Thông báo mới">
                <IconButton
                  component={RouterLink}
                  to="/member/notifications"
                  sx={{ color: '#64748B' }}
                >
                  <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
            )}

            <Chip
              label={roleData.title}
              size="small"
              sx={{
                bgcolor: 'rgba(25, 118, 210, 0.08)',
                color: roleData.color,
                fontWeight: 800,
                fontSize: '0.72rem',
              }}
            />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar
                sx={{
                  width: 34,
                  height: 34,
                  bgcolor: roleData.color,
                  fontSize: '0.85rem',
                  fontWeight: 800,
                }}
              >
                {user?.fullName?.charAt(0) || 'U'}
              </Avatar>
              <Typography variant="body2" sx={{ fontWeight: 700, display: { xs: 'none', sm: 'block' } }}>
                {user?.fullName || user?.username}
              </Typography>
            </Box>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Box component="nav" sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}>
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH, borderRight: 'none' },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Desktop Permanent Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH, borderRight: 'none' },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2.5, sm: 3, md: 4 },
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          mt: '68px',
          bgcolor: '#F8FAFC',
          minHeight: 'calc(100vh - 68px)',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
