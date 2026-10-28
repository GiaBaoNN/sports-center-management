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
  LinearProgress,
  InputAdornment,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterAlt as FilterIcon,
  RestartAlt as ResetIcon,
  AccessTime as AccessTimeIcon,
  Room as RoomIcon,
  Whatshot as FireIcon,
  FitnessCenter as FitnessCenterIcon,
  EventAvailable as BookIcon,
  CheckCircle as CheckCircleIcon,
  CardMembership as MembershipIcon,
  BookmarkAdded as BookmarkAddedIcon,
} from '@mui/icons-material';
import SectionHeader from '../components/common/SectionHeader';
import ClassDetailModal from '../components/common/ClassDetailModal';
import { trainers } from '../data/sportsData';
import { classBookingService, mockCurrentUser } from '../services/classBookingService';

const sportsOptions = [
  { value: 'all', label: 'Tất cả môn thể thao' },
  { value: 'Gym', label: 'Gym & Thể hình' },
  { value: 'Bơi lội', label: 'Bơi lội 4 mùa' },
  { value: 'Yoga', label: 'Yoga & Thiền' },
  { value: 'Boxing', label: 'Boxing & Kickfit' },
  { value: 'Pilates', label: 'Pilates Reformer' },
  { value: 'GroupX', label: 'Zumba & GroupX' },
];

const timeSlotOptions = [
  { value: 'all', label: 'Tất cả khung giờ' },
  { value: 'morning', label: 'Buổi Sáng (06:00 - 11:00)' },
  { value: 'afternoon', label: 'Buổi Chiều (14:00 - 17:00)' },
  { value: 'evening', label: 'Buổi Tối (17:30 - 21:00)' },
];

const dayOptions = [
  { value: 'all', label: 'Tất cả các ngày' },
  { value: 'Thứ 2', label: 'Thứ 2' },
  { value: 'Thứ 3', label: 'Thứ 3' },
  { value: 'Thứ 4', label: 'Thứ 4' },
  { value: 'Thứ 5', label: 'Thứ 5' },
  { value: 'Thứ 6', label: 'Thứ 6' },
  { value: 'Thứ 7', label: 'Thứ 7' },
  { value: 'Chủ nhật', label: 'Chủ nhật' },
];

