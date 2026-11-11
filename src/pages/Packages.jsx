import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  Button,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  ExpandMore as ExpandMoreIcon,
  CloudDone as CloudDoneIcon,
  CloudOff as CloudOffIcon,
} from '@mui/icons-material';
import SectionHeader from '../components/common/SectionHeader';
import PackageModal from '../components/common/PackageModal';
import { packageApi } from '../services/api';
import { membershipPackages as fallbackPackages, packageComparisonFeatures } from '../data/sportsData';

const faqs = [
  {
    q: 'Tôi có thể bảo lưu thẻ hội viên khi đi công tác hoặc bị ốm không?',
    a: 'Hoàn toàn có thể. Tùy thuộc vào thời hạn gói, gói từ 3 tháng trở lên được bảo lưu tối đa 30-45 ngày và gói 1 năm lên đến 90 ngày. Bạn chỉ cần thông báo trước cho quầy lễ tân hoặc qua hệ thống.',
  },
  {
    q: 'Gói tập có bao gồm người hướng dẫn (Huấn luyện viên cá nhân PT) không?',
    a: 'Tất cả các gói từ Premium trở lên đều được tặng kèm các buổi tập 1:1 với HLV chuyên nghiệp. Ngoài ra, HLV sàn luôn túc trực để hỗ trợ bạn sử dụng thiết bị đúng kỹ thuật.',
  },
  {
    q: 'Hệ thống hỗ trợ những phương thức thanh toán nào?',
    a: 'Hiện tại hệ thống SCMS hỗ trợ 2 hình thức thanh toán chính thức: Tiền mặt tại quầy (Cash) và Ví điện tử MoMo (MoMo QR Payment). Sau khi thanh toán thành công, hóa đơn điện tử sẽ được lập tự động.',
  },
  {
    q: 'Tôi có thể đăng ký nhiều gói hội viên cùng lúc không?',
    a: 'Theo quy định của hệ thống SCMS, mỗi hội viên chỉ được sở hữu 01 gói tập đang có hiệu lực (Active) tại một thời điểm. Khi gói hiện tại hết hạn, bạn có thể đăng ký hoặc gia hạn gói mới.',
  },
];

const packageFeatureTemplates = {
  Basic: [
    { text: 'Toàn quyền sử dụng khu Gym & Tạ tự do', included: true },
    { text: 'Tủ khóa thông minh RFID tiêu chuẩn', included: true },
    { text: 'Phòng tắm nóng lạnh & Máy sấy tóc tiện nghi', included: true },
    { text: 'Đo chỉ số cơ thể InBody 1 lần/tháng', included: true },
    { text: 'Hồ bơi nước mặn 4 mùa', included: false },
    { text: 'Xông hơi Sauna đá muối Himalaya', included: false },
  ],
  Premium: [
    { text: 'Toàn quyền sử dụng khu Gym & Tạ tự do', included: true },
    { text: 'Hồ bơi nước mặn bốn mùa không giới hạn', included: true },
    { text: 'Tham gia không giới hạn các lớp Yoga & GroupX', included: true },
    { text: 'Phòng xông hơi khô đá muối & xông ướt', included: true },
    { text: 'Tặng 02 buổi tập riêng 1:1 cùng Huấn luyện viên', included: true },
    { text: 'Tủ khóa cá nhân thông minh RFID', included: true },
  ],
  Annual: [
    { text: 'Tất cả quyền lợi của gói Premium trọn gói 365 ngày', included: true },
    { text: 'Tặng 06 buổi tập cá nhân 1:1 cùng Master Coach', included: true },
    { text: 'Đo InBody & Tư vấn dinh dưỡng cá nhân định kỳ', included: true },
    { text: 'Quyền bảo lưu thẻ tập linh hoạt lên đến 90 ngày', included: true },
    { text: 'Cung cấp khăn tắm lớn & nước detox mỗi ngày', included: true },
    { text: 'Dẫn bạn bè tập cùng miễn phí 2 lần/tháng', included: true },
  ],
};

const defaultFeatures = [
  { text: 'Toàn quyền sử dụng thiết bị phòng tập chuẩn quốc tế', included: true },
  { text: 'Tủ khóa thông minh RFID & phòng tắm nóng lạnh', included: true },
  { text: 'Đo chỉ số thể hình InBody định kỳ', included: true },
  { text: 'Hỗ trợ hướng dẫn kỹ thuật từ HLV trực sàn', included: true },
];

