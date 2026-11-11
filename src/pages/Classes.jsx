import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  TextField,
  MenuItem,
  Button,
  Chip,
  Stack,
  Avatar,
  InputAdornment,
  Paper,
  CircularProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  RestartAlt as ResetIcon,
  Room as RoomIcon,
  FitnessCenter as FitnessCenterIcon,
  EventAvailable as BookIcon,
  CloudDone as CloudDoneIcon,
  CloudOff as CloudOffIcon,
} from '@mui/icons-material';
import SectionHeader from '../components/common/SectionHeader';
import ClassDetailModal from '../components/common/ClassDetailModal';
import { classApi } from '../services/api';
import { centerClasses } from '../data/sportsData';

const sportImages = {
  Yoga: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop',
  Badminton: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?q=80&w=800&auto=format&fit=crop',
  Swimming: 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?q=80&w=800&auto=format&fit=crop',
  Fitness: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
  Gym: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop',
  Boxing: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=800&auto=format&fit=crop',
  Pilates: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800&auto=format&fit=crop',
  GroupX: 'https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?q=80&w=800&auto=format&fit=crop',
};

const statusMap = {
  Upcoming: 'Sắp diễn ra',
  Ongoing: 'Đang mở đăng ký',
  Completed: 'Đã hoàn thành',
  Cancelled: 'Đã hủy',
};

