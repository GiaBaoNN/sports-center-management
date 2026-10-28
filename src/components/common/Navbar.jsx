import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Stack,
  useTheme,
  useMediaQuery,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  FitnessCenter as FitnessCenterIcon,
  PhoneInTalk as PhoneIcon,
  Login as LoginIcon,
  PersonAdd as PersonAddIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  AccountCircle as AccountCircleIcon,
  SwapHoriz as SwitchIcon,
  EventNote as EventNoteIcon,
} from '@mui/icons-material';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth, ROLES, ROLE_CONFIG, MOCK_ACCOUNTS } from '../../context/AuthContext';

const navItems = [
  { label: 'Trang Chủ', path: '/' },
  { label: 'Gói Hội Viên', path: '/packages' },
  { label: 'Lịch Lớp Học', path: '/classes' },
  { label: 'Về Chúng Tôi', path: '/about' },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { user, isAuthenticated, roleConfig, logout, switchRole } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  const handleUserMenuOpen = (e) => {
    setUserMenuAnchor(e.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = () => {
    handleUserMenuClose();
    logout();
    navigate('/login');
  };

  const handleSwitchRole = (role) => {
    switchRole(role);
    handleUserMenuClose();
    const targetConfig = ROLE_CONFIG[role];
    if (targetConfig) {
      navigate(targetConfig.dashboardPath);
    }
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={scrolled ? 4 : 0}
        sx={{
          backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.95)' : '#FFFFFF',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: '1px solid',
          borderColor: scrolled ? 'rgba(0, 0, 0, 0.08)' : 'rgba(0, 0, 0, 0.05)',
          transition: 'all 0.3s ease',
          top: 0,
          zIndex: 1100,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ height: { xs: 70, md: 80 } }}>
            {/* Logo */}
            <Box
              component={RouterLink}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                gap: 1.5,
              }}
            >
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
                  boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
                }}
              >
                <FitnessCenterIcon sx={{ fontSize: 26 }} />
              </Box>
              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 900,
                    letterSpacing: '-0.02em',
                    color: '#0F172A',
                    lineHeight: 1.1,
                    fontSize: { xs: '1.25rem', sm: '1.45rem' },
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                >
                  AURA
                  <Box component="span" sx={{ color: 'secondary.main' }}>
                    SPORT
                  </Box>
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    color: 'text.secondary',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    display: 'block',
                  }}
                >
                  Fitness & Wellness Club
                </Typography>
              </Box>
            </Box>

            {/* Desktop Navigation Links */}
            {!isMobile && (
              <Box
                sx={{
                  display: 'flex',
                  gap: 1,
                  mx: 'auto',
                }}
              >
                {navItems.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <Button
                      key={item.label}
                      component={RouterLink}
                      to={item.path}
                      sx={{
                        color: active ? 'primary.main' : 'text.primary',
                        fontWeight: active ? 700 : 600,
                        fontSize: '0.95rem',
                        position: 'relative',
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        '&:hover': {
                          backgroundColor: 'rgba(25, 118, 210, 0.06)',
                          color: 'primary.main',
                        },
                        '&::after': active
                          ? {
                              content: '""',
                              position: 'absolute',
                              bottom: 4,
                              left: '20%',
                              width: '60%',
                              height: 3,
                              borderRadius: 2,
                              backgroundColor: 'secondary.main',
                            }
                          : {},
                      }}
                    >
                      {item.label}
                    </Button>
                  );
                })}
              </Box>
            )}

            {/* Desktop Right Actions */}
            {!isMobile && (
              <Stack direction="row" spacing={1.5} alignItems="center">
                {/* Unauthenticated State */}
                {!isAuthenticated ? (
                  <>
                    <Box
                      sx={{
                        display: { xs: 'none', lg: 'flex' },
                        alignItems: 'center',
                        gap: 0.8,
                        mr: 1,
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 3,
                        bgcolor: 'rgba(25, 118, 210, 0.05)',
                      }}
                    >
                      <PhoneIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                      <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                        1900 8888
                      </Typography>
                    </Box>

                    <Button
                      component={RouterLink}
                      to="/login"
                      variant="outlined"
                      color="primary"
                      startIcon={<LoginIcon sx={{ fontSize: 18 }} />}
                      sx={{
                        fontWeight: 600,
                        borderColor: 'rgba(25, 118, 210, 0.3)',
                        '&:hover': {
                          borderColor: 'primary.main',
                          bgcolor: 'rgba(25, 118, 210, 0.04)',
                        },
                      }}
                    >
                      Đăng Nhập
                    </Button>

                    <Button
                      component={RouterLink}
                      to="/register"
                      variant="contained"
                      color="secondary"
                      startIcon={<PersonAddIcon sx={{ fontSize: 18 }} />}
                      sx={{
                        fontWeight: 700,
                        boxShadow: '0 4px 14px rgba(255, 107, 53, 0.35)',
                        '&:hover': {
                          boxShadow: '0 6px 20px rgba(255, 107, 53, 0.45)',
                        },
                      }}
                    >
                      Đăng Ký Ngay
                    </Button>
                  </>
                ) : (
                  /* Authenticated State */
                  <>
                    {/* Quick Link to Role Dashboard */}
                    <Button
                      component={RouterLink}
                      to={roleConfig?.dashboardPath || '/'}
                      variant="contained"
                      color={roleConfig?.color || 'primary'}
                      size="small"
                      startIcon={<DashboardIcon />}
                      sx={{
                        fontWeight: 700,
                        px: 2,
                        py: 0.8,
                        borderRadius: 2.5,
                      }}
                    >
                      Bàn Làm Việc ({roleConfig?.shortLabel})
                    </Button>

                    {/* User Profile Avatar & Menu Trigger */}
                    <Box
                      onClick={handleUserMenuOpen}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.2,
                        p: 0.5,
                        pr: 1.5,
                        borderRadius: 4,
                        cursor: 'pointer',
                        border: '1px solid #E2E8F0',
                        bgcolor: '#F8FAFC',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: '#F1F5F9',
                          borderColor: '#CBD5E1',
                        },
                      }}
                    >
                      <Avatar
                        src={user.avatar}
                        alt={user.fullName}
                        sx={{
                          width: 36,
                          height: 36,
                          border: '2px solid',
                          borderColor: roleConfig?.badgeColor || '#1976D2',
                        }}
                      />
                      <Box sx={{ textAlign: 'left' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                          {user.fullName}
                        </Typography>
                        <Chip
                          size="small"
                          label={roleConfig?.label}
                          sx={{
                            height: 18,
                            fontSize: '0.62rem',
                            fontWeight: 800,
                            bgcolor: 'rgba(0,0,0,0.06)',
                            color: roleConfig?.badgeColor,
                            px: 0.5,
                          }}
                        />
                      </Box>
                    </Box>

                    {/* Dropdown Menu */}
                    <Menu
                      anchorEl={userMenuAnchor}
                      open={Boolean(userMenuAnchor)}
                      onClose={handleUserMenuClose}
                      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                      PaperProps={{
                        sx: {
                          width: 280,
                          borderRadius: 3,
                          p: 1,
                          boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
                          border: '1px solid #E2E8F0',
                        },
                      }}
                    >
                      {/* User Info Header */}
                      <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #F1F5F9' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                          {user.fullName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                          SĐT: {user.phone}
                        </Typography>
                        <Chip
                          size="small"
                          label={roleConfig?.label}
                          color={roleConfig?.color || 'primary'}
                          sx={{ mt: 0.8, fontWeight: 700, fontSize: '0.7rem' }}
                        />
                      </Box>

                      {/* Role Dashboard Link */}
                      <MenuItem
                        component={RouterLink}
                        to={roleConfig?.dashboardPath || '/'}
                        onClick={handleUserMenuClose}
                        sx={{ my: 0.5, borderRadius: 2 }}
                      >
                        <ListItemIcon>
                          <DashboardIcon fontSize="small" color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Bàn Làm Việc / Dashboard"
                          primaryTypographyProps={{ fontWeight: 700, fontSize: '0.9rem' }}
                        />
                      </MenuItem>

                      {/* Class Booking shortcut */}
                      <MenuItem
                        component={RouterLink}
                        to="/classes"
                        onClick={handleUserMenuClose}
                        sx={{ my: 0.5, borderRadius: 2 }}
                      >
                        <ListItemIcon>
                          <EventNoteIcon fontSize="small" color="secondary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Lịch Lớp Học & Đặt Chỗ"
                          primaryTypographyProps={{ fontWeight: 600, fontSize: '0.9rem' }}
                        />
                      </MenuItem>

                      <Divider sx={{ my: 1 }} />

                      {/* Switch Role Demo Options */}
                      <Box sx={{ px: 2, py: 0.5 }}>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <SwitchIcon sx={{ fontSize: 14 }} /> ĐỔI VAI TRÒ TEST (DEMO):
                        </Typography>
                        <Stack spacing={0.6} sx={{ mt: 1 }}>
                          {MOCK_ACCOUNTS.map((acc) => (
                            <Button
                              key={acc.role}
                              size="small"
                              variant={user.role === acc.role ? 'contained' : 'text'}
                              color={acc.role === ROLES.CENTER_MANAGER ? 'error' : acc.role === ROLES.COACH ? 'secondary' : acc.role === ROLES.RECEPTIONIST ? 'warning' : 'primary'}
                              onClick={() => handleSwitchRole(acc.role)}
                              sx={{
                                justifyContent: 'flex-start',
                                fontSize: '0.75rem',
                                py: 0.4,
                                textTransform: 'none',
                                fontWeight: user.role === acc.role ? 800 : 500,
                              }}
                            >
                              {acc.role === ROLES.MEMBER ? '👤 Hội Viên (Member)' : acc.role === ROLES.COACH ? '🏋️ Huấn Luyện Viên (Coach)' : acc.role === ROLES.RECEPTIONIST ? '🧑💼 Lễ Tân (Receptionist)' : '👔 Quản Lý (Center Manager)'}
                            </Button>
                          ))}
                        </Stack>
                      </Box>

                      <Divider sx={{ my: 1 }} />

                      {/* Logout Action */}
                      <MenuItem onClick={handleLogout} sx={{ borderRadius: 2, color: 'error.main' }}>
                        <ListItemIcon>
                          <LogoutIcon fontSize="small" color="error" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Đăng Xuất Phiên"
                          primaryTypographyProps={{ fontWeight: 700, fontSize: '0.9rem' }}
                        />
                      </MenuItem>
                    </Menu>
                  </>
                )}
              </Stack>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="end"
                onClick={handleDrawerToggle}
                sx={{
                  color: 'text.primary',
                  ml: 'auto',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                }}
              >
                <MenuIcon />
              </IconButton>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        PaperProps={{
          sx: {
            width: { xs: '85%', sm: 360 },
            p: 3,
            bgcolor: '#FFFFFF',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #1976D2 0%, #FF6B35 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
              }}
            >
              <FitnessCenterIcon sx={{ fontSize: 22 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              AURA <span style={{ color: '#FF6B35' }}>SPORT</span>
            </Typography>
          </Box>
          <IconButton onClick={handleDrawerToggle} edge="end">
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* User Card if Authenticated (Mobile) */}
        {isAuthenticated && (
          <Box sx={{ p: 2, bgcolor: '#F8FAFC', borderRadius: 3, border: '1px solid #E2E8F0', mb: 2.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
              <Avatar
                src={user.avatar}
                alt={user.fullName}
                sx={{ width: 44, height: 44, border: '2px solid', borderColor: roleConfig?.badgeColor }}
              />
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                  {user.fullName}
                </Typography>
                <Chip
                  size="small"
                  label={roleConfig?.label}
                  color={roleConfig?.color || 'primary'}
                  sx={{ height: 20, fontSize: '0.65rem', fontWeight: 800 }}
                />
              </Box>
            </Box>
            <Button
              component={RouterLink}
              to={roleConfig?.dashboardPath || '/'}
              fullWidth
              variant="contained"
              color={roleConfig?.color || 'primary'}
              size="small"
              onClick={handleDrawerToggle}
              startIcon={<DashboardIcon />}
              sx={{ fontWeight: 700 }}
            >
              Vào Dashboard ({roleConfig?.shortLabel})
            </Button>
          </Box>
        )}

        {/* Navigation list */}
        <List sx={{ mb: 2 }}>
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <ListItem key={item.label} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  component={RouterLink}
                  to={item.path}
                  onClick={handleDrawerToggle}
                  sx={{
                    borderRadius: 2,
                    backgroundColor: active ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
                    color: active ? 'primary.main' : 'text.primary',
                    fontWeight: active ? 700 : 500,
                  }}
                >
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: active ? 700 : 600,
                      color: active ? 'primary.main' : 'text.primary',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        <Divider sx={{ mb: 2 }} />

        {/* Mobile Role Switcher for Demo */}
        {isAuthenticated && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', display: 'block', mb: 1 }}>
              ⚡ CHUYỂN VAI TRÒ TEST (DEMO):
            </Typography>
            <Stack spacing={0.8}>
              {MOCK_ACCOUNTS.map((acc) => (
                <Button
                  key={acc.role}
                  size="small"
                  variant={user.role === acc.role ? 'contained' : 'outlined'}
                  color={acc.role === ROLES.CENTER_MANAGER ? 'error' : acc.role === ROLES.COACH ? 'secondary' : acc.role === ROLES.RECEPTIONIST ? 'warning' : 'primary'}
                  onClick={() => {
                    handleSwitchRole(acc.role);
                    handleDrawerToggle();
                  }}
                  sx={{ justifyContent: 'flex-start', fontSize: '0.75rem', py: 0.5 }}
                >
                  {acc.role === ROLES.MEMBER ? 'Hội Viên' : acc.role === ROLES.COACH ? 'Huấn Luyện Viên' : acc.role === ROLES.RECEPTIONIST ? 'Lễ Tân' : 'Quản Lý'}
                </Button>
              ))}
            </Stack>
          </Box>
        )}

        {/* Mobile Action Buttons */}
        <Stack spacing={1.5} sx={{ mt: 'auto' }}>
          {!isAuthenticated ? (
            <>
              <Button
                component={RouterLink}
                to="/login"
                variant="outlined"
                fullWidth
                onClick={handleDrawerToggle}
                startIcon={<LoginIcon />}
                sx={{ py: 1.2 }}
              >
                Đăng Nhập
              </Button>
              <Button
                component={RouterLink}
                to="/register"
                variant="contained"
                color="secondary"
                fullWidth
                onClick={handleDrawerToggle}
                startIcon={<PersonAddIcon />}
                sx={{ py: 1.2 }}
              >
                Đăng Ký Hội Viên Mới
              </Button>
            </>
          ) : (
            <Button
              variant="outlined"
              color="error"
              fullWidth
              onClick={() => {
                handleLogout();
                handleDrawerToggle();
              }}
              startIcon={<LogoutIcon />}
              sx={{ py: 1.2, fontWeight: 700 }}
            >
              Đăng Xuất
            </Button>
          )}
        </Stack>
      </Drawer>
    </>
  );
};

export default Navbar;
