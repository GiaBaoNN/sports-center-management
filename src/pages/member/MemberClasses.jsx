import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Stack,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  FitnessCenter as ClassIcon,
  Room as RoomIcon,
  Person as CoachIcon,
  Event as DateIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { classApi } from '../../services/api';

const MemberClasses = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Cancel dialog
  const [selectedReg, setSelectedReg] = useState(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const fetchRegistrations = () => {
    setLoading(true);
    classApi
      .getMyRegistrations()
      .then((data) => {
        setRegistrations(data || []);
      })
      .catch((err) => {
        setError(err.message || 'Không thể tải danh sách lớp học của bạn.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleOpenCancel = (reg) => {
    setSelectedReg(reg);
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedReg) return;
    setCancelling(true);
    setError('');
    setSuccessMsg('');

    try {
      await classApi.cancelRegistration(selectedReg.registrationId);
      setSuccessMsg(`Đã hủy đăng ký thành công lớp học #${selectedReg.classId}!`);
      setCancelModalOpen(false);
      fetchRegistrations();
    } catch (err) {
      setError(err.message || 'Hủy đăng ký không thành công.');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} sx={{ mb: 4 }} spacing={2}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Lớp Học Của Tôi
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Theo dõi danh sách các lớp thể thao bạn đã đăng ký ghi danh tại trung tâm.
          </Typography>
        </Box>
        <Button component={RouterLink} to="/classes" variant="contained" color="primary" startIcon={<AddIcon />} sx={{ fontWeight: 700 }}>
          Đăng Ký Thêm Lớp
        </Button>
      </Stack>

      {successMsg && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMsg}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {registrations.length === 0 ? (
        <Paper elevation={0} sx={{ p: 6, textAlign: 'center', borderRadius: 4, border: '1px solid #E2E8F0' }}>
          <ClassIcon sx={{ fontSize: 56, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
            Bạn chưa đăng ký lớp học nào
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}>
            AURA SPORT mở các lớp Yoga, Cầu Lông, Bơi Lội và Thể Lực định kỳ hàng tuần. Tham khảo thời khóa biểu để chọn lớp phù hợp nhất.
          </Typography>
          <Button component={RouterLink} to="/classes" variant="contained" color="secondary" sx={{ fontWeight: 700 }}>
            Khám Phá Lớp Học Ngay
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {registrations.map((reg) => {
            const cls = reg.classEntity || {};
            const isRegistered = reg.status === 'Registered';

            return (
              <Grid item xs={12} md={6} lg={4} key={reg.registrationId}>
                <Card sx={{ borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                      <Chip
                        label={cls.sport?.name || 'Thể thao'}
                        size="small"
                        color="primary"
                        sx={{ fontWeight: 700 }}
                      />
                      <Chip
                        label={isRegistered ? 'Đã Ghi Danh' : reg.status === 'Cancelled' ? 'Đã Hủy' : reg.status}
                        size="small"
                        color={isRegistered ? 'success' : 'default'}
                        sx={{ fontWeight: 700 }}
                      />
                    </Stack>

                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5 }}>
                      {cls.className || `Lớp học #${reg.classId}`}
                    </Typography>

                    <Stack spacing={1} sx={{ color: 'text.secondary', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <RoomIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          <strong>Phòng:</strong> {cls.room?.roomName || 'Phòng tập trung tâm'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CoachIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          <strong>HLV:</strong> {cls.coach?.fullName || 'HLV Chuyên nghiệp'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DateIcon fontSize="small" color="action" />
                        <Typography variant="body2">
                          <strong>Ngày đăng ký:</strong> {new Date(reg.registrationDate).toLocaleDateString('vi-VN')}
                        </Typography>
                      </Box>
                    </Stack>

                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', bgcolor: '#F8FAFC', p: 1, borderRadius: 1.5 }}>
                      Mã đăng ký: <strong>#{reg.registrationId}</strong> | Trạng thái lớp: <strong>{cls.status || 'Upcoming'}</strong>
                    </Typography>
                  </CardContent>

                  <CardActions sx={{ p: 2, pt: 0, justifyContent: 'flex-end' }}>
                    {isRegistered && (
                      <Button
                        size="small"
                        color="error"
                        variant="outlined"
                        startIcon={<CancelIcon />}
                        onClick={() => handleOpenCancel(reg)}
                        sx={{ fontWeight: 700 }}
                      >
                        Hủy Đăng Ký
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Cancel Confirmation Modal */}
      <Dialog open={cancelModalOpen} onClose={() => setCancelModalOpen(false)}>
        <DialogTitle sx={{ fontWeight: 800 }}>Xác Nhận Hủy Đăng Ký Lớp</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Bạn có chắc chắn muốn hủy đăng ký lớp <strong>{selectedReg?.classEntity?.className || `#${selectedReg?.classId}`}</strong> không?
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Chỗ trống của bạn sẽ được giải phóng để học viên khác có thể ghi danh vào lớp.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setCancelModalOpen(false)} disabled={cancelling}>
            Không, Giữ Lại
          </Button>
          <Button onClick={handleConfirmCancel} color="error" variant="contained" disabled={cancelling} sx={{ fontWeight: 700 }}>
            {cancelling ? 'Đang hủy...' : 'Xác Nhận Hủy'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MemberClasses;
