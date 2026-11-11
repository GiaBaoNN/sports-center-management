import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Divider,
  Stack,
  Avatar,
  Chip,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Person as PersonIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Badge as BadgeIcon,
  Visibility,
  VisibilityOff,
  Save as SaveIcon,
  CheckCircle as SuccessIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { userApi } from '../../services/api';

const MemberProfile = () => {
  const { user, login } = useAuth();
  const [profileLoading, setProfileLoading] = useState(true);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [changingPass, setChangingPass] = useState(false);

  const [profileData, setProfileData] = useState({
    username: '',
    fullName: '',
    email: '',
    phone: '',
    role: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');
  const [passError, setPassError] = useState('');

  useEffect(() => {
    let isMounted = true;
    userApi
      .getProfile()
      .then((data) => {
        if (!isMounted) return;
        setProfileData({
          username: data.username || '',
          fullName: data.fullName || '',
          email: data.email || '',
          phone: data.phone || '',
          role: data.role || 'Member',
        });
      })
      .catch((err) => {
        if (isMounted) setProfileError(err.message || 'Không thể tải thông tin hồ sơ.');
      })
      .finally(() => {
        if (isMounted) setProfileLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
    setProfileSuccess('');
    setProfileError('');
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    setPassSuccess('');
    setPassError('');
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdatingProfile(true);
    setProfileSuccess('');
    setProfileError('');

    try {
      const updated = await userApi.updateProfile({
        fullName: profileData.fullName.trim(),
        email: profileData.email?.trim() || null,
        phone: profileData.phone.trim(),
        username: profileData.username.trim(),
      });
      setProfileSuccess('Cập nhật hồ sơ thành công!');
    } catch (err) {
      setProfileError(err.message || 'Cập nhật hồ sơ thất bại.');
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPassSuccess('');
    setPassError('');

    if (passwordData.newPassword.length < 6) {
      setPassError('Mật khẩu mới phải từ 6 ký tự trở lên.');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPassError('Mật khẩu xác nhận không khớp với mật khẩu mới.');
      return;
    }

    setChangingPass(true);
    try {
      await userApi.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPassSuccess('Đổi mật khẩu thành công! Hãy ghi nhớ mật khẩu mới của bạn.');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPassError(err.message || 'Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu hiện tại.');
    } finally {
      setChangingPass(false);
    }
  };

  if (profileLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          Hồ Sơ & Cài Đặt Bảo Mật
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Quản lý thông tin định danh cá nhân và thiết lập mật khẩu truy cập hệ thống SCMS.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Left Column: Profile Card & Information */}
        <Grid item xs={12} md={7}>
          <Paper elevation={0} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 3, border: '1px solid #E2E8F0' }}>
            <Stack direction="row" spacing={2.5} alignItems="center" sx={{ mb: 3 }}>
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  bgcolor: 'primary.main',
                  fontSize: '1.5rem',
                  fontWeight: 800,
                }}
              >
                {profileData.fullName?.charAt(0) || profileData.username?.charAt(0) || 'U'}
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  {profileData.fullName || profileData.username}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  @{profileData.username} | SĐT: {profileData.phone}
                </Typography>
                <Chip label={`Vai trò: ${profileData.role}`} size="small" color="primary" sx={{ fontWeight: 700 }} />
              </Box>
            </Stack>

            <Divider sx={{ mb: 3 }} />

            {profileSuccess && (
              <Alert severity="success" icon={<SuccessIcon />} sx={{ mb: 3 }}>
                {profileSuccess}
              </Alert>
            )}
            {profileError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {profileError}
              </Alert>
            )}

            <Box component="form" onSubmit={handleUpdateProfile}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Tên đăng nhập (Username)"
                    name="username"
                    value={profileData.username}
                    onChange={handleProfileChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BadgeIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Họ và tên"
                    name="fullName"
                    value={profileData.fullName}
                    onChange={handleProfileChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Số điện thoại"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleProfileChange}
                    required
                    helperText="Số điện thoại dùng để đăng nhập"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Địa chỉ Email"
                    name="email"
                    type="email"
                    value={profileData.email}
                    onChange={handleProfileChange}
                    placeholder="name@domain.com"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={updatingProfile}
                  startIcon={updatingProfile ? <CircularProgress size={18} /> : <SaveIcon />}
                  sx={{ fontWeight: 700, px: 3 }}
                >
                  {updatingProfile ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Right Column: Password Change Form */}
        <Grid item xs={12} md={5}>
          <Paper elevation={0} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 3, border: '1px solid #E2E8F0' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
              Đổi Mật Khẩu
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Cập nhật mật khẩu định kỳ để bảo vệ tài khoản hội viên của bạn.
            </Typography>

            {passSuccess && (
              <Alert severity="success" sx={{ mb: 2.5 }}>
                {passSuccess}
              </Alert>
            )}
            {passError && (
              <Alert severity="error" sx={{ mb: 2.5 }}>
                {passError}
              </Alert>
            )}

            <Box component="form" onSubmit={handleChangePassword}>
              <Stack spacing={2.5}>
                <TextField
                  fullWidth
                  required
                  type={showCurrent ? 'text' : 'password'}
                  label="Mật khẩu hiện tại"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowCurrent(!showCurrent)} edge="end" size="small">
                          {showCurrent ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  required
                  type={showNew ? 'text' : 'password'}
                  label="Mật khẩu mới (tối thiểu 6 ký tự)"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowNew(!showNew)} edge="end" size="small">
                          {showNew ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  required
                  type="password"
                  label="Xác nhận mật khẩu mới"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  variant="outlined"
                  color="primary"
                  disabled={changingPass}
                  sx={{ py: 1.2, fontWeight: 700 }}
                >
                  {changingPass ? <CircularProgress size={18} /> : 'Xác Nhận Đổi Mật Khẩu'}
                </Button>
              </Stack>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MemberProfile;
