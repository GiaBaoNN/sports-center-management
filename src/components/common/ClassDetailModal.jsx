import React, { useState } from 'react';
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
} from '@mui/icons-material';

const ClassDetailModal = ({ open, onClose, classItem }) => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    date: '2026-10-25',
    note: '',
  });

  if (!classItem) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.fullName && formData.phone) {
      setFormSubmitted(true);
    }
  };

  const handleClose = () => {
    setFormSubmitted(false);
    onClose();
  };

  const availableSlots = classItem.capacity - classItem.booked;
  const progressPercent = Math.round((classItem.booked / classItem.capacity) * 100);

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
          src={classItem.image}
          alt={classItem.title}
          sx={{
            width: '100%',
            height: { xs: 200, sm: 260 },
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
          </Stack>
          <Typography variant="h5" sx={{ fontWeight: 800, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
            {classItem.title}
          </Typography>
        </Box>
      </Box>

      <DialogContent sx={{ p: { xs: 3, md: 4 } }}>
        {formSubmitted ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CheckCircleIcon sx={{ fontSize: 72, color: 'success.main', mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
              Đăng Ký Học Thử Thành Công!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}>
              Cảm ơn <strong>{formData.fullName}</strong>. Tư vấn viên thể thao và HLV{' '}
              <strong>{classItem.trainer}</strong> sẽ liên hệ xác nhận lịch học qua SĐT{' '}
              <strong>{formData.phone}</strong> trong vòng 15 phút.
            </Typography>
            <Alert severity="info" sx={{ maxWidth: 460, mx: 'auto', mb: 3, textAlign: 'left' }}>
              Mã giữ chỗ: <strong>AUR-{Math.floor(100000 + Math.random() * 900000)}</strong>
              <br />
              Vui lòng mang theo trang phục tập luyện thoải mái và có mặt trước 10 phút.
            </Alert>
            <Button variant="contained" color="primary" onClick={handleClose}>
              Hoàn Tất & Đóng
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {/* Left Col: Class Details */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 700, mb: 1 }}>
                THÔNG TIN LỚP HỌC
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph sx={{ lineHeight: 1.7 }}>
                {classItem.description}
              </Typography>

              <Stack spacing={1.5} sx={{ mb: 3 }}>
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
              <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700, mb: 1.5 }}>
                HUẤN LUYỆN VIÊN ĐỨNG LỚP:
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: '#F8FAFC', borderRadius: 3 }}>
                <Avatar src={classItem.trainerAvatar} alt={classItem.trainer} sx={{ width: 52, height: 52 }} />
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    {classItem.trainer}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Chuyên gia đào tạo bộ môn {classItem.sport}
                  </Typography>
                </Box>
              </Box>

              {/* Slot Progress */}
              <Box sx={{ mt: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Tình trạng chỗ:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: availableSlots <= 2 ? 'error.main' : 'primary.main' }}>
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

            {/* Right Col: Quick Booking Form */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                  p: 3,
                  bgcolor: '#F8FAFC',
                  borderRadius: 3,
                  border: '1px solid #E2E8F0',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
                  Đăng Ký Học Thử Miễn Phí
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                  Trải nghiệm 01 buổi tập cùng HLV chuyên nghiệp hoàn toàn miễn phí.
                </Typography>

                <Stack spacing={2}>
                  <TextField
                    required
                    fullWidth
                    size="small"
                    label="Họ và tên"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Ví dụ: Nguyễn Văn A"
                  />
                  <TextField
                    required
                    fullWidth
                    size="small"
                    label="Số điện thoại"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Ví dụ: 0912 345 678"
                  />
                  <TextField
                    fullWidth
                    size="small"
                    type="email"
                    label="Email nhận vé tập"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                  />
                  <TextField
                    fullWidth
                    size="small"
                    type="date"
                    label="Ngày bạn muốn tập thử"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    fullWidth
                    size="small"
                    multiline
                    rows={2}
                    label="Ghi chú thể lực (nếu có)"
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    placeholder="Tiền sử chấn thương, mục tiêu muốn giảm cân/tăng cơ..."
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    size="large"
                    disabled={classItem.status === 'Đã đủ chỗ'}
                    sx={{
                      fontWeight: 700,
                      py: 1.2,
                      boxShadow: '0 4px 14px rgba(255, 107, 53, 0.35)',
                    }}
                  >
                    {classItem.status === 'Đã đủ chỗ' ? 'Lớp Đã Đủ Số Lượng' : 'Xác Nhận Giữ Chỗ Học Thử'}
                  </Button>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ClassDetailModal;
