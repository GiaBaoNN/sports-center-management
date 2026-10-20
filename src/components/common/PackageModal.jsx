import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  TextField,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Stack,
  Alert,
  Divider,
  MenuItem,
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  CardMembership as MembershipIcon,
  Star as StarIcon,
} from '@mui/icons-material';

const PackageModal = ({ open, onClose, pkg }) => {
  const [cycle, setCycle] = useState('monthly'); // monthly, quarterly, yearly
  const [branch, setBranch] = useState('cauhgiay');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    note: '',
  });
  const [submitted, setSubmitted] = useState(false);

  if (!pkg) return null;

  const getPrice = () => {
    if (cycle === 'yearly') return pkg.priceYearly;
    if (cycle === 'quarterly') return pkg.priceQuarterly;
    return pkg.priceMonthly;
  };

  const getDurationText = () => {
    if (cycle === 'yearly') return '12 Tháng (Tiết kiệm 20%)';
    if (cycle === 'quarterly') return '03 Tháng';
    return '01 Tháng';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.phone) {
      setSubmitted(true);
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 4, p: 1 },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: 'rgba(255, 107, 53, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'secondary.main',
            }}
          >
            <MembershipIcon />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Đăng Ký {pkg.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Hạng: {pkg.tier}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {submitted ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CheckCircleIcon sx={{ fontSize: 72, color: 'success.main', mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
              Đăng Ký Thành Công!
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Cảm ơn bạn <strong>{formData.name}</strong> đã lựa chọn gói <strong>{pkg.name}</strong> ({getDurationText()}). Quản lý trung tâm sẽ liên hệ SĐT <strong>{formData.phone}</strong> để hoàn tất thủ tục và gửi thẻ hội viên điện tử.
            </Typography>
            <Alert severity="success" sx={{ textAlign: 'left', mb: 3 }}>
              Mã giao dịch đăng ký: <strong>SUB-{Math.floor(100000 + Math.random() * 900000)}</strong>
              <br />
              Chi nhánh tiếp nhận: {branch === 'cauhgiay' ? 'Cơ sở Cầu Giấy (Hà Nội)' : 'Cơ sở Quận 3 (TP.HCM)'}
            </Alert>
            <Button variant="contained" color="primary" fullWidth onClick={handleClose}>
              Đóng Cửa Sổ
            </Button>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit}>
            {/* Cycle Selector */}
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
              Chọn chu kỳ thanh toán:
            </Typography>
            <RadioGroup
              row
              value={cycle}
              onChange={(e) => setCycle(e.target.value)}
              sx={{ mb: 2.5, display: 'flex', gap: 1 }}
            >
              {[
                { value: 'monthly', label: '1 Tháng', price: pkg.priceMonthly },
                { value: 'quarterly', label: '3 Tháng', price: pkg.priceQuarterly },
                { value: 'yearly', label: '1 Năm (-20%)', price: pkg.priceYearly },
              ].map((opt) => (
                <Box
                  key={opt.value}
                  onClick={() => setCycle(opt.value)}
                  sx={{
                    flex: 1,
                    p: 1.5,
                    border: '2px solid',
                    borderColor: cycle === opt.value ? 'primary.main' : '#E2E8F0',
                    bgcolor: cycle === opt.value ? 'rgba(25, 118, 210, 0.05)' : '#FFFFFF',
                    borderRadius: 3,
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.2s',
                  }}
                >
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: cycle === opt.value ? 'primary.main' : 'text.primary' }}>
                    {opt.label}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    {opt.price.toLocaleString('vi-VN')}đ
                  </Typography>
                </Box>
              ))}
            </RadioGroup>

            {/* Total Highlight */}
            <Box
              sx={{
                p: 2,
                mb: 3,
                bgcolor: '#F8FAFC',
                borderRadius: 3,
                border: '1px dashed #CBD5E1',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Tổng phí hội viên ({getDurationText()}):
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 800, color: 'secondary.main' }}>
                {getPrice().toLocaleString('vi-VN')} đ
              </Typography>
            </Box>

            {/* Form Inputs */}
            <Stack spacing={2}>
              <TextField
                required
                fullWidth
                size="small"
                label="Họ và tên của bạn"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ví dụ: Trần Văn Bảo"
              />
              <TextField
                required
                fullWidth
                size="small"
                label="Số điện thoại liên hệ"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Ví dụ: 0987 654 321"
              />
              <TextField
                fullWidth
                size="small"
                type="email"
                label="Địa chỉ Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.com"
              />
              <TextField
                select
                fullWidth
                size="small"
                label="Chi nhánh mong muốn tập luyện"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
              >
                <MenuItem value="cauhgiay">Cơ sở Hà Nội - 456 Hoàng Quốc Việt, Cầu Giấy</MenuItem>
                <MenuItem value="q3">Cơ sở TP.HCM - 128 Nguyễn Thị Minh Khai, Q.3</MenuItem>
              </TextField>

              <Button
                type="submit"
                variant="contained"
                color="secondary"
                size="large"
                sx={{
                  py: 1.3,
                  fontWeight: 700,
                  fontSize: '1rem',
                  boxShadow: '0 4px 14px rgba(255, 107, 53, 0.4)',
                }}
              >
                Xác Nhận Giữ Chỗ & Đăng Ký
              </Button>
            </Stack>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PackageModal;
