import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
  Grid,
  Chip,
  Button,
  TextField,
  Avatar,
  Divider,
  LinearProgress,
  Alert,
  Stack,
  Tabs,
  Tab,
  CircularProgress,
  Paper,
} from '@mui/material';
import {
  Close as CloseIcon,
  AccessTime as AccessTimeIcon,
  Room as RoomIcon,
  Whatshot as FireIcon,
  FitnessCenter as FitnessCenterIcon,
  CheckCircle as CheckCircleIcon,
  CalendarMonth as CalendarIcon,
  Person as PersonIcon,
  CardMembership as MembershipIcon,
  EventAvailable as BookOfficialIcon,
  HighlightOff as CancelBookIcon,
  WarningAmber as WarningIcon,
  Upgrade as UpgradeIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { classBookingService } from '../../services/classBookingService';

const ClassDetailModal = ({
  open,
  onClose,
  classItem,
  isBooked = false,
  currentUser,
  onBookingSuccess,
  onCancelSuccess,
}) => {
  // Tab 0: Đăng ký chính thức (Hội viên - FE-10)
  // Tab 1: Đăng ký học thử (Khách mới)
  const [activeTab, setActiveTab] = useState(0);

  // States cho đăng ký học thử (Guest Trial)
  const [trialFormData, setTrialFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    date: '2026-10-29',
    note: '',
  });
  const [trialSubmitted, setTrialSubmitted] = useState(false);
  const [trialSuccessMsg, setTrialSuccessMsg] = useState('');

  // States cho đăng ký / hủy chính thức (Official Member Booking - FE-10 / FE-11)
  const [loadingAction, setLoadingAction] = useState(false);
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setActionError('');
      setActionSuccess('');
      setTrialSubmitted(false);
      // Mặc định chọn tab đăng ký chính thức nếu là hội viên, hoặc tab học thử nếu chưa có thẻ
      setActiveTab(0);
    }
  }, [open, classItem]);

  if (!classItem) return null;

  const availableSlots = classItem.capacity - classItem.booked;
  const progressPercent = Math.min(100, Math.round((classItem.booked / classItem.capacity) * 100));

  // Kiểm tra gói tập có bao hàm môn học này không
  const isSportCovered =
    currentUser?.membership?.allowedSports?.includes(classItem.sport) ?? true;

  // Xử lý đăng ký lớp chính thức (FE-10)
  const handleOfficialBook = async () => {
    try {
      setLoadingAction(true);
      setActionError('');
      setActionSuccess('');

      const result = await classBookingService.bookOfficialClass(classItem.id, currentUser);
      setActionSuccess(result.message);
      if (onBookingSuccess) {
        onBookingSuccess(result.updatedClass, result.registration);
      }
    } catch (err) {
      setActionError(err.message || 'Không thể đăng ký lớp học. Vui lòng thử lại.');
    } finally {
      setLoadingAction(false);
    }
  };

  // Mở dialog xác nhận hủy (FE-11)
  const handlePromptCancel = () => {
    setConfirmCancelOpen(true);
  };

  // Xác nhận hủy đăng ký lớp học (FE-11)
  const handleConfirmCancel = async () => {
    try {
      setLoadingAction(true);
      setActionError('');
      setActionSuccess('');
      setConfirmCancelOpen(false);

      const result = await classBookingService.cancelClassRegistration(classItem.id, currentUser?.id);
      setActionSuccess(result.message);
      if (onCancelSuccess) {
        onCancelSuccess(result.updatedClass, classItem.id);
      }
    } catch (err) {
      setActionError(err.message || 'Không thể hủy đăng ký lớp. Vui lòng thử lại.');
    } finally {
      setLoadingAction(false);
    }
  };

  // Xử lý gửi form học thử (Guest Trial)
  const handleTrialSubmit = async (e) => {
    e.preventDefault();
    if (!trialFormData.fullName || !trialFormData.phone) return;

    try {
      setLoadingAction(true);
      const res = await classBookingService.bookTrialClass(classItem.id, trialFormData);
      setTrialSuccessMsg(res.message);
      setTrialSubmitted(true);
    } catch (err) {
      setActionError(err.message || 'Đăng ký học thử thất bại.');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleClose = () => {
    setTrialSubmitted(false);
    setActionError('');
    setActionSuccess('');
    setConfirmCancelOpen(false);
    onClose();
  };

  return (
    <>
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
        {/* Banner Header Image */}
        <Box sx={{ position: 'relative' }}>
          <Box
            component="img"
            src={classItem.image}
            alt={classItem.title}
            sx={{
              width: '100%',
              height: { xs: 180, sm: 230 },
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
              background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.85) 100%)',
            }}
          />
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              top: 14,
              right: 14,
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              color: '#FFFFFF',
              '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.8)' },
            }}
          >
            <CloseIcon />
          </IconButton>

          <Box sx={{ position: 'absolute', bottom: 16, left: 24, right: 24, color: '#FFFFFF' }}>
            <Stack direction="row" spacing={1} sx={{ mb: 1 }} flexWrap="wrap" useFlexGap>
              <Chip
                label={classItem.sport}
                color="primary"
                size="small"
                sx={{ fontWeight: 700 }}
              />
              <Chip
                label={classItem.status}
                size="small"
                color={
                  classItem.status === 'Còn chỗ'
                    ? 'success'
                    : classItem.status === 'Sắp hết'
                    ? 'warning'
                    : 'error'
                }
                sx={{ fontWeight: 700 }}
              />
              <Chip
                label={`Cấp độ: ${classItem.level}`}
                size="small"
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#FFFFFF', fontWeight: 600 }}
              />
              {isBooked && (
                <Chip
                  icon={<CheckCircleIcon sx={{ '&&': { color: '#FFFFFF' } }} />}
                  label="BẠN ĐÃ ĐĂNG KÝ (BOOKED)"
                  color="success"
                  size="small"
                  sx={{ fontWeight: 800, bgcolor: '#2E7D32' }}
                />
              )}
            </Stack>
            <Typography variant="h5" sx={{ fontWeight: 800, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
              {classItem.title}
            </Typography>
          </Box>
        </Box>

        <DialogContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
          {/* Main 2-Column Layout */}
          <Grid container spacing={3}>
            {/* Left Col: Class Information & Specs */}
            <Grid size={{ xs: 12, md: 5.5 }}>
              <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 700, mb: 1 }}>
                THÔNG TIN LỚP HỌC CHI TIẾT
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph sx={{ lineHeight: 1.7 }}>
                {classItem.description}
              </Typography>

              <Stack spacing={1.5} sx={{ mb: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <AccessTimeIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                  <Typography variant="body2">
                    <strong>Thời gian:</strong> {classItem.time} ({classItem.daysShort})
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <RoomIcon sx={{ color: 'secondary.main', fontSize: 20 }} />
                  <Typography variant="body2">
                    <strong>Địa điểm:</strong> {classItem.room}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <FireIcon sx={{ color: '#FF6B35', fontSize: 20 }} />
                  <Typography variant="body2">
                    <strong>Đốt calo dự kiến:</strong> {classItem.calories}
                  </Typography>
                </Box>
              </Stack>

              <Divider sx={{ my: 2 }} />

              {/* Trainer box */}
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block', mb: 1 }}>
                HUẤN LUYỆN VIÊN ĐỨNG LỚP:
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1.8, bgcolor: '#F8FAFC', borderRadius: 3 }}>
                <Avatar src={classItem.trainerAvatar} alt={classItem.trainer} sx={{ width: 48, height: 48 }} />
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                    {classItem.trainer}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Chuyên gia đào tạo bộ môn {classItem.sport}
                  </Typography>
                </Box>
              </Box>

              {/* Slot Progress */}
              <Box sx={{ mt: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                    Tình trạng chỗ ngồi:
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 800,
                      color: availableSlots <= 2 ? 'error.main' : 'primary.main',
                    }}
                  >
                    Còn {availableSlots}/{classItem.capacity} slot
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={progressPercent}
                  color={availableSlots <= 2 ? 'warning' : 'primary'}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            </Grid>

            {/* Right Col: Booking Tabs & Actions */}
            <Grid size={{ xs: 12, md: 6.5 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  bgcolor: '#F8FAFC',
                  borderRadius: 3.5,
                  border: '1px solid #E2E8F0',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Tabs to clearly separate Official Booking vs Guest Trial */}
                <Tabs
                  value={activeTab}
                  onChange={(e, val) => setActiveTab(val)}
                  variant="fullWidth"
                  sx={{
                    mb: 2.5,
                    borderBottom: '1px solid #E2E8F0',
                    '& .MuiTab-root': {
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      textTransform: 'none',
                    },
                  }}
                >
                  <Tab
                    icon={<BookOfficialIcon fontSize="small" />}
                    iconPosition="start"
                    label="Đăng Ký Chính Thức"
                  />
                  <Tab
                    icon={<CalendarIcon fontSize="small" />}
                    iconPosition="start"
                    label="Học Thử Miễn Phí"
                  />
                </Tabs>

                {/* Notifications Alert */}
                {actionError && (
                  <Alert severity="error" sx={{ mb: 2 }} onClose={() => setActionError('')}>
                    {actionError}
                  </Alert>
                )}
                {actionSuccess && (
                  <Alert severity="success" sx={{ mb: 2 }} onClose={() => setActionSuccess('')}>
                    {actionSuccess}
                  </Alert>
                )}

                {/* ======================================================== */}
                {/* TAB 0: ĐĂNG KÝ LỚP CHÍNH THỨC (HỘI VIÊN - FE-10 & FE-11) */}
                {/* ======================================================== */}
                {activeTab === 0 && (
                  <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Member Profile Badge */}
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: '#FFFFFF',
                        borderRadius: 2.5,
                        border: '1px solid #E2E8F0',
                        mb: 2.5,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <MembershipIcon color="primary" fontSize="small" />
                          <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                            {currentUser?.fullName || 'Hội Viên AURA SPORT'}
                          </Typography>
                        </Box>
                        <Chip
                          size="small"
                          label={currentUser?.membership?.status || 'ACTIVE'}
                          color="success"
                          sx={{ fontWeight: 800, fontSize: '0.7rem' }}
                        />
                      </Box>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        Gói tập: <strong>{currentUser?.membership?.packageName || 'Gói Gold'}</strong> • SĐT: {currentUser?.phone}
                      </Typography>
                    </Box>

                    {/* Condition 1: Check if package covers sport */}
                    {!isSportCovered ? (
                      <Box sx={{ my: 'auto', textAlign: 'center', py: 2 }}>
                        <WarningIcon sx={{ fontSize: 48, color: 'warning.main', mb: 1 }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
                          Bộ Môn Chưa Nằm Trong Gói Tập
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, px: 2 }}>
                          Bộ môn <strong>{classItem.sport}</strong> yêu cầu hạng thẻ <strong>Platinum</strong> hoặc{' '}
                          <strong>Diamond VIP</strong>. Gói Gold hiện tại của bạn chưa mở quyền truy cập bộ môn này.
                        </Typography>
                        <Button
                          component={RouterLink}
                          to="/packages"
                          variant="contained"
                          color="secondary"
                          startIcon={<UpgradeIcon />}
                          sx={{ fontWeight: 700 }}
                        >
                          Xem Bảng Nâng Cấp Gói
                        </Button>
                      </Box>
                    ) : isBooked ? (
                      /* Condition 2: Already Booked -> Allow Cancel (FE-11) */
                      <Box sx={{ my: 'auto', textAlign: 'center', py: 2 }}>
                        <CheckCircleIcon sx={{ fontSize: 56, color: 'success.main', mb: 1 }} />
                        <Typography variant="h6" sx={{ fontWeight: 800, color: 'success.dark', mb: 0.5 }}>
                          Bạn Đã Giữ Chỗ Lớp Này
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                          Trạng thái đăng ký: <strong>ĐÃ XÁC NHẬN (BOOKED)</strong>
                          <br />
                          Vui lòng đến phòng <strong>{classItem.room}</strong> trước giờ tập 10 phút để check-in.
                        </Typography>

                        <Button
                          variant="outlined"
                          color="error"
                          size="large"
                          disabled={loadingAction}
                          startIcon={loadingAction ? <CircularProgress size={18} /> : <CancelBookIcon />}
                          onClick={handlePromptCancel}
                          sx={{ fontWeight: 700, py: 1.2, px: 3 }}
                        >
                          Hủy Đăng Ký Lớp Này (FE-11)
                        </Button>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5 }}>
                          * Hủy lớp sẽ hoàn trả 01 slot cho các hội viên khác có nhu cầu.
                        </Typography>
                      </Box>
                    ) : (
                      /* Condition 3: Not Booked -> Allow Official Booking (FE-10) */
                      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>
                            Quy định đăng ký lớp chính thức:
                          </Typography>
                          <Stack spacing={1} sx={{ mb: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                              ✔ Tham gia không giới hạn theo quyền lợi gói hội viên của bạn.
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              ✔ Hệ thống sẽ giữ chỗ tự động và gửi thông báo nhắc lịch tập.
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              ✔ Có thể hủy đăng ký trước giờ học để hoàn trả slot nếu bận đột xuất.
                            </Typography>
                          </Stack>
                        </Box>

                        <Box sx={{ pt: 2 }}>
                          {classItem.status === 'Đã đủ chỗ' ? (
                            <Button
                              fullWidth
                              variant="contained"
                              disabled
                              size="large"
                              sx={{ py: 1.4, fontWeight: 700 }}
                            >
                              Lớp Học Đã Đủ Số Lượng Slot
                            </Button>
                          ) : (
                            <Button
                              fullWidth
                              variant="contained"
                              color="primary"
                              size="large"
                              disabled={loadingAction}
                              startIcon={loadingAction ? <CircularProgress size={20} color="inherit" /> : <BookOfficialIcon />}
                              onClick={handleOfficialBook}
                              sx={{
                                py: 1.4,
                                fontWeight: 800,
                                fontSize: '0.95rem',
                                boxShadow: '0 4px 16px rgba(25, 118, 210, 0.35)',
                              }}
                            >
                              {loadingAction ? 'Đang Xử Lý Đặt Chỗ...' : 'Xác Nhận Đăng Ký Lớp Chính Thức (FE-10)'}
                            </Button>
                          )}
                        </Box>
                      </Box>
                    )}
                  </Box>
                )}

                {/* ======================================================== */}
                {/* TAB 1: ĐĂNG KÝ HỌC THỬ MIỄN PHÍ (DÀNH CHO KHÁCH MỚI)     */}
                {/* ======================================================== */}
                {activeTab === 1 && (
                  <Box sx={{ flexGrow: 1 }}>
                    {trialSubmitted ? (
                      <Box sx={{ textAlign: 'center', py: 3 }}>
                        <CheckCircleIcon sx={{ fontSize: 60, color: 'success.main', mb: 1.5 }} />
                        <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                          Đăng Ký Học Thử Thành Công!
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
                          {trialSuccessMsg || 'Bộ phận lễ tân sẽ gọi xác nhận lịch tập cho bạn trong vòng 15 phút.'}
                        </Typography>
                        <Button variant="outlined" color="primary" onClick={() => setTrialSubmitted(false)}>
                          Đăng Ký Buổi Khác
                        </Button>
                      </Box>
                    ) : (
                      <Box component="form" onSubmit={handleTrialSubmit}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.8 }}>
                          Trải nghiệm 01 buổi tập chuẩn quốc tế hoàn toàn miễn phí dành cho khách hàng mới chưa kích hoạt thẻ hội viên.
                        </Typography>

                        <Stack spacing={1.8}>
                          <TextField
                            required
                            fullWidth
                            size="small"
                            label="Họ và tên của bạn"
                            name="fullName"
                            value={trialFormData.fullName}
                            onChange={(e) => setTrialFormData({ ...trialFormData, fullName: e.target.value })}
                            placeholder="Ví dụ: Hoàng Tuấn Long"
                          />
                          <TextField
                            required
                            fullWidth
                            size="small"
                            label="Số điện thoại liên hệ"
                            name="phone"
                            value={trialFormData.phone}
                            onChange={(e) => setTrialFormData({ ...trialFormData, phone: e.target.value })}
                            placeholder="Ví dụ: 0912 345 678"
                          />
                          <TextField
                            fullWidth
                            size="small"
                            type="date"
                            label="Ngày mong muốn tập thử"
                            name="date"
                            value={trialFormData.date}
                            onChange={(e) => setTrialFormData({ ...trialFormData, date: e.target.value })}
                            slotProps={{ inputLabel: { shrink: true } }}
                          />
                          <TextField
                            fullWidth
                            size="small"
                            label="Ghi chú thể lực (nếu có)"
                            name="note"
                            value={trialFormData.note}
                            onChange={(e) => setTrialFormData({ ...trialFormData, note: e.target.value })}
                            placeholder="Mục tiêu giảm cân, tiền sử chấn thương..."
                          />

                          <Button
                            type="submit"
                            variant="contained"
                            color="secondary"
                            size="large"
                            disabled={loadingAction || classItem.status === 'Đã đủ chỗ'}
                            sx={{
                              fontWeight: 700,
                              py: 1.2,
                              boxShadow: '0 4px 14px rgba(255, 107, 53, 0.35)',
                            }}
                          >
                            {loadingAction ? 'Đang gửi...' : 'Gửi Yêu Cầu Học Thử Miễn Phí'}
                          </Button>
                        </Stack>
                      </Box>
                    )}
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog for Cancellation (FE-11) */}
      <Dialog
        open={confirmCancelOpen}
        onClose={() => setConfirmCancelOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3.5, p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, pb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon color="warning" />
          Xác Nhận Hủy Lớp Học?
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" paragraph>
            Bạn có chắc chắn muốn hủy đăng ký lớp <strong>{classItem.title}</strong>?
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Vị trí đặt chỗ của bạn sẽ được hoàn trả cho hội viên khác. Bạn vẫn có thể đăng ký lại sau nếu lớp còn slot trống.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setConfirmCancelOpen(false)} color="inherit" sx={{ fontWeight: 600 }}>
            Giữ Chỗ
          </Button>
          <Button
            onClick={handleConfirmCancel}
            variant="contained"
            color="error"
            disabled={loadingAction}
            sx={{ fontWeight: 700 }}
          >
            {loadingAction ? 'Đang Hủy...' : 'Xác Nhận Hủy Đăng Ký'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ClassDetailModal;
