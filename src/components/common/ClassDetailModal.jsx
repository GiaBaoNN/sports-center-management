import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Grid,
  Chip,
  Button,
  Avatar,
  Divider,
  Alert,
  Stack,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Close as CloseIcon,
  Room as RoomIcon,
  FitnessCenter as FitnessCenterIcon,
  CheckCircle as CheckCircleIcon,
  CalendarMonth as CalendarIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Login as LoginIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { classApi } from '../../services/api';

const ClassDetailModal = ({ open, onClose, classItem, onRegistrationSuccess }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isMember } = useAuth();

  const [schedules, setSchedules] = useState([]);
  const [loadingSchedules, setLoadingSchedules] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [registrationResult, setRegistrationResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch real schedules from backend when modal opens
  useEffect(() => {
    if (open && classItem?.id) {
      setRegistrationResult(null);
      setErrorMessage('');
      setLoadingSchedules(true);

      classApi
        .getSchedules(classItem.id)
        .then((data) => {
          setSchedules(data || []);
        })
        .catch((err) => {
          console.warn('Could not load schedules from backend:', err);
          setSchedules([]);
        })
        .finally(() => {
          setLoadingSchedules(false);
        });
    }
  }, [open, classItem]);

  if (!classItem) return null;

  const handleRegister = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/classes' } });
      return;
    }

    if (!isMember) {
      setErrorMessage(
        `Tài khoản hiện tại có vai trò "${user?.role}". Theo quy định hệ thống SCMS, chỉ tài khoản "Member" mới có quyền đăng ký tham gia lớp học.`
      );
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      // Backend Contract: POST /api/classes/:classId/register
      // Authenticated via Authorization: Bearer <token>
      const response = await classApi.register(classItem.id);
      setRegistrationResult(response.data || response);
      if (onRegistrationSuccess) {
        onRegistrationSuccess(classItem.id);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Đăng ký lớp học thất bại. Vui lòng thử lại sau.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setRegistrationResult(null);
    setErrorMessage('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: 'hidden',
        },
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <Box
          component="img"
          src={
            classItem.image ||
            'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop'
          }
          alt={classItem.title}
          sx={{
            width: '100%',
            height: { xs: 200, sm: 250 },
            objectFit: 'cover',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(15, 23, 42, 0.9) 100%)',
          }}
        />
        <IconButton
          onClick={handleClose}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            bgcolor: 'rgba(0, 0, 0, 0.5)',
            color: '#FFFFFF',
            '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.8)' },
          }}
        >
          <CloseIcon />
        </IconButton>

        <Box sx={{ position: 'absolute', bottom: 20, left: 24, right: 24, color: '#FFFFFF' }}>
          <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
            <Chip
              label={classItem.sport}
              color="primary"
              size="small"
              sx={{ fontWeight: 700 }}
            />
            <Chip
              label={classItem.status || 'Upcoming'}
              size="small"
              color={
                classItem.rawStatus === 'Upcoming' || classItem.status === 'Sắp diễn ra'
                  ? 'info'
                  : classItem.rawStatus === 'Ongoing'
                  ? 'success'
                  : 'default'
              }
              sx={{ fontWeight: 700 }}
            />
            <Chip
              label={`Mã lớp: #${classItem.id}`}
              size="small"
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#FFFFFF', fontWeight: 600 }}
            />
          </Stack>
          <Typography variant="h5" sx={{ fontWeight: 800, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
            {classItem.title}
          </Typography>
        </Box>
      </Box>

      <DialogContent sx={{ p: { xs: 3, md: 4 } }}>
        {registrationResult ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CheckCircleIcon sx={{ fontSize: 72, color: 'success.main', mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
              Đăng Ký Lớp Học Thành Công!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}>
              Chúc mừng <strong>{user?.fullName || user?.username}</strong>! Bạn đã được ghi danh chính thức vào lớp{' '}
              <strong>{classItem.title}</strong> do HLV <strong>{classItem.trainer}</strong> phụ trách.
            </Typography>
            <Alert severity="success" sx={{ maxWidth: 480, mx: 'auto', mb: 3, textAlign: 'left' }}>
              Mã đăng ký (Registration ID): <strong>#{registrationResult.registrationId || registrationResult.id || 'REG-' + classItem.id}</strong>
              <br />
              Trạng thái: <strong>Đã ghi danh (Registered)</strong>
              <br />
              Phòng học: {classItem.room}
            </Alert>
            <Button variant="contained" color="primary" onClick={handleClose}>
              Đóng Cửa Sổ
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {/* Left Col: Class Details */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 700, mb: 1 }}>
                THÔNG TIN LỚP HỌC (BACKEND DATA)
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph sx={{ lineHeight: 1.7 }}>
                {classItem.sportDesc || classItem.description || 'Lớp học thể thao chuyên sâu với trang thiết bị chuẩn quốc tế.'}
              </Typography>

              <Stack spacing={1.5} sx={{ mb: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <RoomIcon sx={{ color: 'secondary.main', fontSize: 20 }} />
                  <Typography variant="body2">
                    <strong>Phòng học:</strong> {classItem.room}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <FitnessCenterIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                  <Typography variant="body2">
                    <strong>Sức chứa phòng (Max Capacity):</strong> {classItem.capacity} học viên
                  </Typography>
                </Box>
              </Stack>

              <Divider sx={{ my: 2 }} />

              {/* Coach details */}
              <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700, mb: 1.5 }}>
                HUẤN LUYỆN VIÊN ĐỨNG LỚP:
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: '#F8FAFC', borderRadius: 3 }}>
                <Avatar sx={{ width: 48, height: 48, bgcolor: 'primary.main', fontWeight: 800 }}>
                  {classItem.trainer?.charAt(0) || 'C'}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    {classItem.trainer}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                    Bộ môn: {classItem.sport}
                  </Typography>
                  {classItem.trainerPhone && (
                    <Typography variant="caption" color="text.secondary">
                      Liên hệ: {classItem.trainerPhone}
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* Schedules from API */}
              <Box sx={{ mt: 2.5 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700, mb: 1 }}>
                  LỊCH HỌC DỰ KIẾN ({schedules.length} buổi):
                </Typography>
                {loadingSchedules ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1 }}>
                    <CircularProgress size={18} />
                    <Typography variant="caption">Đang tải lịch từ backend...</Typography>
                  </Box>
                ) : schedules.length > 0 ? (
                  <List dense disablePadding sx={{ bgcolor: '#F8FAFC', borderRadius: 2, p: 1 }}>
                    {schedules.map((sch) => (
                      <ListItem key={sch.scheduleId} disableGutters sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 28 }}>
                          <CalendarIcon fontSize="small" color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {sch.classDate}: {sch.startDatetime ? new Date(sch.startDatetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''} -{' '}
                              {sch.endDatetime ? new Date(sch.endDatetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="caption" color="text.secondary">
                    Chưa có lịch học cố định hoặc lớp đang cập nhật lịch mới.
                  </Typography>
                )}
              </Box>
            </Grid>

            {/* Right Col: Register & Authenticated Action */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  p: 3,
                  bgcolor: '#F8FAFC',
                  borderRadius: 3,
                  border: '1px solid #E2E8F0',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                    Xác Thực & Đăng Ký Lớp
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Chức năng yêu cầu gửi <strong>Bearer Token</strong> (Header: <code>Authorization</code>) tới endpoint:{' '}
                    <code>POST /api/classes/{classItem.id}/register</code>
                  </Typography>

                  {errorMessage && (
                    <Alert severity="error" sx={{ mb: 2.5 }}>
                      {errorMessage}
                    </Alert>
                  )}

                  {!isAuthenticated ? (
                    <Alert severity="warning" icon={<WarningIcon />} sx={{ mb: 2.5 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                        Bạn chưa đăng nhập
                      </Typography>
                      <Typography variant="caption" sx={{ display: 'block' }}>
                        Để đăng ký giữ chỗ chính thức trong hệ thống trung tâm, vui lòng đăng nhập tài khoản Hội viên (Member).
                      </Typography>
                    </Alert>
                  ) : !isMember ? (
                    <Alert severity="info" sx={{ mb: 2.5 }}>
                      Bạn đang đăng nhập với tài khoản <strong>{user?.fullName}</strong> có vai trò{' '}
                      <strong>{user?.role}</strong>. Chỉ tài khoản Hội viên (Member) mới được đăng ký lớp.
                    </Alert>
                  ) : (
                    <Box sx={{ p: 2, bgcolor: '#FFFFFF', borderRadius: 2, border: '1px solid #E2E8F0', mb: 2.5 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block', mb: 1 }}>
                        THÔNG TIN HỘI VIÊN ĐĂNG KÝ:
                      </Typography>
                      <Stack spacing={0.8}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PersonIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                          <Typography variant="body2">
                            <strong>Họ tên:</strong> {user?.fullName} (@{user?.username})
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PhoneIcon sx={{ fontSize: 18, color: 'secondary.main' }} />
                          <Typography variant="body2">
                            <strong>Số điện thoại:</strong> {user?.phone}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  )}
                </Box>

                <Box sx={{ mt: 2 }}>
                  {!isAuthenticated ? (
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      size="large"
                      startIcon={<LoginIcon />}
                      onClick={() => navigate('/login', { state: { from: '/classes' } })}
                      sx={{ py: 1.4, fontWeight: 700 }}
                    >
                      Đăng Nhập Để Đăng Ký Lớp
                    </Button>
                  ) : (
                    <Button
                      fullWidth
                      variant="contained"
                      color="secondary"
                      size="large"
                      disabled={submitting || !isMember || classItem.rawStatus === 'Cancelled'}
                      onClick={handleRegister}
                      sx={{
                        py: 1.4,
                        fontWeight: 700,
                        boxShadow: '0 4px 14px rgba(255, 107, 53, 0.35)',
                      }}
                    >
                      {submitting ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CircularProgress size={20} color="inherit" />
                          <span>Đang gửi token & đăng ký...</span>
                        </Box>
                      ) : classItem.rawStatus === 'Cancelled' ? (
                        'Lớp Đã Hủy'
                      ) : (
                        'Xác Nhận Đăng Ký Lớp Này'
                      )}
                    </Button>
                  )}
                </Box>
              </Box>
            </Grid>
          </Grid>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ClassDetailModal;
