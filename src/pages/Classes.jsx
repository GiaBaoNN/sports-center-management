import React, { useState, useMemo } from 'react';
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
} from '@mui/icons-material';
import SectionHeader from '../components/common/SectionHeader';
import ClassDetailModal from '../components/common/ClassDetailModal';
import { centerClasses, trainers } from '../data/sportsData';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState('all');
  const [selectedTrainer, setSelectedTrainer] = useState('all');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('all');
  const [selectedDay, setSelectedDay] = useState('all');

  const [selectedClass, setSelectedClass] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

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
  };

  // Filtered Classes computation
  const filteredClasses = useMemo(() => {
    return centerClasses.filter((c) => {
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
  }, [searchQuery, selectedSport, selectedTrainer, selectedTimeSlot, selectedDay]);

  return (
    <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: 'background.default' }}>
      <Container maxWidth="xl">
        <SectionHeader
          badge="LỊCH HỌC TỔNG HỢP"
          title="Thời Khóa Biểu & Danh Mục Lớp Học Tại"
          highlightTitle="AURA SPORT"
          subtitle="Hơn 120 lớp học mỗi tuần được hướng dẫn bởi các HLV đạt chuẩn quốc tế. Đăng ký học thử 01 buổi miễn phí ngay hôm nay!"
        />

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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2.5, pt: 2, borderTop: '1px solid #F1F5F9' }}>
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

        {/* 2. CLASSES GRID */}
        {filteredClasses.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8, bgcolor: '#FFFFFF', borderRadius: 4, border: '1px solid #E2E8F0' }}>
            <FitnessCenterIcon sx={{ fontSize: 64, color: '#CBD5E1', mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              Không tìm thấy lớp học nào phù hợp với bộ lọc đã chọn
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Vui lòng thử chọn lại môn thể thao, khung giờ hoặc xóa các tiêu chí tìm kiếm.
            </Typography>
            <Button variant="contained" color="primary" onClick={handleResetFilters}>
              Đặt Lại Toàn Bộ Bộ Lọc
            </Button>
          </Box>
        ) : (
          <Grid container spacing={3.5}>
            {filteredClasses.map((item) => {
              const availableSlots = item.capacity - item.booked;
              const progressPercent = Math.round((item.booked / item.capacity) * 100);

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
                    </Box>

                    {/* Content */}
                    <CardContent sx={{ p: 3, flexGrow: 1 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                        CẤP ĐỘ: {item.level.toUpperCase()}
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, mt: 0.5, color: 'text.primary', minHeight: 56, lineHeight: 1.3 }}>
                        {item.title}
                      </Typography>

                      {/* Trainer Avatar & Name */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5, p: 1.2, bgcolor: '#F8FAFC', borderRadius: 2.5 }}>
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
                        variant="contained"
                        color={item.status === 'Đã đủ chỗ' ? 'inherit' : 'secondary'}
                        disabled={item.status === 'Đã đủ chỗ'}
                        startIcon={<BookIcon />}
                        onClick={() => handleOpenDetail(item)}
                        sx={{
                          py: 1.1,
                          fontWeight: 700,
                          boxShadow: item.status !== 'Đã đủ chỗ' ? '0 4px 14px rgba(255, 107, 53, 0.35)' : 'none',
                        }}
                      >
                        {item.status === 'Đã đủ chỗ' ? 'Lớp Đã Đầy Chỗ' : 'Đặt Chỗ Thử Nghiệm'}
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
      />
    </Box>
  );
};

export default Classes;
