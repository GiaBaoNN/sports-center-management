import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  MenuItem,
  TextField,
  Button,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  HowToReg as AttendanceIcon,
  CheckCircle as SaveSuccessIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';
import { coachApi } from '../../services/api';

const CoachAttendance = () => {
  const [searchParams] = useSearchParams();

  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [schedules, setSchedules] = useState([]);
  const [selectedScheduleId, setSelectedScheduleId] = useState('');
  const [members, setMembers] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  // Attendance state by registrationId: { status, notes, attendanceId }
  const [attendanceForm, setAttendanceForm] = useState({});

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');

  // 1. Load coach classes
  useEffect(() => {
    coachApi
      .getMyClasses()
      .then((data) => {
        setClasses(data || []);
        const paramClass = searchParams.get('classId');
        if (paramClass) {
          setSelectedClassId(Number(paramClass));
        } else if (data && data.length > 0) {
          setSelectedClassId(data[0].classId);
        }
      })
      .catch((err) => {
        setError(err.message || 'Không thể tải danh sách lớp học của HLV.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [searchParams]);

  // 2. Load schedules and members when class changes
  useEffect(() => {
    if (!selectedClassId) return;
    Promise.allSettled([
      coachApi.getClassSchedules(selectedClassId),
      coachApi.getClassMembers(selectedClassId),
    ]).then(([schRes, memRes]) => {
      const schList = schRes.status === 'fulfilled' ? schRes.value || [] : [];
      const memList = memRes.status === 'fulfilled' ? memRes.value || [] : [];
      setSchedules(schList);
      setMembers(memList.filter((m) => m.status === 'Registered'));

      const paramSch = searchParams.get('scheduleId');
      if (paramSch && schList.some((s) => s.scheduleId === Number(paramSch))) {
        setSelectedScheduleId(Number(paramSch));
      } else if (schList.length > 0) {
        setSelectedScheduleId(schList[0].scheduleId);
      } else {
        setSelectedScheduleId('');
      }
    });
  }, [selectedClassId, searchParams]);

  // 3. Load attendance records when schedule session changes
  useEffect(() => {
    if (!selectedScheduleId) {
      setAttendanceRecords([]);
      setAttendanceForm({});
      return;
    }

    coachApi
      .getAttendanceBySchedule(selectedScheduleId)
      .then((data) => {
        const records = data || [];
        setAttendanceRecords(records);

        // Pre-fill attendance form for each registered member
        const form = {};
        members.forEach((m) => {
          const existing = records.find((a) => a.registrationId === m.registrationId);
          form[m.registrationId] = {
            status: existing ? existing.status : 'Present',
            notes: existing?.notes || '',
            attendanceId: existing?.attendanceId || null,
          };
        });
        setAttendanceForm(form);
      })
      .catch((err) => {
        setError(err.message || 'Lỗi khi tải dữ liệu điểm danh buổi học.');
      });
  }, [selectedScheduleId, members]);

  const handleStatusChange = (regId, status) => {
    setAttendanceForm((prev) => ({
      ...prev,
      [regId]: {
        ...(prev[regId] || {}),
        status,
      },
    }));
  };

  const handleNotesChange = (regId, notes) => {
    setAttendanceForm((prev) => ({
      ...prev,
      [regId]: {
        ...(prev[regId] || {}),
        notes,
      },
    }));
  };

  const handleSaveAttendance = async () => {
    if (!selectedScheduleId || members.length === 0) return;
    setSaving(true);
    setError('');
    setSuccessMsg('');

    try {
      // Save each member's attendance
      for (const m of members) {
        const data = attendanceForm[m.registrationId] || { status: 'Present', notes: '' };
        if (data.attendanceId) {
          await coachApi.updateAttendance(data.attendanceId, {
            status: data.status,
            notes: data.notes,
          });
        } else {
          await coachApi.recordAttendance({
            scheduleId: selectedScheduleId,
            registrationId: m.registrationId,
            status: data.status,
            notes: data.notes,
          });
        }
      }
      setSuccessMsg('Đã lưu dữ liệu điểm danh buổi học thành công vào hệ thống!');

      // Reload attendance records
      const updated = await coachApi.getAttendanceBySchedule(selectedScheduleId);
      setAttendanceRecords(updated || []);
    } catch (err) {
      setError(err.message || 'Lưu điểm danh không thành công.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  const selectedSchedule = schedules.find((s) => s.scheduleId === selectedScheduleId);

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          Điểm Danh & Theo Dõi Chuyên Cần Học Viên
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Ghi nhận tình trạng có mặt, vắng mặt hoặc có phép cho từng học viên theo từng buổi học.
        </Typography>
      </Box>

      {successMsg && (
        <Alert severity="success" icon={<SaveSuccessIcon />} sx={{ mb: 3 }}>
          {successMsg}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Selectors */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', mb: 3 }}>
        <Grid container spacing={2.5}>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Chọn Lớp Học"
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(Number(e.target.value))}
            >
              {classes.map((c) => (
                <MenuItem key={c.classId} value={c.classId}>
                  {c.className} ({c.sport?.name || 'Môn'})
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Chọn Buổi Học (Thời Khóa Biểu)"
              value={selectedScheduleId}
              onChange={(e) => setSelectedScheduleId(Number(e.target.value))}
              disabled={schedules.length === 0}
            >
              {schedules.map((s) => (
                <MenuItem key={s.scheduleId} value={s.scheduleId}>
                  {s.classDate} (
                  {s.startDatetime ? new Date(s.startDatetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''} -{' '}
                  {s.endDatetime ? new Date(s.endDatetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''})
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {/* Attendance Table */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0' }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} sx={{ mb: 2.5 }} spacing={2}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Danh Sách Học Viên Cần Điểm Danh ({members.length})
            </Typography>
            {selectedSchedule && (
              <Typography variant="caption" color="text.secondary">
                Buổi học ngày: <strong>{selectedSchedule.classDate}</strong>
              </Typography>
            )}
          </Box>

          <Button
            variant="contained"
            color="primary"
            startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
            onClick={handleSaveAttendance}
            disabled={saving || members.length === 0 || !selectedScheduleId}
            sx={{ fontWeight: 700, px: 3 }}
          >
            {saving ? 'Đang lưu...' : 'Lưu Điểm Danh Buổi Này'}
          </Button>
        </Stack>

        {members.length === 0 ? (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Không có học viên đăng ký trong lớp học này.
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>Mã ĐK</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Họ Tên Học Viên</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Trạng Thái Điểm Danh</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Ghi Chú Của HLV</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {members.map((m) => {
                  const state = attendanceForm[m.registrationId] || { status: 'Present', notes: '' };
                  return (
                    <TableRow key={m.registrationId}>
                      <TableCell sx={{ fontWeight: 600 }}>#{m.registrationId}</TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          {m.member?.fullName || `Học viên #${m.memberId}`}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          SĐT: {m.member?.phone || 'Chưa cập nhật'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <RadioGroup
                          row
                          value={state.status || 'Present'}
                          onChange={(e) => handleStatusChange(m.registrationId, e.target.value)}
                        >
                          <FormControlLabel
                            value="Present"
                            control={<Radio size="small" color="success" />}
                            label={<Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>Có mặt</Typography>}
                          />
                          <FormControlLabel
                            value="Absent"
                            control={<Radio size="small" color="error" />}
                            label={<Typography variant="body2" sx={{ fontWeight: 600, color: 'error.main' }}>Vắng</Typography>}
                          />
                          <FormControlLabel
                            value="Excused"
                            control={<Radio size="small" color="info" />}
                            label={<Typography variant="body2" sx={{ fontWeight: 600, color: 'info.main' }}>Có phép</Typography>}
                          />
                        </RadioGroup>
                      </TableCell>
                      <TableCell sx={{ minWidth: 200 }}>
                        <TextField
                          size="small"
                          fullWidth
                          placeholder="Ví dụ: Đến muộn 10p, tích cực..."
                          value={state.notes || ''}
                          onChange={(e) => handleNotesChange(m.registrationId, e.target.value)}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default CoachAttendance;
