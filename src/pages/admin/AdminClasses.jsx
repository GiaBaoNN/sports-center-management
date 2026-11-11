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
  Add as AddIcon,
  Edit as EditIcon,
  Event as AddScheduleIcon,
  CheckCircle as ActiveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { adminApi, classApi } from '../../services/api';

const statusColorMap = {
  Upcoming: 'info',
  Ongoing: 'success',
  Completed: 'default',
  Cancelled: 'error',
};

const AdminClasses = () => {
  const [classes, setClasses] = useState([]);
  const [sports, setSports] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Create class modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newClass, setNewClass] = useState({
    className: '',
    sportId: '',
    roomId: '',
    coachId: '',
  });

  // Edit class modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editClass, setEditClass] = useState({
    classId: null,
    className: '',
    sportId: '',
    roomId: '',
    coachId: '',
  });

  // Add schedule modal
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduling, setScheduling] = useState(false);
  const [selectedClassForSchedule, setSelectedClassForSchedule] = useState(null);
  const [newSchedule, setNewSchedule] = useState({
    classDate: '',
    startDatetime: '',
    endDatetime: '',
  });

  const loadData = () => {
    setLoading(true);
    Promise.allSettled([
      adminApi.getAllClasses(),
      classApi.getSports(),
      adminApi.getAllRooms(),
      adminApi.getAllUsers(),
    ])
      .then(([classesRes, sportsRes, roomsRes, usersRes]) => {
        const clsList = classesRes.status === 'fulfilled' ? classesRes.value || [] : [];
        const spList = sportsRes.status === 'fulfilled' ? sportsRes.value || [] : [];
        const rmList = roomsRes.status === 'fulfilled' ? roomsRes.value || [] : [];
        const userList = usersRes.status === 'fulfilled' ? usersRes.value || [] : [];
        const coachList = userList.filter((u) => u.role === 'Coach');

        setClasses(clsList);
        setSports(spList);
        setRooms(rmList);
        setCoaches(coachList);

        if (spList.length > 0) setNewClass((prev) => ({ ...prev, sportId: spList[0].sportId || spList[0].id }));
        if (rmList.length > 0) setNewClass((prev) => ({ ...prev, roomId: rmList[0].roomId }));
        if (coachList.length > 0) setNewClass((prev) => ({ ...prev, coachId: coachList[0].userId }));
      })
      .catch((err) => {
        setError(err.message || 'Không thể tải danh mục lớp học.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateClass = async (e) => {
    e.preventDefault();
    if (!newClass.className.trim() || !newClass.sportId || !newClass.roomId || !newClass.coachId) {
      setError('Vui lòng điền đầy đủ thông tin tạo lớp học.');
      return;
    }

    setCreating(true);
    setError('');
    setSuccessMsg('');

    try {
      await adminApi.createClass({
        className: newClass.className.trim(),
        sportId: Number(newClass.sportId),
        roomId: Number(newClass.roomId),
        coachId: Number(newClass.coachId),
      });
      setSuccessMsg(`Đã tạo thành công lớp học "${newClass.className}"!`);
      setCreateModalOpen(false);
      setNewClass({ className: '', sportId: sports[0]?.sportId || 1, roomId: rooms[0]?.roomId || 1, coachId: coaches[0]?.userId || 3 });
      loadData();
    } catch (err) {
      setError(err.message || 'Tạo lớp học thất bại.');
    } finally {
      setCreating(false);
    }
  };

  const handleOpenEdit = (c) => {
    setEditClass({
      classId: c.classId,
      className: c.className || '',
      sportId: c.sport?.sportId || sports[0]?.sportId || 1,
      roomId: c.room?.roomId || rooms[0]?.roomId || 1,
      coachId: c.coach?.userId || coaches[0]?.userId || 3,
    });
    setEditModalOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setEditing(true);
    setError('');
    setSuccessMsg('');

    try {
      await adminApi.updateClass(editClass.classId, {
        className: editClass.className.trim(),
        sportId: Number(editClass.sportId),
        roomId: Number(editClass.roomId),
        coachId: Number(editClass.coachId),
      });
      setSuccessMsg(`Đã cập nhật lớp #${editClass.classId} thành công!`);
      setEditModalOpen(false);
      loadData();
    } catch (err) {
      setError(err.message || 'Cập nhật thất bại.');
    } finally {
      setEditing(false);
    }
  };

  const handleStatusChange = async (classId, newStatus) => {
    try {
      await adminApi.updateClassStatus(classId, newStatus);
      setSuccessMsg(`Đã đổi trạng thái lớp #${classId} sang ${newStatus}!`);
      loadData();
    } catch (err) {
      setError(err.message || 'Không thể cập nhật trạng thái lớp học.');
    }
  };

  const handleOpenScheduleModal = (c) => {
    setSelectedClassForSchedule(c);
    const today = new Date().toISOString().split('T')[0];
    setNewSchedule({
      classDate: today,
      startDatetime: `${today}T18:00:00`,
      endDatetime: `${today}T19:30:00`,
    });
    setScheduleModalOpen(true);
  };

  const handleCreateSchedule = async (e) => {
    e.preventDefault();
    if (!newSchedule.classDate || !newSchedule.startDatetime || !newSchedule.endDatetime) return;

    setScheduling(true);
    setError('');
    setSuccessMsg('');

    try {
      await adminApi.createSchedule({
        classId: selectedClassForSchedule.classId,
        classDate: newSchedule.classDate,
        startDatetime: newSchedule.startDatetime,
        endDatetime: newSchedule.endDatetime,
      });
      setSuccessMsg(`Đã thêm buổi học mới cho lớp ${selectedClassForSchedule.className}!`);
      setScheduleModalOpen(false);
    } catch (err) {
      setError(err.message || 'Thêm lịch học không thành công.');
    } finally {
      setScheduling(false);
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
            Quản Lý Lớp Học & Thời Khóa Biểu
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tạo lớp thể thao mới, phân công HLV, gán phòng tập và cập nhật lịch các buổi học.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setCreateModalOpen(true)}
          sx={{ fontWeight: 700 }}
        >
          Tạo Lớp Học Mới
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

      {/* Classes Table */}
      <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#F8FAFC' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Mã Lớp</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Tên Lớp Học</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Bộ Môn</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Phòng Tập</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>HLV Phụ Trách</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Trạng Thái</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">Hành Động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {classes.map((c) => (
                <TableRow key={c.classId} hover>
                  <TableCell sx={{ fontWeight: 600 }}>#{c.classId}</TableCell>
                  <TableCell sx={{ fontWeight: 800, color: '#0F172A' }}>{c.className}</TableCell>
                  <TableCell>{c.sport?.name || 'Môn thể thao'}</TableCell>
                  <TableCell>{c.room?.roomName || 'Phòng tập'}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{c.coach?.fullName || 'HLV'}</TableCell>
                  <TableCell>
                    <Chip
                      label={c.status}
                      size="small"
                      color={statusColorMap[c.status] || 'default'}
                      sx={{ fontWeight: 700 }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Tooltip title="Thêm buổi học vào lịch">
                        <IconButton size="small" color="secondary" onClick={() => handleOpenScheduleModal(c)}>
                          <AddScheduleIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Chỉnh sửa thông tin lớp">
                        <IconButton size="small" color="primary" onClick={() => handleOpenEdit(c)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {c.status !== 'Cancelled' ? (
                        <Tooltip title="Hủy lớp này">
                          <IconButton size="small" color="error" onClick={() => handleStatusChange(c.classId, 'Cancelled')}>
                            <CancelIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Tooltip title="Mở lại lớp">
                          <IconButton size="small" color="success" onClick={() => handleStatusChange(c.classId, 'Upcoming')}>
                            <ActiveIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Create Class Dialog */}
      <Dialog open={createModalOpen} onClose={() => setCreateModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Tạo Mới Lớp Học Thể Thao</DialogTitle>
        <Box component="form" onSubmit={handleCreateClass}>
          <DialogContent>
            <Stack spacing={2.5}>
              <TextField
                required
                fullWidth
                label="Tên Lớp Học"
                value={newClass.className}
                onChange={(e) => setNewClass({ ...newClass, className: e.target.value })}
                placeholder="Ví dụ: Yoga Dẻo Dai Khớp"
              />

              <TextField
                select
                required
                fullWidth
                label="Chọn Bộ Môn Thể Thao"
                value={newClass.sportId}
                onChange={(e) => setNewClass({ ...newClass, sportId: Number(e.target.value) })}
              >
                {sports.map((s) => (
                  <MenuItem key={s.sportId || s.id} value={s.sportId || s.id}>
                    {s.name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                required
                fullWidth
                label="Chọn Phòng Tập"
                value={newClass.roomId}
                onChange={(e) => setNewClass({ ...newClass, roomId: Number(e.target.value) })}
              >
                {rooms.map((r) => (
                  <MenuItem key={r.roomId} value={r.roomId}>
                    {r.roomName} (Sức chứa tối đa: {r.maxCapacity} học viên)
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                required
                fullWidth
                label="Chỉ Định Huấn Luyện Viên"
                value={newClass.coachId}
                onChange={(e) => setNewClass({ ...newClass, coachId: Number(e.target.value) })}
              >
                {coaches.map((coach) => (
                  <MenuItem key={coach.userId} value={coach.userId}>
                    {coach.fullName} (@{coach.username})
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setCreateModalOpen(false)} disabled={creating}>
              Hủy
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={creating} sx={{ fontWeight: 700 }}>
              {creating ? 'Đang tạo...' : 'Xác Nhận Tạo Lớp'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Edit Class Dialog */}
      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Chỉnh Sửa Lớp #{editClass.classId}</DialogTitle>
        <Box component="form" onSubmit={handleSaveEdit}>
          <DialogContent>
            <Stack spacing={2.5}>
              <TextField
                required
                fullWidth
                label="Tên Lớp Học"
                value={editClass.className}
                onChange={(e) => setEditClass({ ...editClass, className: e.target.value })}
              />

              <TextField
                select
                required
                fullWidth
                label="Chọn Bộ Môn"
                value={editClass.sportId}
                onChange={(e) => setEditClass({ ...editClass, sportId: Number(e.target.value) })}
              >
                {sports.map((s) => (
                  <MenuItem key={s.sportId || s.id} value={s.sportId || s.id}>
                    {s.name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                required
                fullWidth
                label="Chọn Phòng Tập"
                value={editClass.roomId}
                onChange={(e) => setEditClass({ ...editClass, roomId: Number(e.target.value) })}
              >
                {rooms.map((r) => (
                  <MenuItem key={r.roomId} value={r.roomId}>
                    {r.roomName}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                required
                fullWidth
                label="Huấn Luyện Viên"
                value={editClass.coachId}
                onChange={(e) => setEditClass({ ...editClass, coachId: Number(e.target.value) })}
              >
                {coaches.map((coach) => (
                  <MenuItem key={coach.userId} value={coach.userId}>
                    {coach.fullName}
                  </MenuItem>
                ))}
              </TextField>
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

      {/* Add Schedule Dialog */}
      <Dialog open={scheduleModalOpen} onClose={() => setScheduleModalOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>
          Thêm Buổi Học: {selectedClassForSchedule?.className}
        </DialogTitle>
        <Box component="form" onSubmit={handleCreateSchedule}>
          <DialogContent>
            <Stack spacing={2.5}>
              <TextField
                required
                fullWidth
                type="date"
                label="Ngày học (classDate)"
                InputLabelProps={{ shrink: true }}
                value={newSchedule.classDate}
                onChange={(e) => {
                  const d = e.target.value;
                  setNewSchedule({
                    classDate: d,
                    startDatetime: `${d}T18:00:00`,
                    endDatetime: `${d}T19:30:00`,
                  });
                }}
              />

              <TextField
                required
                fullWidth
                type="datetime-local"
                label="Thời gian bắt đầu (startDatetime)"
                InputLabelProps={{ shrink: true }}
                value={newSchedule.startDatetime}
                onChange={(e) => setNewSchedule({ ...newSchedule, startDatetime: e.target.value })}
              />

              <TextField
                required
                fullWidth
                type="datetime-local"
                label="Thời gian kết thúc (endDatetime)"
                InputLabelProps={{ shrink: true }}
                value={newSchedule.endDatetime}
                onChange={(e) => setNewSchedule({ ...newSchedule, endDatetime: e.target.value })}
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setScheduleModalOpen(false)} disabled={scheduling}>
              Hủy
            </Button>
            <Button type="submit" variant="contained" color="secondary" disabled={scheduling} sx={{ fontWeight: 700 }}>
              {scheduling ? 'Đang thêm...' : 'Lưu Lịch Học'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default AdminClasses;