const Packages = () => {
  const [packagesList, setPackagesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Fetch real packages from backend: GET /api/packages
  const fetchPackages = async () => {
    setLoading(true);
    try {
      const data = await packageApi.getAll();
      if (Array.isArray(data) && data.length > 0) {
        // Map backend MembershipPackage entity
        const mapped = data.map((pkg, idx) => {
          const isHighlight = pkg.name === 'Premium' || idx === 1;
          const badgeText = isHighlight ? 'PHỔ BIẾN NHẤT' : pkg.durationDays >= 365 ? 'TIẾT KIỆM 30%' : null;
          const features = packageFeatureTemplates[pkg.name] || defaultFeatures;

          return {
            id: pkg.packageId,
            packageId: pkg.packageId,
            name: pkg.name,
            tier: `GÓI ${pkg.durationDays} NGÀY`,
            badge: badgeText,
            highlight: isHighlight,
            price: Number(pkg.price),
            durationDays: pkg.durationDays,
            description: pkg.description || `Gói tập ${pkg.name} chất lượng cao tại trung tâm thể thao AURA SPORT.`,
            features,
            buttonText: `Đăng Ký Gói ${pkg.name}`,
            raw: pkg,
          };
        });

        setPackagesList(mapped);
        setIsBackendConnected(true);
      } else {
        setPackagesList(fallbackPackages);
        setIsBackendConnected(false);
      }
    } catch (err) {
      console.warn('Backend API /api/packages not reachable, falling back to local data:', err);
      setPackagesList(fallbackPackages);
      setIsBackendConnected(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleOpenRegister = (pkg) => {
    setSelectedPackage(pkg);
    setModalOpen(true);
  };

  return (
    <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: 'background.default' }}>
      <Container maxWidth="xl">
        {/* Page Header */}
        <SectionHeader
          badge="BẢNG GIÁ HỘI VIÊN (BACKEND API: /api/packages)"
          title="Chọn Gói Tập Phù Hợp Cho"
          highlightTitle="Mục Tiêu Thể Hình"
          subtitle="Dữ liệu gói tập và biểu phí được đồng bộ trực tiếp từ cơ sở dữ liệu hệ thống SCMS. Đăng ký nhận ngay quà tặng chào mừng!"
        />

        {/* Backend Connectivity Status Banner */}
        <Box sx={{ mb: 6, display: 'flex', justifyContent: 'flex-end' }}>
          <Chip
            icon={isBackendConnected ? <CloudDoneIcon /> : <CloudOffIcon />}
            label={
              isBackendConnected
                ? 'Đã kết nối Backend API (/api/packages)'
                : 'Chế độ ngoại tuyến (Hiển thị dữ liệu mẫu dự phòng)'
            }
            color={isBackendConnected ? 'success' : 'default'}
            variant="outlined"
            sx={{ fontWeight: 600, py: 0.5 }}
          />
        </Box>

        {/* 1. MEMBERSHIP CARDS GRID */}
        {loading ? (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <CircularProgress color="primary" size={48} />
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 2 }}>
              Đang tải bảng giá gói tập từ máy chủ backend...
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3.5} sx={{ mb: 10 }} justifyContent="center">
            {packagesList.map((pkg) => {
              const displayPrice = pkg.price != null ? pkg.price : pkg.priceMonthly;
              const durationDesc = pkg.durationDays
                ? `${pkg.durationDays} ngày (~${Math.round(pkg.durationDays / 30)} tháng)`
                : '1 Tháng';

              return (
                <Grid size={{ xs: 12, sm: 6, lg: packagesList.length <= 3 ? 4 : 3 }} key={pkg.id || pkg.packageId}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderRadius: 4,
                      p: 3.5,
                      position: 'relative',
                      bgcolor: '#FFFFFF',
                      border: pkg.highlight ? '2px solid #FF6B35' : '1px solid #E2E8F0',
                      boxShadow: pkg.highlight ? '0 16px 36px rgba(255, 107, 53, 0.18)' : '0 4px 20px rgba(0,0,0,0.04)',
                      transform: pkg.highlight ? { xs: 'none', lg: 'scale(1.03)' } : 'none',
                      zIndex: pkg.highlight ? 2 : 1,
                    }}
                  >
                    {pkg.badge && (
                      <Chip
                        label={pkg.badge}
                        color="secondary"
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: -14,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          fontWeight: 800,
                          fontSize: '0.75rem',
                          boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
                        }}
                      />
                    )}

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 800, letterSpacing: '0.08em' }}>
                        {pkg.tier}
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary' }}>
                        {pkg.name}
                      </Typography>
                    </Box>

                    {/* Price */}
                    <Box sx={{ my: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                        <Typography variant="h3" sx={{ fontWeight: 900, color: pkg.highlight ? 'secondary.main' : 'primary.main' }}>
                          {displayPrice ? Number(displayPrice).toLocaleString('vi-VN') : '0'}
                        </Typography>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700 }}>
                          đ
                        </Typography>
                      </Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
                        Thời lượng sử dụng: <strong>{durationDesc}</strong>
                      </Typography>
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, minHeight: 48, lineHeight: 1.6 }}>
                      {pkg.description}
                    </Typography>

                    {/* Features */}
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: 'text.primary' }}>
                      QUYỀN LỢI GÓI TẬP:
                    </Typography>

                    <Stack spacing={1.5} sx={{ mb: 4, flexGrow: 1 }}>
                      {pkg.features?.map((feat, idx) => (
                        <Box key={idx} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.2 }}>
                          {feat.included ? (
                            <CheckCircleIcon sx={{ fontSize: 18, color: 'success.main', mt: 0.2 }} />
                          ) : (
                            <CancelIcon sx={{ fontSize: 18, color: '#CBD5E1', mt: 0.2 }} />
                          )}
                          <Typography
                            variant="body2"
                            sx={{
                              color: feat.included ? 'text.primary' : '#94A3B8',
                              fontSize: '0.85rem',
                              lineHeight: 1.4,
                            }}
                          >
                            {feat.text}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>

                    <Button
                      fullWidth
                      variant={pkg.highlight ? 'contained' : 'outlined'}
                      color={pkg.highlight ? 'secondary' : 'primary'}
                      size="large"
                      onClick={() => handleOpenRegister(pkg)}
                      sx={{
                        fontWeight: 700,
                        py: 1.4,
                        boxShadow: pkg.highlight ? '0 6px 18px rgba(255, 107, 53, 0.4)' : 'none',
                      }}
                    >
                      {pkg.buttonText || `Đăng Ký Gói ${pkg.name}`}
                    </Button>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}

        {/* 2. BẢNG SO SÁNH GÓI (PACKAGE COMPARISON TABLE) */}
        <Box sx={{ mb: 10 }}>
          <SectionHeader
            badge="BẢNG ĐỐI CHIẾU"
            title="So Sánh Chi Tiết Quyền Lợi Từng Gói"
            subtitle="Tìm hiểu từng hạng mục đặc quyền để chọn đúng gói hội viên tối ưu nhất cho bạn."
          />

          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              borderRadius: 4,
              border: '1px solid #E2E8F0',
              overflow: 'hidden',
              boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
            }}
          >
            <Table sx={{ minWidth: 650 }}>
              <TableHead sx={{ bgcolor: '#0F172A' }}>
                <TableRow>
                  <TableCell sx={{ color: '#FFFFFF', fontWeight: 800, fontSize: '1rem', py: 2.5 }}>
                    Dịch Vụ & Tiện Ích
                  </TableCell>
                  <TableCell align="center" sx={{ color: '#FFFFFF', fontWeight: 700 }}>
                    Gói Basic (30 ngày)
                  </TableCell>
                  <TableCell align="center" sx={{ color: '#FF8A5B', fontWeight: 800, bgcolor: 'rgba(255, 107, 53, 0.15)' }}>
                    Gói Premium (90 ngày)
                  </TableCell>
                  <TableCell align="center" sx={{ color: '#FFD700', fontWeight: 800 }}>
                    Gói Annual (365 ngày)
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {packageComparisonFeatures.map((row, idx) => (
                  <TableRow
                    key={idx}
                    sx={{
                      '&:nth-of-type(odd)': { bgcolor: '#F8FAFC' },
                      '&:hover': { bgcolor: '#F1F5F9' },
                    }}
                  >
                    <TableCell component="th" scope="row" sx={{ fontWeight: 600, py: 2 }}>
                      {row.name}
                    </TableCell>
                    <TableCell align="center" sx={{ color: row.silver === 'Không' ? '#94A3B8' : 'text.primary' }}>
                      {row.silver === 'Có' ? <CheckCircleIcon color="success" fontSize="small" /> : row.silver}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        fontWeight: 700,
                        color: 'secondary.main',
                        bgcolor: 'rgba(255, 107, 53, 0.03)',
                      }}
                    >
                      {row.gold === 'Có' ? <CheckCircleIcon color="success" fontSize="small" /> : row.gold}
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 800, color: 'primary.dark' }}>
                      {row.diamond}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* 3. FAQS SECTION */}
        <Box sx={{ maxWidth: 860, mx: 'auto' }}>
          <SectionHeader
            badge="CÂU HỎI THƯỜNG GẶP"
            title="Thắc Mắc Về Đăng Ký & Quyền Lợi Hội Viên"
            subtitle="Giải đáp nhanh các băn khoăn phổ biến trước khi bạn bắt đầu luyện tập tại AURA SPORT."
          />

          <Stack spacing={2}>
            {faqs.map((faq, idx) => (
              <Accordion
                key={idx}
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: '1px solid #E2E8F0',
                  '&:before': { display: 'none' },
                  bgcolor: '#FFFFFF',
                  overflow: 'hidden',
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}
                  sx={{ py: 1 }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    {faq.q}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 0, pb: 2.5 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {faq.a}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Stack>
        </Box>
      </Container>

      {/* Package registration modal */}
      <PackageModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        pkg={selectedPackage}
      />
    </Box>
  );
};

export default Packages;
