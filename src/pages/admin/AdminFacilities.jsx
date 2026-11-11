import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
  MeetingRoom as RoomIcon,
  SportsTennis as SportIcon,
} from '@mui/icons-material';
import { adminApi, classApi } from '../../services/api';

const AdminFacilities = () => {
  const [sports, setSports] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Sport Modal
  const [sportModalOpen, setSportModalOpen] = useState(false);
  const [sportForm, setSportForm] = useState({ id: null, name: '', description: '' });
  const [savingSport, setSavingSport] = useState(false);

  // Room Modal
  const [roomModalOpen, setRoomModalOpen] = useState(false);
  const [roomForm, setRoomForm] = useState({ id: null, roomName: '', maxCapacity: 20, location: '' });
  const [savingRoom, setSavingRoom] = useState(false);

  const loadData = () => {
    setLoading(true);
    Promise.allSettled([classApi.getSports(), adminApi.getAllRooms()])
      .then(([sportsRes, roomsRes]) => {
        if (sportsRes.status === 'fulfilled') setSports(sportsRes.value || []);
        if (roomsRes.status === 'fulfilled') setRooms(roomsRes.value || []);
      })
      .catch((err) => {
        setError(err.message || 'Không thể tải danh sách môn và phòng tập.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  // Save sport
  const handleSaveSport = async (e) => {
    e.preventDefault();
    if (!sportForm.name.trim()) return;
    setSavingSport(true);
    setError('');
    setSuccessMsg('');

    try {
      if (sportForm.id) {
        await adminApi.updateSport(sportForm.id, sportForm.name.trim(), sportForm.description.trim());
        setSuccessMsg(`Đã cập nhật môn thể thao #${sportForm.id} thành công!`);
      } else {
        await adminApi.createSport(sportForm.name.trim(), sportForm.description.trim());
        setSuccessMsg(`Đã thêm mới môn thể thao "${sportForm.name}"!`);
      }
      setSportModalOpen(false);
      loadData();
    } catch (err) {
      setError(err.message || 'Lưu môn thể thao thất bại.');
    } finally {
      setSavingSport(false);
    }
  };

  // Save room
  const handleSaveRoom = async (e) => {
    e.preventDefault();
    if (!roomForm.roomName.trim() || !roomForm.maxCapacity) return;
    setSavingRoom(true);
    setError('');
    setSuccessMsg('');

    try {
      if (roomForm.id) {
        await adminApi.updateRoom(roomForm.id, roomForm.roomName.trim(), Number(roomForm.maxCapacity), roomForm.location.trim());
        setSuccessMsg(`Đã cập nhật phòng #${roomForm.id} thành công!`);
      } else {
        await adminApi.createRoom(roomForm.roomName.trim(), Number(roomForm.maxCapacity), roomForm.location.trim());
        setSuccessMsg(`Đã thêm mới phòng tập "${roomForm.roomName}"!`);
      }
      setRoomModalOpen(false);
      loadData();
    } catch (err) {
      setError(err.message || 'Lưu phòng tập thất bại.');
    } finally {
      setSavingRoom(false);
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
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          Quản Lý Môn Thể Thao & Cơ Sở Phòng Tập
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Cấu hình danh mục các môn thể thao (Yoga, Cầu lông, Bơi lội...) và sức chứa của các phòng tập trực thuộc.
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

      <Grid container spacing={3}>
        {/* Left: Sports Management */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', height: '100%' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
                <SportIcon color="primary" /> Bộ Môn Thể Thao ({sports.length})
              </Typography>
              <Button
                size="small"
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => {
                  setSportForm({ id: null, name: '', description: '' });
                  setSportModalOpen(true);
                }}
                sx={{ fontWeight: 700 }}
              >
                Thêm Môn
              </Button>
            </Stack>

            <TableContainer>
              <Table size="small">
                <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Mã</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Tên Môn</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Mô Tả</TableCell>
                    <TableCell sx={{ fontWeight: 700 }} align="right">Sửa</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sports.map((s) => (
                    <TableRow key={s.sportId || s.id} hover>
                      <TableCell sx={{ fontWeight: 600 }}>#{s.sportId || s.id}</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>{s.name}</TableCell>
                      <TableCell sx={{ color: 'text.secondary', maxWidth: 200 }}>{s.description || '—'}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => {
                            setSportForm({ id: s.sportId || s.id, name: s.name, description: s.description || '' });
                            setSportModalOpen(true);
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Right: Rooms Management */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', height: '100%' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1 }}>
                <RoomIcon color="secondary" /> Phòng Tập & Khu Vực ({rooms.length})
              </Typography>
              <Button
                size="small"
                variant="contained"
                color="secondary"
                startIcon={<AddIcon />}
                onClick={() => {
                  setRoomForm({ id: null, roomName: '', maxCapacity: 20, location: 'Tầng 1' });
                  setRoomModalOpen(true);
                }}
                sx={{ fontWeight: 700 }}
              >
                Thêm Phòng
              </Button>
            </Stack>

            <TableContainer>
              <Table size="small">
                <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Mã</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Tên Phòng</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Sức Chứa</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Vị Trí</TableCell>
                    <TableCell sx={{ fontWeight: 700 }} align="right">Sửa</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rooms.map((r) => (
                    <TableRow key={r.roomId} hover>
                      <TableCell sx={{ fontWeight: 600 }}>#{r.roomId}</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>{r.roomName}</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>{r.maxCapacity} người</TableCell>
                      <TableCell sx={{ color: 'text.secondary' }}>{r.location || 'Tầng 1'}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          color="secondary"
                          onClick={() => {
                            setRoomForm({ id: r.roomId, roomName: r.roomName, maxCapacity: r.maxCapacity, location: r.location || '' });
                            setRoomModalOpen(true);
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Sport Dialog */}
      <Dialog open={sportModalOpen} onClose={() => setSportModalOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>
          {sportForm.id ? `Chỉnh Sửa Môn #${sportForm.id}` : 'Thêm Mới Môn Thể Thao'}
        </DialogTitle>
        <Box component="form" onSubmit={handleSaveSport}>
          <DialogContent>
            <Stack spacing={2}>
              <TextField
                required
                fullWidth
                label="Tên môn thể thao"
                value={sportForm.name}
                onChange={(e) => setSportForm({ ...sportForm, name: e.target.value })}
                placeholder="Ví dụ: Pilates, Boxing..."
              />
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Mô tả bộ môn"
                value={sportForm.description}
                onChange={(e) => setSportForm({ ...sportForm, description: e.target.value })}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setSportModalOpen(false)}>Hủy</Button>
            <Button type="submit" variant="contained" color="primary" disabled={savingSport} sx={{ fontWeight: 700 }}>
              {savingSport ? 'Đang lưu...' : 'Lưu'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Room Dialog */}
      <Dialog open={roomModalOpen} onClose={() => setRoomModalOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>
          {roomForm.id ? `Chỉnh Sửa Phòng #${roomForm.id}` : 'Thêm Mới Phòng Tập'}
        </DialogTitle>
        <Box component="form" onSubmit={handleSaveRoom}>
          <DialogContent>
            <Stack spacing={2}>
              <TextField
                required
                fullWidth
                label="Tên phòng tập"
                value={roomForm.roomName}
                onChange={(e) => setRoomForm({ ...roomForm, roomName: e.target.value })}
                placeholder="Ví dụ: Room D - Cardio Zone"
              />
              <TextField
                required
                fullWidth
                type="number"
                label="Sức chứa tối đa (Max Capacity)"
                value={roomForm.maxCapacity}
                onChange={(e) => setRoomForm({ ...roomForm, maxCapacity: e.target.value })}
              />
              <TextField
                fullWidth
                label="Vị trí / Tầng"
                value={roomForm.location}
                onChange={(e) => setRoomForm({ ...roomForm, location: e.target.value })}
                placeholder="Ví dụ: Tầng 2, Tòa nhà A"
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setRoomModalOpen(false)}>Hủy</Button>
            <Button type="submit" variant="contained" color="secondary" disabled={savingRoom} sx={{ fontWeight: 700 }}>
              {savingRoom ? 'Đang lưu...' : 'Lưu Phòng'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default AdminFacilities;