const Classes = () => {
  // Service Data States
  const [classesList, setClassesList] = useState([]);
  const [userBookings, setUserBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState('all');
  const [selectedTrainer, setSelectedTrainer] = useState('all');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('all');
  const [selectedDay, setSelectedDay] = useState('all');
  const [showOnlyMyBookings, setShowOnlyMyBookings] = useState(false);

  // Modal State
  const [selectedClass, setSelectedClass] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [feedbackAlert, setFeedbackAlert] = useState(null);

  // Tải dữ liệu lớp và danh sách đăng ký từ service
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [cls, bookings] = await Promise.all([
          classBookingService.getClasses(),
          classBookingService.getUserBookings(mockCurrentUser.id),
        ]);
        setClassesList(cls);
        setUserBookings(bookings);
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu lớp học:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const bookedClassIds = useMemo(() => {
    return new Set(userBookings.map((b) => b.classId));
  }, [userBookings]);

  const handleOpenDetail = (classItem) => {
    setSelectedClass(classItem);
    setDetailModalOpen(true);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSport('all');
    setSelectedTrainer('all');
    setSelectedTimeSlot('all');
    setSelectedDay('all');
    setShowOnlyMyBookings(false);
  };

  // Callback sau khi đăng ký lớp chính thức thành công (FE-10)
  const handleBookingSuccess = (updatedClass, newRegistration) => {
    setClassesList((prev) =>
      prev.map((c) => (c.id === updatedClass.id ? updatedClass : c))
    );
    setUserBookings((prev) => [newRegistration, ...prev]);
    setSelectedClass(updatedClass);
    setFeedbackAlert({
      type: 'success',
      message: `Đăng ký lớp "${updatedClass.title}" thành công! Slot của bạn đã được ghi nhận.`,
    });
  };

  // Callback sau khi hủy đăng ký lớp thành công (FE-11)
  const handleCancelSuccess = (updatedClass, classId) => {
    setClassesList((prev) =>
      prev.map((c) => (c.id === updatedClass.id ? updatedClass : c))
    );
    setUserBookings((prev) => prev.filter((b) => b.classId !== classId));
    setSelectedClass(updatedClass);
    setFeedbackAlert({
      type: 'info',
      message: `Đã hủy đặt chỗ lớp "${updatedClass.title}". Slot chỗ đã được hoàn lại thành công.`,
    });
  };

  // Lọc danh sách lớp học
  const filteredClasses = useMemo(() => {
    return classesList.filter((c) => {
      // Filter My Bookings only
      if (showOnlyMyBookings && !bookedClassIds.has(c.id)) {
        return false;
      }
      // Search text
      if (searchQuery && !c.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      // Sport
      if (selectedSport !== 'all' && c.sport !== selectedSport) {
        return false;
      }
      // Trainer
      if (selectedTrainer !== 'all' && c.trainer !== selectedTrainer) {
        return false;
      }
      // Time Slot
      if (selectedTimeSlot !== 'all' && c.timeSlot !== selectedTimeSlot) {
        return false;
      }
      // Day
      if (selectedDay !== 'all' && !c.days.includes(selectedDay)) {
        return false;
      }
      return true;
    });
  }, [
    classesList,
    searchQuery,
    selectedSport,
    selectedTrainer,
    selectedTimeSlot,
    selectedDay,
    showOnlyMyBookings,
    bookedClassIds,
  ]);

  return (
    <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: 'background.default' }}>
      <Container maxWidth="xl">
        <SectionHeader
          badge="LỊCH HỌC TỔNG HỢP & ĐẶT CHỖ"
          title="Thời Khóa Biểu & Danh Mục Lớp Học Tại"
          highlightTitle="AURA SPORT"
          subtitle="Hơn 120 lớp học mỗi tuần được hướng dẫn bởi các HLV đạt chuẩn quốc tế. Hội viên chính thức có thể đặt chỗ hoặc hủy đăng ký trực tiếp."
        />

        {/* Global Feedback Alert */}
        {feedbackAlert && (
          <Alert
            severity={feedbackAlert.type}
            onClose={() => setFeedbackAlert(null)}
            sx={{ mb: 4, borderRadius: 3 }}
          >
            {feedbackAlert.message}
          </Alert>
        )}

        {/* Member Status & Booking Quick Bar */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 3,
            bgcolor: '#FFFFFF',
            borderRadius: 3.5,
            border: '1px solid #E2E8F0',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: 2.5,
                bgcolor: 'rgba(25, 118, 210, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'primary.main',
              }}
            >
              <MembershipIcon />
            </Box>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                  Hội viên: {mockCurrentUser.fullName}
                </Typography>
                <Chip
                  size="small"
                  label={mockCurrentUser.membership.status}
                  color="success"
                  sx={{ height: 20, fontSize: '0.65rem', fontWeight: 800 }}
                />
              </Box>
              <Typography variant="caption" color="text.secondary">
                {mockCurrentUser.membership.packageName} • Đã đăng ký:{' '}
                <strong style={{ color: '#1976D2' }}>{userBookings.length} lớp học</strong>
              </Typography>
            </Box>
          </Box>

          {/* Switch View Tabs */}
          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant={!showOnlyMyBookings ? 'contained' : 'outlined'}
              color="primary"
              onClick={() => setShowOnlyMyBookings(false)}
              sx={{ fontWeight: 700 }}
            >
              Tất Cả Lớp Học ({classesList.length})
            </Button>
            <Button
              size="small"
              variant={showOnlyMyBookings ? 'contained' : 'outlined'}
              color="success"
              startIcon={<BookmarkAddedIcon />}
              onClick={() => setShowOnlyMyBookings(true)}
              sx={{ fontWeight: 700 }}
            >
              Lớp Tôi Đã Đặt ({userBookings.length})
            </Button>
          </Stack>
        </Paper>

        {/* 1. FILTER CONTROLS BAR */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, md: 3 },
            borderRadius: 4,
            bgcolor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.04)',
            mb: 5,
          }}
        >
          <Grid container spacing={2} alignItems="center">
            {/* Search by Class Name */}
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Tìm theo tên lớp học (vd: Yoga, HIIT, Bơi...)"
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
            <Grid size={{ xs: 6, sm: 3, md: 2 }}>
              <TextField
                select
                fullWidth
                size="small"
                label="Môn Thể Thao"
                value={selectedSport}
                onChange={(e) => setSelectedSport(e.target.value)}
              >
                {sportsOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Trainer Filter */}
            <Grid size={{ xs: 6, sm: 3, md: 2 }}>
              <TextField
                select
                fullWidth
                size="small"
                label="Huấn Luyện Viên"
                value={selectedTrainer}
                onChange={(e) => setSelectedTrainer(e.target.value)}
              >
                <MenuItem value="all">Tất cả HLV</MenuItem>
                {trainers.map((t) => (
                  <MenuItem key={t.id} value={t.name}>
                    {t.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Time Slot Filter */}
            <Grid size={{ xs: 6, sm: 3, md: 2 }}>
              <TextField
                select
                fullWidth
                size="small"
                label="Khung Giờ"
                value={selectedTimeSlot}
                onChange={(e) => setSelectedTimeSlot(e.target.value)}
              >
                {timeSlotOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Day Filter */}
            <Grid size={{ xs: 6, sm: 3, md: 2 }}>
              <TextField
                select
                fullWidth
                size="small"
                label="Thứ trong tuần"
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
              >
                {dayOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
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
              {showOnlyMyBookings && ' (Đang xem các lớp đã đặt của bạn)'}
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

        {/* 2. CLASSES GRID */}
        {loading ? (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <CircularProgress size={40} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Đang tải lịch lớp học mới nhất...
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
              {showOnlyMyBookings
                ? 'Bạn chưa đăng ký tham gia lớp học nào'
                : 'Không tìm thấy lớp học nào phù hợp với bộ lọc'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {showOnlyMyBookings
                ? 'Hãy xem qua danh sách tất cả các lớp học để chọn ca tập phù hợp.'
                : 'Vui lòng thử chọn lại môn thể thao, khung giờ hoặc xóa các tiêu chí tìm kiếm.'}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleResetFilters}
              sx={{ fontWeight: 700 }}
            >
              {showOnlyMyBookings ? 'Xem Tất Cả Lớp Học' : 'Đặt Lại Toàn Bộ Bộ Lọc'}
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3.5}>
            {filteredClasses.map((item) => {
              const availableSlots = item.capacity - item.booked;
              const progressPercent = Math.min(
                100,
                Math.round((item.booked / item.capacity) * 100)
              );
              const isBooked = bookedClassIds.has(item.id);

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
                      border: isBooked ? '2px solid #2E7D32' : '1px solid #E2E8F0',
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
                          flexWrap: 'wrap',
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
                          color={
                            item.status === 'Còn chỗ'
                              ? 'success'
                              : item.status === 'Sắp hết'
                              ? 'warning'
                              : 'error'
                          }
                          sx={{ fontWeight: 800 }}
                        />
                      </Box>

                      {/* Booked Flag Chip */}
                      {isBooked && (
                        <Box sx={{ position: 'absolute', top: 14, right: 14 }}>
                          <Chip
                            icon={<CheckCircleIcon sx={{ '&&': { color: '#FFFFFF' } }} />}
                            label="ĐÃ ĐĂNG KÝ"
                            size="small"
                            color="success"
                            sx={{ fontWeight: 800, bgcolor: '#2E7D32', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
                          />
                        </Box>
                      )}
                    </Box>

                    {/* Content */}
                    <CardContent sx={{ p: 3, flexGrow: 1 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                        CẤP ĐỘ: {item.level.toUpperCase()}
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

                      {/* Trainer Avatar & Name */}
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
                        <Avatar src={item.trainerAvatar} alt={item.trainer} sx={{ width: 36, height: 36 }} />
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
                          <AccessTimeIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                          <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600 }}>
                            {item.time} ({item.daysShort})
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                          <RoomIcon sx={{ fontSize: 18, color: 'secondary.main' }} />
                          <Typography variant="body2" color="text.secondary">
                            {item.room}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                          <FireIcon sx={{ fontSize: 18, color: '#FF6B35' }} />
                          <Typography variant="body2" color="text.secondary">
                            Đốt {item.calories}
                          </Typography>
                        </Box>
                      </Stack>

                      {/* Slot Availability Progress */}
                      <Box sx={{ pt: 1, borderTop: '1px solid #F1F5F9' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
                          <Typography variant="caption" color="text.secondary">
                            Tình trạng đặt chỗ:
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              fontWeight: 800,
                              color: availableSlots <= 2 ? 'warning.main' : 'success.main',
                            }}
                          >
                            Còn {availableSlots}/{item.capacity} slot
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={progressPercent}
                          color={availableSlots <= 2 ? 'warning' : 'primary'}
                          sx={{ height: 6, borderRadius: 3 }}
                        />
                      </Box>
                    </CardContent>

                    <CardActions sx={{ p: 3, pt: 0 }}>
                      <Button
                        fullWidth
                        variant={isBooked ? 'outlined' : 'contained'}
                        color={
                          isBooked
                            ? 'success'
                            : item.status === 'Đã đủ chỗ'
                            ? 'inherit'
                            : 'secondary'
                        }
                        disabled={!isBooked && item.status === 'Đã đủ chỗ'}
                        startIcon={isBooked ? <CheckCircleIcon /> : <BookIcon />}
                        onClick={() => handleOpenDetail(item)}
                        sx={{
                          py: 1.1,
                          fontWeight: 700,
                          boxShadow:
                            !isBooked && item.status !== 'Đã đủ chỗ'
                              ? '0 4px 14px rgba(255, 107, 53, 0.35)'
                              : 'none',
                        }}
                      >
                        {isBooked
                          ? 'Đã Đăng Ký (Xem / Hủy)'
                          : item.status === 'Đã đủ chỗ'
                          ? 'Lớp Đã Đầy Chỗ'
                          : 'Xem Chi Tiết & Đặt Lớp'}
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
        isBooked={Boolean(selectedClass && bookedClassIds.has(selectedClass.id))}
        currentUser={mockCurrentUser}
        onBookingSuccess={handleBookingSuccess}
        onCancelSuccess={handleCancelSuccess}
      />
    </Box>
  );
};

export default Classes;
