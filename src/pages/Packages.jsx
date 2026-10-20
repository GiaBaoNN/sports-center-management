import React, { useState } from 'react';
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
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import SectionHeader from '../components/common/SectionHeader';
import PackageModal from '../components/common/PackageModal';
import { membershipPackages, packageComparisonFeatures } from '../data/sportsData';

const faqs = [
  {
    q: 'Tôi có thể bảo lưu thẻ hội viên khi đi công tác hoặc bị ốm không?',
    a: 'Hoàn toàn có thể. Tùy thuộc vào hạng thẻ, gói Gold được bảo lưu tối đa 15 ngày, gói Platinum tối đa 45 ngày và gói Diamond VIP lên đến 90 ngày. Bạn chỉ cần thông báo trước cho quầy lễ tân hoặc qua ứng dụng.',
  },
  {
    q: 'Gói tập có bao gồm người hướng dẫn (Huấn luyện viên cá nhân PT) không?',
    a: 'Tất cả các gói từ Gold trở lên đều được tặng kèm các buổi tập 1:1 với HLV chuyên nghiệp (Gold tặng 2 buổi, Platinum 5 buổi, Diamond VIP 12 buổi). Ngoài ra, HLV sàn luôn túc trực để hỗ trợ bạn sử dụng thiết bị đúng kỹ thuật.',
  },
  {
    q: 'Tôi có thể tập luyện tại tất cả các chi nhánh của AURA SPORT không?',
    a: 'Hội viên sở hữu gói Platinum và Diamond VIP có đặc quyền tập luyện tại tất cả các cơ sở của AURA SPORT trên toàn quốc (Hà Nội và TP.HCM) mà không mất thêm bất kỳ chi phí nào.',
  },
  {
    q: 'Trung tâm có chính sách thanh toán trả góp 0% lãi suất không?',
    a: 'Có. Chúng tôi liên kết với hơn 20 ngân hàng lớn hỗ trợ trả góp kỳ hạn 3, 6, 12 tháng với lãi suất 0% cho tất cả các gói tập từ 6 tháng trở lên.',
  },
];

const Packages = () => {
  const [cycle, setCycle] = useState('monthly'); // 'monthly' | 'quarterly' | 'yearly'
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenRegister = (pkg) => {
    setSelectedPackage(pkg);
    setModalOpen(true);
  };

  const getPriceByCycle = (pkg) => {
    if (cycle === 'yearly') return Math.round(pkg.priceYearly / 12);
    if (cycle === 'quarterly') return Math.round(pkg.priceQuarterly / 3);
    return pkg.priceMonthly;
  };

  return (
    <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: 'background.default' }}>
      <Container maxWidth="xl">
        {/* Page Header */}
        <SectionHeader
          badge="BẢNG GIÁ HỘI VIÊN"
          title="Chọn Gói Tập Phù Hợp Cho"
          highlightTitle="Mục Tiêu Thể Hình"
          subtitle="Tất cả các gói đều bao gồm đo chỉ số InBody miễn phí, tủ đồ bảo mật RFID và phòng tắm nóng lạnh tiện nghi 5 sao."
        />

        {/* Cycle Switcher Tabs */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
          <Box
            sx={{
              bgcolor: '#FFFFFF',
              p: 0.8,
              borderRadius: 4,
              boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
              border: '1px solid #E2E8F0',
              display: 'inline-flex',
              gap: 1,
            }}
          >
            {[
              { id: 'monthly', label: '1 Tháng' },
              { id: 'quarterly', label: '3 Tháng (Tiết kiệm)' },
              { id: 'yearly', label: '1 Năm (-20% Ưu đãi)', highlight: true },
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={cycle === tab.id ? 'contained' : 'text'}
                color={cycle === tab.id ? (tab.highlight ? 'secondary' : 'primary') : 'inherit'}
                onClick={() => setCycle(tab.id)}
                sx={{
                  px: 3,
                  py: 1.2,
                  borderRadius: 3,
                  fontWeight: 700,
                  fontSize: '0.95rem',
                }}
              >
                {tab.label}
              </Button>
            ))}
          </Box>
        </Box>

        {/* 1. MEMBERSHIP CARDS GRID */}
        <Grid container spacing={3.5} sx={{ mb: 10 }}>
          {membershipPackages.map((pkg) => {
            const displayPrice = getPriceByCycle(pkg);
            return (
              <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={pkg.id}>
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
                        {displayPrice.toLocaleString('vi-VN')}
                      </Typography>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700 }}>
                        đ / tháng
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
                      {cycle === 'yearly'
                        ? `Thanh toán cả năm: ${pkg.priceYearly.toLocaleString('vi-VN')} đ`
                        : cycle === 'quarterly'
                        ? `Thanh toán quý: ${pkg.priceQuarterly.toLocaleString('vi-VN')} đ`
                        : 'Thanh toán linh hoạt từng tháng'}
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
                    {pkg.features.map((feat, idx) => (
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
                    {pkg.buttonText}
                  </Button>
                </Card>
              </Grid>
            );
          })}
        </Grid>

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
                    Gói Silver
                  </TableCell>
                  <TableCell align="center" sx={{ color: '#FF8A5B', fontWeight: 800, bgcolor: 'rgba(255, 107, 53, 0.15)' }}>
                    Gói Gold (Phổ biến)
                  </TableCell>
                  <TableCell align="center" sx={{ color: '#42A5F5', fontWeight: 700 }}>
                    Gói Platinum
                  </TableCell>
                  <TableCell align="center" sx={{ color: '#FFD700', fontWeight: 800 }}>
                    Gói Diamond VIP
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
                    <TableCell align="center" sx={{ fontWeight: 600 }}>
                      {row.platinum === 'Có' ? <CheckCircleIcon color="success" fontSize="small" /> : row.platinum}
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700, color: 'primary.dark' }}>
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
