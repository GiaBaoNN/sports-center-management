import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  Stack,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Drawer,
  Divider,
} from '@mui/material';
import {
  PersonAdd as AddMemberIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  CheckCircle as ActiveIcon,
} from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';
import { receptionApi } from '../../services/api';

const ReceptionMembers = () => {
  const [searchParams] = useSearchParams();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchPhone, setSearchPhone] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Register modal
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [newMember, setNewMember] = useState({
    username: '',
    password: 'password123',
    fullName: '',
    email: '',
    phone: '',
  });

  // Member details drawer
  const [selectedMember, setSelectedMember] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [memberMemberships, setMemberMemberships] = useState([]);
  const [memberPayments, setMemberPayments] = useState([]);
  const [memberInvoices, setMemberInvoices] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const fetchMembers = () => {
    setLoading(true);
    receptionApi
      .getAllMembers()
      .then((data) => {
        setMembers(data || []);
        const paramSearch = searchParams.get('search');
        if (paramSearch) {
          setSearchPhone(paramSearch);
        }
      })
      .catch((err) => {
        setError(err.message || 'Không thể tải danh sách hội viên.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMembers();
  }, [searchParams]);

  const handleRegisterMember = async (e) => {
    e.preventDefault();
    if (!newMember.username || !newMember.fullName || !newMember.phone) {
      setError('Vui lòng điền các trường bắt buộc (Username, Họ tên, Số điện thoại).');
      return;
    }

    setRegistering(true);
    setError('');
    setSuccessMsg('');

    try {
      await receptionApi.registerMember({
        ...newMember,
        role: 'Member',
      });
      setSuccessMsg(`Đã tạo thành công tài khoản hội viên cho ${newMember.fullName}!`);
      setRegisterModalOpen(false);
      setNewMember({ username: '', password: 'password123', fullName: '', email: '', phone: '' });
      fetchMembers();
    } catch (err) {
      setError(err.message || 'Tạo tài khoản hội viên thất bại.');
    } finally {
      setRegistering(false);
    }
  };

  const handleOpenMemberHistory = (member) => {
    setSelectedMember(member);
    setDrawerOpen(true);
    setHistoryLoading(true);

    Promise.allSettled([
      receptionApi.getMemberMemberships(member.userId),
      receptionApi.getMemberPayments(member.userId),
      receptionApi.getMemberInvoices(member.userId),
    ]).then(([memRes, payRes, invRes]) => {
      if (memRes.status === 'fulfilled') setMemberMemberships(memRes.value || []);
      if (payRes.status === 'fulfilled') setMemberPayments(payRes.value || []);
      if (invRes.status === 'fulfilled') setMemberInvoices(invRes.value || []);
      setHistoryLoading(false);
    });
  };

  const filteredMembers = members.filter((m) => {
    if (!searchPhone.trim()) return true;
    return (
      m.phone?.includes(searchPhone.trim()) ||
      m.fullName?.toLowerCase().includes(searchPhone.trim().toLowerCase()) ||
      m.username?.toLowerCase().includes(searchPhone.trim().toLowerCase())
    );
  });

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
            Quản Lý Hồ Sơ Hội Viên Tại Quầy
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tra cứu thông tin, tạo tài khoản hội viên mới và kiểm tra thẻ tập/lịch sử giao dịch.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddMemberIcon />}
          onClick={() => setRegisterModalOpen(true)}
          sx={{ fontWeight: 700 }}
        >
          Đăng Ký Hội Viên Mới
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

      {/* Search Bar */}
      <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #E2E8F0', mb: 3 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Tìm kiếm theo Số điện thoại, Họ tên hoặc Username..."
          value={searchPhone}
          onChange={(e) => setSearchPhone(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />,
          }}
        />
      </Paper>

      {/* Members Table */}
      <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#F8FAFC' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Họ Và Tên</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Tên Đăng Nhập</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Số Điện Thoại</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Trạng Thái</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">Lịch Sử & Chi Tiết</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMembers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                    Không tìm thấy hội viên nào phù hợp.
                  </TableCell>
                </TableRow>
              ) : (
                filteredMembers.map((m) => (
                  <TableRow key={m.userId} hover>
                    <TableCell sx={{ fontWeight: 600 }}>#{m.userId}</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>{m.fullName}</TableCell>
                    <TableCell>@{m.username}</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>{m.phone}</TableCell>
                    <TableCell>{m.email || '—'}</TableCell>
                    <TableCell>
                      <Chip
                        label={m.isActive ? 'Đang hoạt động' : 'Tạm khóa'}
                        size="small"
                        color={m.isActive ? 'success' : 'default'}
                        sx={{ fontWeight: 700 }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<ViewIcon />}
                        onClick={() => handleOpenMemberHistory(m)}
                        sx={{ fontWeight: 700, fontSize: '0.75rem' }}
                      >
                        Xem Lịch Sử
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Register Member Dialog */}
      <Dialog open={registerModalOpen} onClose={() => setRegisterModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Đăng Ký Hội Viên Mới Tại Quầy Lễ Tân</DialogTitle>
        <Box component="form" onSubmit={handleRegisterMember}>
          <DialogContent>
            <Stack spacing={2.5}>
              <TextField
                required
                fullWidth
                label="Họ và tên hội viên"
                value={newMember.fullName}
                onChange={(e) => setNewMember({ ...newMember, fullName: e.target.value })}
                placeholder="Ví dụ: Nguyễn Văn An"
              />

              <TextField
                required
                fullWidth
                label="Số điện thoại"
                value={newMember.phone}
                onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                placeholder="Ví dụ: 0912345678 (10-11 số)"
                helperText="Số điện thoại sẽ dùng làm tài khoản đăng nhập"
              />

              <TextField
                required
                fullWidth
                label="Tên đăng nhập (Username)"
                value={newMember.username}
                onChange={(e) => setNewMember({ ...newMember, username: e.target.value })}
                placeholder="Ví dụ: hoangnguyen99"
              />

              <TextField
                fullWidth
                label="Email"
                type="email"
                value={newMember.email}
                onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                placeholder="name@example.com"
              />

              <TextField
                required
                fullWidth
                label="Mật khẩu khởi tạo"
                value={newMember.password}
                onChange={(e) => setNewMember({ ...newMember, password: e.target.value })}
                helperText="Mặc định: password123 (Hội viên có thể tự đổi sau)"
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setRegisterModalOpen(false)} disabled={registering}>
              Hủy
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={registering} sx={{ fontWeight: 700 }}>
              {registering ? 'Đang đăng ký...' : 'Xác Nhận Tạo Thẻ'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Member History Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: { xs: 320, sm: 460 }, p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>
            Hồ Sơ: {selectedMember?.fullName}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            SĐT: {selectedMember?.phone} | Mã hội viên: #{selectedMember?.userId}
          </Typography>

          <Divider sx={{ my: 2 }} />

          {historyLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Stack spacing={3}>
              {/* Memberships */}
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, color: 'primary.main' }}>
                  LỊCH SỬ GÓI TẬP ({memberMemberships.length})
                </Typography>
                {memberMemberships.length === 0 ? (
                  <Typography variant="caption" color="text.secondary">
                    Chưa đăng ký gói nào.
                  </Typography>
                ) : (
                  <Stack spacing={1}>
                    {memberMemberships.map((m) => (
                      <Box key={m.membershipId} sx={{ p: 1.5, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px solid #E2E8F0' }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {m.packageName || `Gói #${m.packageId}`}
                          </Typography>
                          <Chip label={m.status} size="small" color={m.status === 'Active' ? 'success' : 'default'} sx={{ height: 20, fontSize: '0.65rem' }} />
                        </Stack>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                          Thời hạn: {m.startDate} đến {m.endDate}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                )}
              </Box>

              {/* Payments */}
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, color: '#16A34A' }}>
                  LỊCH SỬ THANH TOÁN ({memberPayments.length})
                </Typography>
                {memberPayments.length === 0 ? (
                  <Typography variant="caption" color="text.secondary">
                    Chưa có giao dịch thanh toán.
                  </Typography>
                ) : (
                  <Stack spacing={1}>
                    {memberPayments.map((p) => (
                      <Box key={p.paymentId} sx={{ p: 1.5, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px solid #E2E8F0' }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {Number(p.amount).toLocaleString('vi-VN')} đ ({p.paymentMethod})
                          </Typography>
                          <Chip label={p.status} size="small" color={p.status === 'Paid' ? 'success' : 'warning'} sx={{ height: 20, fontSize: '0.65rem' }} />
                        </Stack>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                          Ngày TT: {new Date(p.paymentDate).toLocaleDateString('vi-VN')} | Mã: #{p.paymentId}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                )}
              </Box>

              {/* Invoices */}
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, color: '#7C3AED' }}>
                  HÓA ĐƠN ĐÃ XUẤT ({memberInvoices.length})
                </Typography>
                {memberInvoices.length === 0 ? (
                  <Typography variant="caption" color="text.secondary">
                    Chưa có hóa đơn nào.
                  </Typography>
                ) : (
                  <Stack spacing={1}>
                    {memberInvoices.map((inv) => (
                      <Box key={inv.invoiceId} sx={{ p: 1.5, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px solid #E2E8F0' }}>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          Số HĐ: #{inv.invoiceId} - {Number(inv.totalAmount).toLocaleString('vi-VN')} đ
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Ngày phát hành: {new Date(inv.issueDate).toLocaleDateString('vi-VN')}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                )}
              </Box>
            </Stack>
          )}
        </Box>
      </Drawer>
    </Box>
  );
};

export default ReceptionMembers;
