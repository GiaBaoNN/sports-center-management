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
  Stack,
  TextField,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  CardMembership as MembershipIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { adminApi } from '../../services/api';

const statusColorMap = {
  Active: 'success',
  Pending: 'warning',
  Expired: 'default',
  Cancelled: 'error',
};

const AdminMemberships = () => {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi
      .getAllMemberships()
      .then((data) => {
        setMemberships(data || []);
      })
      .catch((err) => {
        setError(err.message || 'Không thể tải toàn bộ danh sách thẻ hội viên.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  const filtered = memberships.filter((m) => {
    if (statusFilter !== 'ALL' && m.status !== statusFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const userName = m.user?.fullName?.toLowerCase() || '';
      const phone = m.user?.phone || '';
      const pkg = m.packageName?.toLowerCase() || m.packageEntity?.name?.toLowerCase() || '';
      return userName.includes(q) || phone.includes(q) || pkg.includes(q) || String(m.membershipId).includes(q);
    }
    return true;
  });

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          Quản Lý Toàn Bộ Thẻ Hội Viên (Memberships)
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Theo dõi tổng thể các hợp đồng gói tập, thời hạn sử dụng và tình trạng hoạt động của hội viên trong trung tâm.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Filter Bar */}
      <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #E2E8F0', mb: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems="center">
          <TextField
            size="small"
            placeholder="Tìm theo tên hội viên, số điện thoại hoặc mã thẻ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: { xs: '100%', sm: 380 } }}
            InputProps={{
              startAdornment: <SearchIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />,
            }}
          />

          <Stack direction="row" spacing={1} flexWrap="wrap">
            {['ALL', 'Active', 'Pending', 'Expired', 'Cancelled'].map((st) => (
              <Chip
                key={st}
                label={st === 'ALL' ? 'Tất Cả' : st}
                onClick={() => setStatusFilter(st)}
                color={statusFilter === st ? 'primary' : 'default'}
                variant={statusFilter === st ? 'filled' : 'outlined'}
                sx={{ fontWeight: 700 }}
              />
            ))}
          </Stack>
        </Stack>
      </Paper>

      {/* Memberships Table */}
      <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#F8FAFC' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Mã Thẻ</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Hội Viên</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Số Điện Thoại</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Gói Đăng Ký</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Ngày Bắt Đầu</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Ngày Hết Hạn</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Trạng Thái</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                    Không có thẻ hội viên nào phù hợp bộ lọc.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((m) => (
                  <TableRow key={m.membershipId} hover>
                    <TableCell sx={{ fontWeight: 600 }}>#{m.membershipId}</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>{m.user?.fullName || `Hội viên #${m.userId}`}</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>{m.user?.phone || '—'}</TableCell>
                    <TableCell>{m.packageName || m.packageEntity?.name || `Gói #${m.packageId}`}</TableCell>
                    <TableCell>{m.startDate}</TableCell>
                    <TableCell>{m.endDate}</TableCell>
                    <TableCell>
                      <Chip
                        label={m.status}
                        size="small"
                        color={statusColorMap[m.status] || 'default'}
                        sx={{ fontWeight: 800 }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default AdminMemberships;
