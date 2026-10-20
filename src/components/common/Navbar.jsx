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
} from '@mui/material';
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  FitnessCenter as FitnessCenterIcon,
  PhoneInTalk as PhoneIcon,
  Login as LoginIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import { Link as RouterLink, useLocation } from 'react-router-dom';

const navItems = [
  { label: 'Trang Chủ', path: '/' },
  { label: 'Gói Hội Viên', path: '/packages' },
  { label: 'Lịch Lớp Học', path: '/classes' },
  { label: 'Về Chúng Tôi', path: '/about' },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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

        <List sx={{ mb: 3 }}>
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

        <Divider sx={{ mb: 3 }} />

        {/* Mobile Hotline & CTAs */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, px: 1 }}>
          <PhoneIcon sx={{ color: 'primary.main' }} />
          <Box>
            <Typography variant="caption" color="text.secondary">
              Hotline hỗ trợ 24/7:
            </Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              1900 8888 (Miễn phí)
            </Typography>
          </Box>
        </Box>

        <Stack spacing={1.5} sx={{ mt: 'auto' }}>
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
        </Stack>
      </Drawer>
    </>
  );
};

export default Navbar;
