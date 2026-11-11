import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Stack,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  CardMembership as MembershipIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Login as LoginIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { membershipApi } from '../../services/api';

const PackageModal = ({ open, onClose, pkg }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isMember } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState('Cash'); // 'Cash' | 'MoMo' (Strictly matching MembershipRequest regex)
  const [submitting, setSubmitting] = useState(false);
  const [membershipResult, setMembershipResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  if (!pkg) return null;

  const packageId = pkg.packageId || pkg.id;
  const packageName = pkg.name || 'Gói Hội Viên';
  const durationDays = pkg.durationDays || (pkg.period === 'năm' ? 365 : 30);
  const price = pkg.price != null ? Number(pkg.price) : pkg.priceMonthly || 500000;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/packages' } });
      return;
    }

    if (!isMember) {
      setErrorMessage(
        `Tài khoản hiện tại có vai trò "${user?.role}". Theo quy định hệ thống SCMS, chỉ tài khoản "Member" mới có thể đăng ký gói hội viên.`
      );
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      // Backend Contract: POST /api/memberships/register
      // Header: Authorization: Bearer <token>
      // Body: { packageId: Integer, paymentMethod: 'Cash' | 'MoMo' }
      const response = await membershipApi.register({
        packageId,
        paymentMethod,
      });

      setMembershipResult(response.data || response);
    } catch (err) {
      setErrorMessage(err.message || 'Đăng ký gói hội viên không thành công. Vui lòng kiểm tra lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setMembershipResult(null);
    setErrorMessage('');
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
              width: 44,
              height: 44,
              borderRadius: 2.5,
              bgcolor: 'rgba(255, 107, 53, 0.12)',
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
              Đăng Ký {packageName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Thời hạn: {durationDays} ngày (~{Math.round(durationDays / 30)} tháng)
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {membershipResult ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CheckCircleIcon sx={{ fontSize: 72, color: 'success.main', mb: 2 }} />
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
              Đăng Ký Gói Thành Công!
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Cảm ơn hội viên <strong>{user?.fullName || user?.username}</strong> đã lựa chọn gói{' '}
              <strong>{packageName}</strong>. Yêu cầu của bạn đã được ghi nhận trên cơ sở dữ liệu SCMS.
            </Typography>

            <Alert severity="success" sx={{ textAlign: 'left', mb: 3 }}>
              Mã thẻ hội viên (Membership ID):{' '}
              <strong>#{membershipResult.membershipId || membershipResult.id}</strong>
              <br />
              Thời hạn: Từ <strong>{membershipResult.startDate}</strong> đến{' '}
              <strong>{membershipResult.endDate}</strong>
              <br />
              Trạng thái: <strong>{membershipResult.status || 'Pending'}</strong> (Chờ xác nhận thanh toán)
              <br />
              Phương thức: <strong>{paymentMethod === 'Cash' ? 'Tiền mặt tại quầy' : 'Ví MoMo'}</strong>
            </Alert>

            {paymentMethod === 'Cash' ? (
              <Alert severity="info" sx={{ textAlign: 'left', mb: 3 }}>
                Vui lòng đến quầy lễ tân chi nhánh gần nhất để thanh toán số tiền{' '}
                <strong>{price.toLocaleString('vi-VN')} đ</strong> và nhận thẻ tập. Lễ tân sẽ xác nhận thanh toán để kích hoạt thẻ ngay.
              </Alert>
            ) : (
              <Alert severity="warning" sx={{ textAlign: 'left', mb: 3 }}>
                Giao dịch MoMo đang chờ xác thực qua cổng thanh toán webhook. Thẻ hội viên sẽ tự động kích hoạt sau khi thanh toán hoàn tất.
              </Alert>
            )}

            <Button variant="contained" color="primary" fullWidth onClick={handleClose}>
              Đóng Cửa Sổ
            </Button>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit}>
            {/* Package Summary Box */}
            <Box
              sx={{
                p: 2.5,
                mb: 3,
                bgcolor: '#F8FAFC',
                borderRadius: 3,
                border: '1px solid #E2E8F0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block' }}>
                  GÓI TẬP ĐÃ CHỌN
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  {packageName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Thời lượng: {durationDays} ngày
                </Typography>
              </Box>

              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block' }}>
                  HỌC PHÍ HỘI VIÊN
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 900, color: 'secondary.main' }}>
                  {price.toLocaleString('vi-VN')} đ
                </Typography>
              </Box>
            </Box>

            {/* Error Message */}
            {errorMessage && (
              <Alert severity="error" sx={{ mb: 2.5 }}>
                {errorMessage}
              </Alert>
            )}

            {/* User Auth State Alert */}
            {!isAuthenticated ? (
              <Alert severity="warning" icon={<WarningIcon />} sx={{ mb: 2.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, mb: 0.5 }}>
                  Yêu cầu đăng nhập tài khoản
                </Typography>
                <Typography variant="caption" sx={{ display: 'block' }}>
                  Đăng ký gói hội viên yêu cầu gửi Token (Bearer Token). Vui lòng đăng nhập tài khoản hội viên để tiếp tục.
                </Typography>
              </Alert>
            ) : !isMember ? (
              <Alert severity="info" sx={{ mb: 2.5 }}>
                Tài khoản hiện tại có vai trò <strong>{user?.role}</strong>. Chỉ tài khoản Hội viên (Member) mới có quyền đăng ký gói tập.
              </Alert>
            ) : (
              <Box sx={{ p: 2, bgcolor: '#FFFFFF', borderRadius: 2.5, border: '1px solid #E2E8F0', mb: 2.5 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block', mb: 1 }}>
                  THÔNG TIN TÀI KHOẢN HỘI VIÊN:
                </Typography>
                <Stack spacing={0.6}>
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

            {/* Payment Method Selector (Strictly Cash or MoMo per backend constraint) */}
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.2 }}>
              Chọn phương thức thanh toán (Payment Method):
            </Typography>
            <RadioGroup
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              sx={{ mb: 3 }}
            >
              <Box
                onClick={() => setPaymentMethod('Cash')}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 1.8,
                  mb: 1.2,
                  border: '2px solid',
                  borderColor: paymentMethod === 'Cash' ? 'primary.main' : '#E2E8F0',
                  borderRadius: 2.5,
                  cursor: 'pointer',
                  bgcolor: paymentMethod === 'Cash' ? 'rgba(25, 118, 210, 0.04)' : '#FFFFFF',
                }}
              >
                <FormControlLabel
                  value="Cash"
                  control={<Radio size="small" />}
                  label={
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                        Tiền mặt tại quầy (Cash)
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Thanh toán trực tiếp cho lễ tân trung tâm khi nhận thẻ
                      </Typography>
                    </Box>
                  }
                  sx={{ m: 0 }}
                />
                <Chip label="Phổ biến" size="small" color="primary" variant="outlined" />
              </Box>

              <Box
                onClick={() => setPaymentMethod('MoMo')}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 1.8,
                  border: '2px solid',
                  borderColor: paymentMethod === 'MoMo' ? '#A50064' : '#E2E8F0',
                  borderRadius: 2.5,
                  cursor: 'pointer',
                  bgcolor: paymentMethod === 'MoMo' ? 'rgba(165, 0, 100, 0.04)' : '#FFFFFF',
                }}
              >
                <FormControlLabel
                  value="MoMo"
                  control={<Radio size="small" sx={{ '&.Mui-checked': { color: '#A50064' } }} />}
                  label={
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: paymentMethod === 'MoMo' ? '#A50064' : 'inherit' }}>
                        Ví điện tử MoMo (MoMo E-Wallet)
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Quét mã QR MoMo và thanh toán tức thì qua App
                      </Typography>
                    </Box>
                  }
                  sx={{ m: 0 }}
                />
                <Chip label="Online 24/7" size="small" sx={{ bgcolor: 'rgba(165, 0, 100, 0.1)', color: '#A50064', fontWeight: 700 }} />
              </Box>
            </RadioGroup>

            {/* Action buttons */}
            {!isAuthenticated ? (
              <Button
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                startIcon={<LoginIcon />}
                onClick={() => navigate('/login', { state: { from: '/packages' } })}
                sx={{ py: 1.4, fontWeight: 700 }}
              >
                Đăng Nhập Để Đăng Ký Gói Tập
              </Button>
            ) : (
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="secondary"
                size="large"
                disabled={submitting || !isMember}
                sx={{
                  py: 1.4,
                  fontWeight: 700,
                  fontSize: '1rem',
                  boxShadow: '0 4px 14px rgba(255, 107, 53, 0.4)',
                }}
              >
                {submitting ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={20} color="inherit" />
                    <span>Đang gửi token & đăng ký gói...</span>
                  </Box>
                ) : (
                  `Xác Nhận Đăng Ký (${price.toLocaleString('vi-VN')} đ)`
                )}
              </Button>
            )}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PackageModal;
