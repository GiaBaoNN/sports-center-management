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
  TextField,
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
  Add as AddIcon,
  Edit as EditIcon,
  ToggleOn as ActiveIcon,
  ToggleOff as InactiveIcon,
} from '@mui/icons-material';
import { adminApi } from '../../services/api';

const AdminPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Create Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newPkg, setNewPkg] = useState({
    name: '',
    description: '',
    durationDays: 30,
    price: 500000,
  });

  // Edit Modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editPkg, setEditPkg] = useState({
    id: null,
    name: '',
    description: '',
    durationDays: 30,
    price: 500000,
  });

  const fetchPackages = () => {
    setLoading(true);
    adminApi
      .getAllPackages()
      .then((data) => {
        setPackages(data || []);
      })
      .catch((err) => {
        setError(err.message || 'Không thể tải danh sách gói tập.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleCreatePackage = async (e) => {
    e.preventDefault();
    if (!newPkg.name || !newPkg.price || !newPkg.durationDays) return;

    setCreating(true);
    setError('');
    setSuccessMsg('');

    try {
      await adminApi.createPackage({
        name: newPkg.name.trim(),
        description: newPkg.description.trim() || null,
        durationDays: Number(newPkg.durationDays),
        price: Number(newPkg.price),
      });
      setSuccessMsg(`Đã tạo thành công gói hội viên mới: ${newPkg.name}!`);
      setCreateModalOpen(false);
      setNewPkg({ name: '', description: '', durationDays: 30, price: 500000 });
      fetchPackages();
    } catch (err) {
      setError(err.message || 'Tạo gói tập thất bại.');
    } finally {
      setCreating(false);
    }
  };

  const handleOpenEdit = (pkg) => {
    setEditPkg({
      id: pkg.packageId || pkg.id,
      name: pkg.name || '',
      description: pkg.description || '',
      durationDays: pkg.durationDays || 30,
      price: pkg.price || 500000,
    });
    setEditModalOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setEditing(true);
    setError('');
    setSuccessMsg('');

    try {
      await adminApi.updatePackage(editPkg.id, {
        name: editPkg.name.trim(),
        description: editPkg.description.trim() || null,
        durationDays: Number(editPkg.durationDays),
        price: Number(editPkg.price),
      });
      setSuccessMsg(`Đã cập nhật thông tin gói #${editPkg.id} thành công!`);
      setEditModalOpen(false);
      fetchPackages();
    } catch (err) {
      setError(err.message || 'Cập nhật thất bại.');
    } finally {
      setEditing(false);
    }
  };

  const handleToggleActive = async (id) => {
    try {
      await adminApi.togglePackageActive(id);
      fetchPackages();
    } catch (err) {
      setError(err.message || 'Không thể đổi trạng thái gói tập.');
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
            Quản Lý Gói Dịch Vụ Hội Viên
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Thiết lập thời hạn, mức giá và trạng thái kích hoạt cho các gói tập tại AURA SPORT.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setCreateModalOpen(true)}
          sx={{ fontWeight: 700 }}
        >
          Tạo Gói Tập Mới
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

      {/* Packages Table */}
      <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#F8FAFC' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Tên Gói</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Mô Tả</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Thời Hạn (Ngày)</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Mức Giá</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Trạng Thái</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">Hành Động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {packages.map((pkg) => {
                const id = pkg.packageId || pkg.id;
                const isActive = pkg.isActive !== false;
                return (
                  <TableRow key={id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>#{id}</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: 'primary.main' }}>{pkg.name}</TableCell>
                    <TableCell sx={{ maxWidth: 300, color: 'text.secondary' }}>{pkg.description || '—'}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{pkg.durationDays} ngày</TableCell>
                    <TableCell sx={{ fontWeight: 800, color: 'secondary.main', fontSize: '1rem' }}>
                      {Number(pkg.price).toLocaleString('vi-VN')} đ
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={isActive ? 'Đang bán' : 'Tạm ẩn'}
                        size="small"
                        color={isActive ? 'success' : 'default'}
                        sx={{ fontWeight: 700 }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Tooltip title="Chỉnh sửa">
                          <IconButton size="small" color="primary" onClick={() => handleOpenEdit(pkg)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={isActive ? 'Tạm ngưng bán' : 'Bật mở bán'}>
                          <IconButton
                            size="small"
                            color={isActive ? 'error' : 'success'}
                            onClick={() => handleToggleActive(id)}
                          >
                            {isActive ? <ActiveIcon fontSize="small" /> : <InactiveIcon fontSize="small" />}
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Create Dialog */}
      <Dialog open={createModalOpen} onClose={() => setCreateModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Tạo Mới Gói Hội Viên</DialogTitle>
        <Box component="form" onSubmit={handleCreatePackage}>
          <DialogContent>
            <Stack spacing={2.5}>
              <TextField
                required
                fullWidth
                label="Tên Gói Tập"
                value={newPkg.name}
                onChange={(e) => setNewPkg({ ...newPkg, name: e.target.value })}
                placeholder="Ví dụ: VIP Diamond"
              />

              <TextField
                fullWidth
                multiline
                rows={2}
                label="Mô tả quyền lợi gói"
                value={newPkg.description}
                onChange={(e) => setNewPkg({ ...newPkg, description: e.target.value })}
                placeholder="Quyền lợi tập gym, hồ bơi, sauna..."
              />

              <TextField
                required
                fullWidth
                type="number"
                label="Thời hạn sử dụng (Số ngày)"
                value={newPkg.durationDays}
                onChange={(e) => setNewPkg({ ...newPkg, durationDays: e.target.value })}
                helperText="Ví dụ: 30, 90, 180 hoặc 365 ngày"
              />

              <TextField
                required
                fullWidth
                type="number"
                label="Giá gói tập (VNĐ)"
                value={newPkg.price}
                onChange={(e) => setNewPkg({ ...newPkg, price: e.target.value })}
                placeholder="500000"
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setCreateModalOpen(false)} disabled={creating}>
              Hủy
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={creating} sx={{ fontWeight: 700 }}>
              {creating ? 'Đang tạo...' : 'Xác Nhận Tạo Gói'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Chỉnh Sửa Gói #{editPkg.id}</DialogTitle>
        <Box component="form" onSubmit={handleSaveEdit}>
          <DialogContent>
            <Stack spacing={2.5}>
              <TextField
                required
                fullWidth
                label="Tên Gói Tập"
                value={editPkg.name}
                onChange={(e) => setEditPkg({ ...editPkg, name: e.target.value })}
              />

              <TextField
                fullWidth
                multiline
                rows={2}
                label="Mô tả quyền lợi"
                value={editPkg.description}
                onChange={(e) => setEditPkg({ ...editPkg, description: e.target.value })}
              />

              <TextField
                required
                fullWidth
                type="number"
                label="Thời hạn (Ngày)"
                value={editPkg.durationDays}
                onChange={(e) => setEditPkg({ ...editPkg, durationDays: e.target.value })}
              />

              <TextField
                required
                fullWidth
                type="number"
                label="Giá gói (VNĐ)"
                value={editPkg.price}
                onChange={(e) => setEditPkg({ ...editPkg, price: e.target.value })}
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

export default AdminPackages;
