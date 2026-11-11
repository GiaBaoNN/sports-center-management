import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
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
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  PersonAdd as AddUserIcon,
  Edit as EditIcon,
  ToggleOn as ActiveIcon,
  ToggleOff as InactiveIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { adminApi } from '../../services/api';

const roleColorMap = {
  Manager: 'secondary',
  Coach: 'warning',
  Receptionist: 'info',
  Member: 'primary',
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Create User Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    password: 'password123',
    fullName: '',
    email: '',
    phone: '',
    role: 'Member',
  });

  // Edit User Modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editUser, setEditUser] = useState({
    userId: null,
    username: '',
    fullName: '',
    email: '',
    phone: '',
  });

  const fetchUsers = () => {
    setLoading(true);
    adminApi
      .getAllUsers()
      .then((data) => {
        setUsers(data || []);
      })
      .catch((err) => {
        setError(err.message || 'Không thể tải danh sách tài khoản.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUser.username || !newUser.fullName || !newUser.phone) {
      setError('Vui lòng điền đầy đủ các thông tin bắt buộc.');
      return;
    }

    setCreating(true);
    setError('');
    setSuccessMsg('');

    try {
      await adminApi.createUser(newUser);
      setSuccessMsg(`Đã tạo thành công tài khoản @${newUser.username} với vai trò ${newUser.role}!`);
      setCreateModalOpen(false);
      setNewUser({ username: '', password: 'password123', fullName: '', email: '', phone: '', role: 'Member' });
      fetchUsers();
    } catch (err) {
      setError(err.message || 'Tạo tài khoản không thành công.');
    } finally {
      setCreating(false);
    }
  };

  const handleOpenEdit = (user) => {
    setEditUser({
      userId: user.userId,
      username: user.username || '',
      fullName: user.fullName || '',
      email: user.email || '',
      phone: user.phone || '',
    });
    setEditModalOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setEditing(true);
    setError('');
    setSuccessMsg('');

    try {
      await adminApi.updateUser(editUser.userId, {
        username: editUser.username.trim(),
        fullName: editUser.fullName.trim(),
        email: editUser.email?.trim() || null,
        phone: editUser.phone.trim(),
      });
      setSuccessMsg('Đã cập nhật thông tin người dùng thành công!');
      setEditModalOpen(false);
      fetchUsers();
    } catch (err) {
      setError(err.message || 'Cập nhật thất bại.');
    } finally {
      setEditing(false);
    }
  };

  const handleToggleActive = async (id) => {
    try {
      await adminApi.toggleUserActive(id);
      fetchUsers();
    } catch (err) {
      setError(err.message || 'Không thể thay đổi trạng thái kích hoạt.');
    }
  };

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        u.fullName?.toLowerCase().includes(q) ||
        u.username?.toLowerCase().includes(q) ||
        u.phone?.includes(q)
      );
    }
    return true;
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
            Quản Lý Toàn Bộ Tài Khoản Hệ Thống
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tạo mới, chỉnh sửa thông tin và phân quyền tài khoản Manager, Coach, Receptionist, Member.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddUserIcon />}
          onClick={() => setCreateModalOpen(true)}
          sx={{ fontWeight: 700 }}
        >
          Thêm Tài Khoản Mới
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

      {/* Filter and Search Bar */}
      <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #E2E8F0', mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Tìm theo họ tên, username hoặc số điện thoại..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />,
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {['ALL', 'Manager', 'Coach', 'Receptionist', 'Member'].map((role) => (
                <Chip
                  key={role}
                  label={role === 'ALL' ? 'Tất Cả' : role}
                  onClick={() => setRoleFilter(role)}
                  color={roleFilter === role ? 'primary' : 'default'}
                  variant={roleFilter === role ? 'filled' : 'outlined'}
                  sx={{ fontWeight: 700, mb: 0.5 }}
                />
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Users Table */}
      <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#F8FAFC' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Họ Và Tên</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Tên Đăng Nhập</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Số Điện Thoại</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Vai Trò (Role)</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Trạng Thái</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">Hành Động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                    Không có tài khoản nào phù hợp bộ lọc.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((u) => (
                  <TableRow key={u.userId} hover>
                    <TableCell sx={{ fontWeight: 600 }}>#{u.userId}</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>{u.fullName}</TableCell>
                    <TableCell>@{u.username}</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>{u.phone}</TableCell>
                    <TableCell>
                      <Chip
                        label={u.role}
                        size="small"
                        color={roleColorMap[u.role] || 'default'}
                        sx={{ fontWeight: 800, fontSize: '0.72rem' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={u.isActive ? 'Active' : 'Locked'}
                        size="small"
                        color={u.isActive ? 'success' : 'default'}
                        sx={{ fontWeight: 700 }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="Chỉnh sửa thông tin">
                          <IconButton size="small" color="primary" onClick={() => handleOpenEdit(u)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={u.isActive ? 'Khóa tài khoản' : 'Kích hoạt lại'}>
                          <IconButton
                            size="small"
                            color={u.isActive ? 'error' : 'success'}
                            onClick={() => handleToggleActive(u.userId)}
                          >
                            {u.isActive ? <ActiveIcon fontSize="small" /> : <InactiveIcon fontSize="small" />}
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Create User Dialog */}
      <Dialog open={createModalOpen} onClose={() => setCreateModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Tạo Mới Tài Khoản Hệ Thống</DialogTitle>
        <Box component="form" onSubmit={handleCreateUser}>
          <DialogContent>
            <Stack spacing={2.5}>
              <TextField
                select
                required
                fullWidth
                label="Vai trò (Role)"
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              >
                <MenuItem value="Member">Hội viên (Member)</MenuItem>
                <MenuItem value="Coach">Huấn luyện viên (Coach)</MenuItem>
                <MenuItem value="Receptionist">Lễ tân (Receptionist)</MenuItem>
                <MenuItem value="Manager">Quản lý (Manager)</MenuItem>
              </TextField>

              <TextField
                required
                fullWidth
                label="Họ và tên đầy đủ"
                value={newUser.fullName}
                onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
              />

              <TextField
                required
                fullWidth
                label="Số điện thoại"
                value={newUser.phone}
                onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                placeholder="Ví dụ: 0901000010"
              />

              <TextField
                required
                fullWidth
                label="Tên đăng nhập (Username)"
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              />

              <TextField
                fullWidth
                label="Email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />

              <TextField
                required
                fullWidth
                label="Mật khẩu khởi tạo"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                helperText="Mặc định: password123"
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setCreateModalOpen(false)} disabled={creating}>
              Hủy
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={creating} sx={{ fontWeight: 700 }}>
              {creating ? 'Đang tạo...' : 'Xác Nhận Tạo'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Chỉnh Sửa Người Dùng #{editUser.userId}</DialogTitle>
        <Box component="form" onSubmit={handleSaveEdit}>
          <DialogContent>
            <Stack spacing={2.5}>
              <TextField
                required
                fullWidth
                label="Họ và tên"
                value={editUser.fullName}
                onChange={(e) => setEditUser({ ...editUser, fullName: e.target.value })}
              />
              <TextField
                required
                fullWidth
                label="Tên đăng nhập"
                value={editUser.username}
                onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
              />
              <TextField
                required
                fullWidth
                label="Số điện thoại"
                value={editUser.phone}
                onChange={(e) => setEditUser({ ...editUser, phone: e.target.value })}
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={editUser.email}
                onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setEditModalOpen(false)} disabled={editing}>
              Hủy
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={editing} sx={{ fontWeight: 700 }}>
              {editing ? 'Đang lưu...' : 'Lưu Thay Đổi'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default AdminUsers;
