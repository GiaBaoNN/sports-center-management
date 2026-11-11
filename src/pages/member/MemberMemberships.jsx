import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from '@mui/material';
import {
  CardMembership as MembershipIcon,
  Receipt as InvoiceIcon,
  Payment as PaymentIcon,
  QrCode2 as QrIcon,
  OpenInNew as ExternalLinkIcon,
  CheckCircle as PaidIcon,
  HourglassTop as PendingIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { membershipApi, paymentApi } from '../../services/api';

const MemberMemberships = () => {
  const [loading, setLoading] = useState(true);
  const [activeMembership, setActiveMembership] = useState(null);
  const [memberships, setMemberships] = useState([]);
  const [payments, setPayments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [error, setError] = useState('');

  // MoMo payment dialog state
  const [momoModalOpen, setMomoModalOpen] = useState(false);
  const [momoData, setMomoData] = useState(null);
  const [initiatingMomo, setInitiatingMomo] = useState(false);
  const [callbackProcessing, setCallbackProcessing] = useState(false);
  const [momoSuccessMsg, setMomoSuccessMsg] = useState('');

  const loadData = () => {
    setLoading(true);
    Promise.allSettled([
      membershipApi.getMyActive(),
      membershipApi.getMy(),
      membershipApi.getMyPayments(),
      membershipApi.getMyInvoices(),
    ])
      .then(([activeRes, listRes, paymentsRes, invoicesRes]) => {
        if (activeRes.status === 'fulfilled') setActiveMembership(activeRes.value || null);
        if (listRes.status === 'fulfilled') setMemberships(listRes.value || []);
        if (paymentsRes.status === 'fulfilled') setPayments(paymentsRes.value || []);
        if (invoicesRes.status === 'fulfilled') setInvoices(invoicesRes.value || []);
      })
      .catch((err) => {
        setError(err.message || 'Không thể tải lịch sử gói tập và thanh toán.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleInitiateMomo = async (paymentId) => {
    setInitiatingMomo(true);
    setMomoSuccessMsg('');
    setError('');
    try {
      const data = await paymentApi.initiateMomo(paymentId);
      setMomoData({ ...data, paymentId });
      setMomoModalOpen(true);
    } catch (err) {
      setError(err.message || 'Không thể khởi tạo cổng thanh toán MoMo.');
    } finally {
      setInitiatingMomo(false);
    }
  };

  const handleSimulateMomoCallback = async (resultCode) => {
    if (!momoData?.orderId) return;
    setCallbackProcessing(true);
    try {
      await paymentApi.momoCallback({
        orderId: momoData.orderId,
        transId: 'MOMO-SIM-' + Date.now(),
        resultCode: resultCode,
      });
      setMomoSuccessMsg(
        resultCode === 0
          ? 'Xác nhận thanh toán MoMo thành công! Thẻ hội viên của bạn đã được kích hoạt.'
          : 'Giao dịch MoMo bị hủy hoặc thất bại.'
      );
      loadData();
    } catch (err) {
      setError(err.message || 'Lỗi khi gửi webhook MoMo.');
    } finally {
      setCallbackProcessing(false);
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
            Quản Lý Thẻ Hội Viên & Hóa Đơn
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tra cứu thông tin gói tập hiện tại, lịch sử thanh toán và hóa đơn điện tử.
          </Typography>
        </Box>
        <Button component={RouterLink} to="/packages" variant="contained" color="secondary" sx={{ fontWeight: 700 }}>
          Đăng Ký Gói Mới
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Active Package Banner */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          bgcolor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          mb: 4,
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
        }}
      >
        <Typography variant="overline" color="primary" sx={{ fontWeight: 800, letterSpacing: '0.1em' }}>
          GÓI TẬP ĐANG HOẠT ĐỘNG
        </Typography>

        {activeMembership ? (
          <Grid container spacing={3} alignItems="center" sx={{ mt: 0.5 }}>
            <Grid item xs={12} md={7}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A' }}>
                {activeMembership.packageName || activeMembership.packageEntity?.name || 'Gói Hội Viên'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Mã hội viên: <strong>#{activeMembership.membershipId}</strong> | Thời hạn:{' '}
                <strong>{activeMembership.startDate}</strong> đến <strong>{activeMembership.endDate}</strong>
              </Typography>
            </Grid>
            <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, gap: 1.5 }}>
              <Chip icon={<PaidIcon />} label="Trạng thái: Hoạt động (Active)" color="success" sx={{ fontWeight: 700 }} />
            </Grid>
          </Grid>
        ) : (
          <Alert severity="info" sx={{ mt: 1 }}>
            Hiện tại bạn chưa có thẻ hội viên đang hoạt động. Vui lòng đăng ký gói hoặc kiểm tra các giao dịch đang chờ xác nhận thanh toán bên dưới.
          </Alert>
        )}
      </Paper>

      {/* Memberships History Table */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
          Lịch Sử Đăng Ký Gói Tập
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead sx={{ bgcolor: '#F8FAFC' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Mã Thẻ</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Tên Gói</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Ngày Bắt Đầu</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Ngày Hết Hạn</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Trạng Thái</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {memberships.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                    Chưa có lịch sử thẻ hội viên nào.
                  </TableCell>
                </TableRow>
              ) : (
                memberships.map((m) => (
                  <TableRow key={m.membershipId}>
                    <TableCell sx={{ fontWeight: 600 }}>#{m.membershipId}</TableCell>
                    <TableCell>{m.packageName || m.packageEntity?.name || `Gói #${m.packageId}`}</TableCell>
                    <TableCell>{m.startDate}</TableCell>
                    <TableCell>{m.endDate}</TableCell>
                    <TableCell>
                      <Chip
                        label={m.status}
                        size="small"
                        color={m.status === 'Active' ? 'success' : m.status === 'Pending' ? 'warning' : 'default'}
                        sx={{ fontWeight: 700 }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Payments & Invoices Section */}
      <Grid container spacing={3}>
        {/* Payments Table */}
        <Grid item xs={12} md={7}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
              Lịch Sử Giao Dịch Thanh Toán
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Mã TT</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Số Tiền</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Hình Thức</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Trạng Thái</TableCell>
                    <TableCell sx={{ fontWeight: 700 }} align="right">Thao Tác</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {payments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                        Chưa có giao dịch thanh toán nào.
                      </TableCell>
                    </TableRow>
                  ) : (
                    payments.map((p) => (
                      <TableRow key={p.paymentId}>
                        <TableCell sx={{ fontWeight: 600 }}>#{p.paymentId}</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>
                          {Number(p.amount).toLocaleString('vi-VN')} đ
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={p.paymentMethod}
                            size="small"
                            variant="outlined"
                            color={p.paymentMethod === 'MoMo' ? 'secondary' : 'default'}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={p.status === 'Paid' ? 'Đã thu' : p.status === 'Pending' ? 'Chờ thanh toán' : p.status}
                            size="small"
                            color={p.status === 'Paid' ? 'success' : p.status === 'Pending' ? 'warning' : 'error'}
                            sx={{ fontWeight: 700 }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          {p.status === 'Pending' && p.paymentMethod === 'MoMo' && (
                            <Button
                              size="small"
                              variant="outlined"
                              color="secondary"
                              onClick={() => handleInitiateMomo(p.paymentId)}
                              disabled={initiatingMomo}
                              startIcon={<QrIcon fontSize="small" />}
                              sx={{ fontSize: '0.75rem', py: 0.3 }}
                            >
                              MoMo QR
                            </Button>
                          )}
                          {p.status === 'Pending' && p.paymentMethod === 'Cash' && (
                            <Typography variant="caption" color="text.secondary">
                              Đóng tại quầy
                            </Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Invoices Table */}
        <Grid item xs={12} md={5}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
              Hóa Đơn Đã Xuất
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Số HĐ</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Ngày Lập</TableCell>
                    <TableCell sx={{ fontWeight: 700 }} align="right">Tổng Tiền</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invoices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                        Chưa có hóa đơn nào được phát hành.
                      </TableCell>
                    </TableRow>
                  ) : (
                    invoices.map((inv) => (
                      <TableRow key={inv.invoiceId}>
                        <TableCell sx={{ fontWeight: 600 }}>#{inv.invoiceId}</TableCell>
                        <TableCell>{new Date(inv.issueDate).toLocaleDateString('vi-VN')}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 700, color: 'success.main' }}>
                          {Number(inv.totalAmount).toLocaleString('vi-VN')} đ
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* MoMo Payment Modal */}
      <Dialog open={momoModalOpen} onClose={() => setMomoModalOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>
          Cổng Thanh Toán Điện Tử MoMo
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', pt: 2 }}>
          {momoSuccessMsg ? (
            <Alert severity="success" sx={{ mb: 2 }}>
              {momoSuccessMsg}
            </Alert>
          ) : (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Quét mã QR bằng ứng dụng MoMo trên điện thoại hoặc mở liên kết cổng thanh toán bên dưới:
              </Typography>

              {momoData?.qrCodeUrl && (
                <Box
                  component="img"
                  src={momoData.qrCodeUrl}
                  alt="MoMo QR Code"
                  sx={{ width: 180, height: 180, borderRadius: 2, border: '1px solid #CBD5E1', p: 1, mb: 2 }}
                />
              )}

              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'secondary.main', mb: 0.5 }}>
                Số tiền: {Number(momoData?.amount || 0).toLocaleString('vi-VN')} đ
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2.5 }}>
                Mã đơn hàng: {momoData?.orderId}
              </Typography>

              <Button
                fullWidth
                variant="contained"
                color="secondary"
                href={momoData?.payUrl}
                target="_blank"
                rel="noopener noreferrer"
                endIcon={<ExternalLinkIcon />}
                sx={{ mb: 2, fontWeight: 700 }}
              >
                Mở Cổng Thanh Toán MoMo Gateway
              </Button>

              <Divider sx={{ my: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  MÔ PHỎNG XÁC NHẬN WEBHOOK TỪ MOMO
                </Typography>
              </Divider>

              <Stack direction="row" spacing={1.5} justifyContent="center">
                <Button
                  size="small"
                  variant="outlined"
                  color="success"
                  onClick={() => handleSimulateMomoCallback(0)}
                  disabled={callbackProcessing}
                  sx={{ fontWeight: 700 }}
                >
                  Xác Nhận Thành Công
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={() => handleSimulateMomoCallback(1)}
                  disabled={callbackProcessing}
                >
                  Báo Lỗi Thất Bại
                </Button>
              </Stack>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setMomoModalOpen(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MemberMemberships;