const Classes = () => {
  const [classesList, setClassesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState('all');
  const [selectedTrainer, setSelectedTrainer] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const [selectedClass, setSelectedClass] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  // Fetch real classes from backend API: GET /api/classes
  const fetchClasses = async () => {
    setLoading(true);
    try {
      const data = await classApi.getAll();
      if (Array.isArray(data) && data.length > 0) {
        // Map backend ClassEntity: { classId, className, sport, room, coach, status }
        const mapped = data.map((c) => ({
          id: c.classId,
          title: c.className,
          sport: c.sport?.name || 'Khác',
          sportId: c.sport?.sportId,
          sportDesc: c.sport?.description,
          trainer: c.coach?.fullName || 'HLV Trung Tâm',
          trainerPhone: c.coach?.phone,
          trainerEmail: c.coach?.email,
          room: c.room ? `${c.room.roomName} (${c.room.location || 'Tầng 1'})` : 'Phòng tập',
          capacity: c.room?.maxCapacity || 20,
          booked: 0,
          status: statusMap[c.status] || c.status,
          rawStatus: c.status,
          level: 'Tiêu chuẩn',
          image:
            sportImages[c.sport?.name] ||
            'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=800&auto=format&fit=crop',
          raw: c,
        }));
        setClassesList(mapped);
        setIsBackendConnected(true);
      } else {
        // Fallback to sample data if database is empty
        setClassesList(centerClasses);
        setIsBackendConnected(false);
      }
    } catch (err) {
      console.warn('Backend API /api/classes not reachable, falling back to local data:', err);
      setClassesList(centerClasses);
      setIsBackendConnected(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleOpenDetail = (classItem) => {
    setSelectedClass(classItem);
    setDetailModalOpen(true);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSport('all');
    setSelectedTrainer('all');
    setSelectedStatus('all');
  };

  // Derive unique sports and trainers for filter options
  const sportsOptions = useMemo(() => {
    const set = new Set();
    classesList.forEach((c) => {
      if (c.sport) set.add(c.sport);
    });
    return Array.from(set);
  }, [classesList]);

  const trainersOptions = useMemo(() => {
    const set = new Set();
    classesList.forEach((c) => {
      if (c.trainer) set.add(c.trainer);
    });
    return Array.from(set);
  }, [classesList]);

  // Filtered Classes computation
  const filteredClasses = useMemo(() => {
    return classesList.filter((c) => {
      if (searchQuery && !c.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (selectedSport !== 'all' && c.sport !== selectedSport) {
        return false;
      }
      if (selectedTrainer !== 'all' && c.trainer !== selectedTrainer) {
        return false;
      }
      if (selectedStatus !== 'all' && c.rawStatus !== selectedStatus && c.status !== selectedStatus) {
        return false;
      }
      return true;
    });
  }, [classesList, searchQuery, selectedSport, selectedTrainer, selectedStatus]);

  return (
    <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: 'background.default' }}>
      <Container maxWidth="xl">
        <SectionHeader
          badge="LỊCH HỌC TỔNG HỢP (BACKEND API: /api/classes)"
          title="Thời Khóa Biểu & Danh Mục Lớp Học Tại"
          highlightTitle="AURA SPORT"
          subtitle="Dữ liệu lớp học được đồng bộ thời gian thực từ cơ sở dữ liệu backend và hệ thống quản lý trung tâm SCMS."
        />

        {/* Backend Connectivity Status Banner */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Chip
            icon={isBackendConnected ? <CloudDoneIcon /> : <CloudOffIcon />}
            label={
              isBackendConnected
                ? 'Đã kết nối Backend API (/api/classes)'
                : 'Chế độ ngoại tuyến (Hiển thị dữ liệu mẫu dự phòng)'
            }
            color={isBackendConnected ? 'success' : 'default'}
            variant="outlined"
            sx={{ fontWeight: 600, py: 0.5 }}
          />
        </Box>

        {/* 1. FILTER CONTROLS BAR */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, md: 3 },
            borderRadius: 4,
            bgcolor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.04)',
            mb: 6,
          }}
        >
          <Grid container spacing={2} alignItems="center">
            {/* Search by Class Name */}
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Tìm theo tên lớp học (vd: Yoga, Badminton, Swimming...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>

            {/* Sport Filter */}
            <Grid size={{ xs: 6, sm: 3, md: 3 }}>
              <TextField
                select
                fullWidth
                size="small"
                label="Môn Thể Thao (Sport)"
                value={selectedSport}
                onChange={(e) => setSelectedSport(e.target.value)}
              >
                <MenuItem value="all">Tất cả môn thể thao</MenuItem>
                {sportsOptions.map((sport) => (
                  <MenuItem key={sport} value={sport}>
                    {sport}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Trainer / Coach Filter */}
            <Grid size={{ xs: 6, sm: 3, md: 3 }}>
              <TextField
                select
                fullWidth
                size="small"
                label="Huấn Luyện Viên (Coach)"
                value={selectedTrainer}
                onChange={(e) => setSelectedTrainer(e.target.value)}
              >
                <MenuItem value="all">Tất cả HLV</MenuItem>
                {trainersOptions.map((trainer) => (
                  <MenuItem key={trainer} value={trainer}>
                    {trainer}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Status Filter */}
            <Grid size={{ xs: 6, sm: 3, md: 2 }}>
              <TextField
                select
                fullWidth
                size="small"
                label="Trạng Thái (Status)"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <MenuItem value="all">Tất cả trạng thái</MenuItem>
                <MenuItem value="Upcoming">Sắp diễn ra</MenuItem>
                <MenuItem value="Ongoing">Đang diễn ra</MenuItem>
                <MenuItem value="Completed">Đã hoàn thành</MenuItem>
                <MenuItem value="Cancelled">Đã hủy</MenuItem>
              </TextField>
            </Grid>
          </Grid>

          {/* Active Filter summary & reset */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 2.5,
              pt: 2,
              borderTop: '1px solid #F1F5F9',
            }}
          >
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              Tìm thấy <strong style={{ color: '#1976D2' }}>{filteredClasses.length}</strong> lớp học phù hợp
            </Typography>

            <Button
              size="small"
              startIcon={<ResetIcon />}
              onClick={handleResetFilters}
              sx={{ color: 'text.secondary', fontWeight: 600 }}
            >
              Xóa bộ lọc
            </Button>
          </Box>
        </Paper>

        {/* Loading Spinner */}
        {loading ? (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <CircularProgress color="primary" size={48} />
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2 }}>
              Đang tải danh sách lớp học từ máy chủ backend...
            </Typography>
          </Box>
        ) : filteredClasses.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              bgcolor: '#FFFFFF',
              borderRadius: 4,
              border: '1px solid #E2E8F0',
            }}
          >
            <FitnessCenterIcon sx={{ fontSize: 64, color: '#CBD5E1', mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              Không tìm thấy lớp học nào phù hợp với bộ lọc đã chọn
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Vui lòng thử chọn lại môn thể thao, HLV hoặc xóa các tiêu chí tìm kiếm.
            </Typography>
            <Button variant="contained" color="primary" onClick={handleResetFilters}>
              Đặt Lại Toàn Bộ Bộ Lọc
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3.5}>
            {filteredClasses.map((item) => {
              const capacity = item.capacity || 20;
              const isUpcoming = item.rawStatus === 'Upcoming' || item.status === 'Sắp diễn ra';
              const isOngoing = item.rawStatus === 'Ongoing' || item.status === 'Đang mở đăng ký';
              const isCancelled = item.rawStatus === 'Cancelled' || item.status === 'Đã hủy';

              return (
                <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={item.id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 4,
                      overflow: 'hidden',
                      bgcolor: '#FFFFFF',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-6px)',
                        boxShadow: '0 16px 36px rgba(0, 0, 0, 0.08)',
                        '& .class-thumb': {
                          transform: 'scale(1.06)',
                        },
                      },
                    }}
                  >
                    {/* Thumbnail & Badges */}
                    <Box sx={{ position: 'relative', height: 210, overflow: 'hidden' }}>
                      <CardMedia
                        component="img"
                        className="class-thumb"
                        image={item.image}
                        alt={item.title}
                        sx={{
                          height: '100%',
                          transition: 'transform 0.5s ease',
                        }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 14,
                          left: 14,
                          display: 'flex',
                          gap: 1,
                        }}
                      >
                        <Chip
                          label={item.sport}
                          size="small"
                          sx={{
                            bgcolor: 'rgba(15, 23, 42, 0.85)',
                            color: '#FFFFFF',
                            fontWeight: 700,
                            backdropFilter: 'blur(4px)',
                          }}
                        />
                        <Chip
                          label={item.status}
                          size="small"
                          color={isUpcoming ? 'info' : isOngoing ? 'success' : isCancelled ? 'error' : 'default'}
                          sx={{ fontWeight: 800 }}
                        />
                      </Box>
                    </Box>

                    {/* Content */}
                    <CardContent sx={{ p: 3, flexGrow: 1 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                        MÃ LỚP: #{item.id}
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 800,
                          mb: 2,
                          mt: 0.5,
                          color: 'text.primary',
                          minHeight: 56,
                          lineHeight: 1.3,
                        }}
                      >
                        {item.title}
                      </Typography>

                      {/* Coach Avatar & Name */}
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1.5,
                          mb: 2.5,
                          p: 1.2,
                          bgcolor: '#F8FAFC',
                          borderRadius: 2.5,
                        }}
                      >
                        <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontWeight: 800 }}>
                          {item.trainer?.charAt(0) || 'C'}
                        </Avatar>
                        <Box>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            Huấn luyện viên:
                          </Typography>
                          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                            {item.trainer}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Details specs */}
                      <Stack spacing={1.2} sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                          <RoomIcon sx={{ fontSize: 18, color: 'secondary.main' }} />
                          <Typography variant="body2" color="text.secondary">
                            {item.room}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                          <FitnessCenterIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                          <Typography variant="body2" color="text.secondary">
                            Sức chứa: <strong>{capacity}</strong> học viên
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>

                    <CardActions sx={{ p: 3, pt: 0 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        color={isCancelled ? 'inherit' : 'secondary'}
                        disabled={isCancelled}
                        startIcon={<BookIcon />}
                        onClick={() => handleOpenDetail(item)}
                        sx={{
                          py: 1.1,
                          fontWeight: 700,
                          boxShadow: !isCancelled ? '0 4px 14px rgba(255, 107, 53, 0.35)' : 'none',
                        }}
                      >
                        {isCancelled ? 'Lớp Đã Bị Hủy' : 'Xem Chi Tiết & Đăng Ký'}
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>

      {/* Class booking & detail modal */}
      <ClassDetailModal
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        classItem={selectedClass}
        onRegistrationSuccess={() => {
          fetchClasses();
        }}
      />
    </Box>
  );
};

export default Classes;
