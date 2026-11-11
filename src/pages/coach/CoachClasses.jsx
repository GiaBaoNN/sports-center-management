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
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  SportsKabaddi as ClassIcon,
  CalendarMonth as CalendarIcon,
  Person as MemberIcon,
  Room as RoomIcon,
  HowToReg as AttendanceIcon,
} from '@mui/icons-material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { coachApi } from '../../services/api';

const CoachClasses = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    coachApi
      .getMyClasses()
      .then((data) => {
        setClasses(data || []);
        const paramId = searchParams.get('classId');
        if (paramId) {
          setSelectedClassId(Number(paramId));
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

  useEffect(() => {
    if (!selectedClassId) return;
    setDetailsLoading(true);
    Promise.allSettled([
      coachApi.getClassSchedules(selectedClassId),
      coachApi.getClassMembers(selectedClassId),
    ])
      .then(([schRes, memRes]) => {
        if (schRes.status === 'fulfilled') setSchedules(schRes.value || []);
        if (memRes.status === 'fulfilled') setMembers(memRes.value || []);
      })
      .catch((err) => {
        setError(err.message || 'Lỗi khi tải lịch học và danh sách học viên.');
      })
      .finally(() => {
        setDetailsLoading(false);
      });
  }, [selectedClassId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  const selectedClass = classes.find((c) => c.classId === selectedClassId);

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          Lớp Học & Lịch Dạy Huấn Luyện Viên
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Xem thời khóa biểu các buổi dạy và danh sách học viên chính thức trong từng lớp.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {classes.length === 0 ? (
        <Paper elevation={0} sx={{ p: 6, textAlign: 'center', borderRadius: 3, border: '1px solid #E2E8F0' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Bạn chưa được phân công lớp học nào
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Ban quản lý sẽ tạo lớp và chỉ định huấn luyện viên đứng lớp trên hệ thống.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {/* Left Column: Classes Selector */}
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: '1px solid #E2E8F0' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2 }}>
                Danh Sách Lớp Dạy ({classes.length})
              </Typography>
              <Stack spacing={1.5}>
                {classes.map((c) => {
                  const isSelected = c.classId === selectedClassId;
                  return (
                    <Box
                      key={c.classId}
                      onClick={() => setSelectedClassId(c.classId)}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        cursor: 'pointer',
                        border: isSelected ? '2px solid #FF6B35' : '1px solid #E2E8F0',
                        bgcolor: isSelected ? 'rgba(255, 107, 53, 0.05)' : '#FFFFFF',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: '#FF6B35',
                        },
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: isSelected ? '#E0531E' : 'text.primary' }}>
                          {c.className}
                        </Typography>
                        <Chip label={c.sport?.name || 'Môn'} size="small" color="primary" sx={{ height: 20, fontSize: '0.68rem', fontWeight: 700 }} />
                      </Stack>
                      <Typography variant="caption" color="text.secondary">
                        Phòng: {c.room?.roomName || 'Room A'} | Mã: #{c.classId}
                      </Typography>
                    </Box>
                  );
                })}
              </Stack>
            </Paper>
          </Grid>

          {/* Right Column: Schedules & Registered Students */}
          <Grid item xs={12} md={8}>
            {detailsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <CircularProgress />
              </Box>
            ) : selectedClass ? (
              <Stack spacing={3}>
                {/* Class Info Header */}
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0' }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        {selectedClass.className}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Bộ môn: <strong>{selectedClass.sport?.name}</strong> | Phòng học: <strong>{selectedClass.room?.roomName}</strong>
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      color="secondary"
                      startIcon={<AttendanceIcon />}
                      onClick={() => navigate(`/coach/attendance?classId=${selectedClass.classId}`)}
                      sx={{ fontWeight: 700 }}
                    >
                      Điểm Danh Lớp Này
                    </Button>
                  </Stack>
                </Paper>

                {/* Schedules */}
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarIcon color="primary" /> Thời Khóa Biểu Giảng Dạy ({schedules.length} buổi)
                  </Typography>

                  {schedules.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      Chưa có lịch buổi học nào cho lớp này.
                    </Typography>
                  ) : (
                    <Grid container spacing={2}>
                      {schedules.map((s) => (
                        <Grid item xs={12} sm={6} key={s.scheduleId}>
                          <Box sx={{ p: 2, borderRadius: 2, border: '1px solid #E2E8F0', bgcolor: '#F8FAFC' }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'primary.main' }}>
                              Buổi học ngày: {s.classDate}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                              Thời gian:{' '}
                              {s.startDatetime ? new Date(s.startDatetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''} -{' '}
                              {s.endDatetime ? new Date(s.endDatetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                            </Typography>
                            <Button
                              size="small"
                              onClick={() => navigate(`/coach/attendance?classId=${selectedClass.classId}&scheduleId=${s.scheduleId}`)}
                              sx={{ mt: 1, fontWeight: 700, fontSize: '0.75rem' }}
                            >
                              Điểm danh buổi này
                            </Button>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Paper>

                {/* Registered Members Table */}
                <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MemberIcon color="secondary" /> Danh Sách Học Viên Đăng Ký ({members.length})
                  </Typography>

                  {members.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      Hiện tại chưa có học viên nào ghi danh lớp này.
                    </Typography>
                  ) : (
                    <TableContainer>
                      <Table size="small">
                        <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                          <TableRow>
                            <TableCell sx={{ fontWeight: 700 }}>Học Viên</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Số Điện Thoại</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Ngày Ghi Danh</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Trạng Thái</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {members.map((m) => (
                            <TableRow key={m.registrationId}>
                              <TableCell sx={{ fontWeight: 600 }}>{m.member?.fullName || `Học viên #${m.memberId}`}</TableCell>
                              <TableCell>{m.member?.phone || 'Chưa cập nhật'}</TableCell>
                              <TableCell>{new Date(m.registrationDate).toLocaleDateString('vi-VN')}</TableCell>
                              <TableCell>
                                <Chip
                                  label={m.status === 'Registered' ? 'Đã ghi danh' : m.status}
                                  size="small"
                                  color={m.status === 'Registered' ? 'success' : 'default'}
                                  sx={{ fontWeight: 700 }}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </Paper>
              </Stack>
            ) : null}
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default CoachClasses;
