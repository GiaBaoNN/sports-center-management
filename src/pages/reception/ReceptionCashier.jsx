import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Stack,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  PointOfSale as CashierIcon,
  CheckCircle as ConfirmIcon,
  ReceiptLong as ReceiptIcon,
} from '@mui/icons-material';
import { receptionApi, adminApi } from '../../services/api';

const ReceptionCashier = () => {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');

  // We load all payments across system
  const [pendingCashList, setPendingCashList] = useState([]);

  const fetchPayments = () => {
    setLoading(true);
    // Since receptionists confirm cash payments for memberships, we check all memberships & payments
    adminApi
      .getAllMemberships()
      .then((data) => {
        setMemberships(data || []);
      })
      .catch((err) => {
        setError(err.message || 'Không thể tải danh sách thu phí.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleOpenConfirm = (membership) => {
    // Generate/use payment ID associated with membership
    setSelectedPaymentId(membership.membershipId);
    setConfirmModalOpen(true);
  };

  const handleConfirmCash = async () => {
    if (!selectedPaymentId) return;
    setConfirming(true);
    setError('');
    setSuccessMsg('');

    try {
      await receptionApi.confirmCashPayment(selectedPaymentId);
      setSuccessMsg(`Đã xác nhận thu tiền mặt thành công cho mã thẻ #${selectedPaymentId}! Gói hội viên đã được kích hoạt.`);
      setConfirmModalOpen(false);
      fetchPayments();
    } catch (err) {
      setError(err.message || 'Xác nhận thu tiền mặt thất bại.');
    } finally {
      setConfirming(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Filter pending memberships with Cash or requiring activation
  const pendingCashMemberships = memberships.filter(
    (m) => m.status === 'Pending'
  );

  const activeCashMemberships = memberships.filter(
    (m) => m.status === 'Active'
  );

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          Quầy Thu Ngân & Xác Nhận Tiền Mặt
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Xác nhận các khoản thu tiền mặt tại quầy để kích hoạt thẻ hội viên và phát hành hóa đơn tự động.
        </Typography>
      </Box>

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

      {/* Pending Cash Table */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, color: 'warning.main', display: 'flex', alignItems: 'center', gap: 1 }}>
          <CashierIcon /> Thẻ Hội Viên Chờ Thu Tiền Mặt ({pendingCashMemberships.length})
        </Typography>

        {pendingCashMemberships.length === 0 ? (
          <Box sx={{ py: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Hiện tại không có khoản thu tiền mặt nào đang chờ duyệt.
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Mã Thẻ</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Hội Viên</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Gói Đăng Ký</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Số Tiền Cần Thu</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Trạng Thái</TableCell>
                  <TableCell sx={{ fontWeight: 700 }} align="right">Xác Nhận</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingCashMemberships.map((m) => {
                  const price = m.amount || m.packageEntity?.price || 500000;
                  return (
                    <TableRow key={m.membershipId}>
                      <TableCell sx={{ fontWeight: 600 }}>#{m.membershipId}</TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          {m.user?.fullName || `Hội viên #${m.userId}`}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          SĐT: {m.user?.phone || 'Chưa cập nhật'}
                        </Typography>
                      </TableCell>
                      <TableCell>{m.packageName || m.packageEntity?.name || `Gói #${m.packageId}`}</TableCell>
                      <TableCell sx={{ fontWeight: 800, color: 'primary.main', fontSize: '1rem' }}>
                        {Number(price).toLocaleString('vi-VN')} đ
                      </TableCell>
                      <TableCell>
                        <Chip label="Chờ Thu Tiền" size="small" color="warning" sx={{ fontWeight: 700 }} />
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          startIcon={<ConfirmIcon />}
                          onClick={() => handleOpenConfirm(m)}
                          sx={{ fontWeight: 700 }}
                        >
                          Xác Nhận Đã Thu
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Activated Memberships Summary */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0' }}>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <ReceiptIcon color="success" /> Các Thẻ Hội Viên Đang Hoạt Động (Đã Thu Phí)
        </Typography>

        <TableContainer>
          <Table size="small">
            <TableHead sx={{ bgcolor: '#F8FAFC' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Mã Thẻ</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Hội Viên</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Gói Tập</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Thời Hạn</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Trạng Thái</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {activeCashMemberships.slice(0, 5).map((m) => (
                <TableRow key={m.membershipId}>
                  <TableCell sx={{ fontWeight: 600 }}>#{m.membershipId}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{m.user?.fullName || `Hội viên #${m.userId}`}</TableCell>
                  <TableCell>{m.packageName || m.packageEntity?.name || `Gói #${m.packageId}`}</TableCell>
                  <TableCell>{m.startDate} đến {m.endDate}</TableCell>
                  <TableCell>
                    <Chip label="Đang hoạt động" size="small" color="success" sx={{ fontWeight: 700 }} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Confirm Dialog */}
      <Dialog open={confirmModalOpen} onClose={() => setConfirmModalOpen(false)}>
        <DialogTitle sx={{ fontWeight: 800 }}>Xác Nhận Đã Thu Tiền Mặt</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Bạn xác nhận đã nhận đủ tiền mặt từ hội viên cho mã thẻ <strong>#{selectedPaymentId}</strong>?
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Hệ thống sẽ chuyển trạng thái thanh toán sang "Đã thu (Paid)", kích hoạt thẻ hội viên thành "Active", và tự động phát hành hóa đơn điện tử tương ứng.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setConfirmModalOpen(false)} disabled={confirming}>
            Hủy
          </Button>
          <Button
            onClick={handleConfirmCash}
            color="success"
            variant="contained"
            disabled={confirming}
            sx={{ fontWeight: 700 }}
          >
            {confirming ? 'Đang xác nhận...' : 'Đồng Ý & Kích Hoạt Thẻ'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ReceptionCashier;
