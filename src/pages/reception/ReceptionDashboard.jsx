import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  TextField,
  CircularProgress,
  Alert,
  Paper,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  PersonAdd as AddMemberIcon,
  PointOfSale as CashierIcon,
  AppRegistration as OnBehalfIcon,
  ContactSupport as SupportIcon,
  People as MemberIcon,
} from '@mui/icons-material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { receptionApi, supportApi } from '../../services/api';

const ReceptionDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [members, setMembers] = useState([]);
  const [searchPhone, setSearchPhone] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    receptionApi
      .getAllMembers()
      .then((data) => {
        setMembers(data || []);
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchPhone.trim()) return;

    setSearching(true);
    setSearchError('');
    setSearchResult(null);

    try {
      const res = await receptionApi.searchMemberByPhone(searchPhone.trim());
      setSearchResult(res);
    } catch (err) {
      setSearchError('Không tìm thấy hội viên nào với số điện thoại này trong hệ thống.');
    } finally {
      setSearching(false);
    }
  };

  return (
    <Box>
      {/* Banner */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 4,
          background: 'linear-gradient(135deg, #0369A1 0%, #0F172A 100%)',
          color: '#FFFFFF',
          mb: 4,
        }}
      >
        <Typography variant="overline" sx={{ color: '#38BDF8', fontWeight: 800, letterSpacing: '0.1em' }}>
          BÀN LÀM VIỆC LỄ TÂN & CHĂM SÓC KHÁCH HÀNG
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 800, mt: 0.5, mb: 1 }}>
          Chào {user?.fullName || user?.username}!
        </Typography>
        <Typography variant="body2" sx={{ color: '#E0F2FE', maxWidth: 650 }}>
          Tiếp đón khách hàng, đăng ký hồ sơ hội viên mới, thu tiền mặt kích hoạt thẻ tập và hỗ trợ đăng ký lớp học tại quầy.
        </Typography>
      </Paper>

      {/* Quick Action Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none' }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                  TỔNG HỘI VIÊN
                </Typography>
                <MemberIcon color="primary" />
              </Stack>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#0284C7' }}>
                {members.length}
              </Typography>
              <Button component={RouterLink} to="/reception/members" size="small" sx={{ mt: 1, fontWeight: 700 }}>
                Quản lý danh sách
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none' }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                  THU TIỀN MẶT
                </Typography>
                <CashierIcon sx={{ color: '#16A34A' }} />
              </Stack>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#16A34A', mt: 0.5 }}>
                Thu Ngân Tại Quầy
              </Typography>
              <Button component={RouterLink} to="/reception/cashier" size="small" color="success" sx={{ mt: 1, fontWeight: 700 }}>
                Xác nhận thanh toán
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none' }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                  ĐĂNG KÝ HỘ
                </Typography>
                <OnBehalfIcon sx={{ color: '#EA580C' }} />
              </Stack>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#EA580C', mt: 0.5 }}>
                Gói Tập & Lớp Học
              </Typography>
              <Button component={RouterLink} to="/reception/on-behalf" size="small" color="warning" sx={{ mt: 1, fontWeight: 700 }}>
                Thực hiện cho khách
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none' }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                  HỖ TRỢ KHÁCH
                </Typography>
                <SupportIcon sx={{ color: '#7C3AED' }} />
              </Stack>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#7C3AED', mt: 0.5 }}>
                Yêu Cầu Từ Hội Viên
              </Typography>
              <Button component={RouterLink} to="/reception/support" size="small" color="secondary" sx={{ mt: 1, fontWeight: 700 }}>
                Xử lý khiếu nại
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Search Member Box */}
      <Paper elevation={0} sx={{ p: 3.5, borderRadius: 3, border: '1px solid #E2E8F0', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
          Tra Cứu Nhanh Hội Viên Bằng Số Điện Thoại
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
          Nhập số điện thoại của hội viên để kiểm tra gói tập, lịch sử đóng tiền hoặc đăng ký lớp tại quầy.
        </Typography>

        <Box component="form" onSubmit={handleSearch}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ maxWidth: 600 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Nhập SĐT (ví dụ: 0901000005, 0901000006...)"
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={searching}
              startIcon={searching ? <CircularProgress size={16} /> : <SearchIcon />}
              sx={{ fontWeight: 700, minWidth: 120 }}
            >
              {searching ? 'Đang tìm...' : 'Tìm Kiếm'}
            </Button>
          </Stack>
        </Box>

        {searchError && (
          <Alert severity="warning" sx={{ mt: 2.5 }}>
            {searchError}
          </Alert>
        )}

        {searchResult && (
          <Box sx={{ mt: 3, p: 2.5, bgcolor: '#F8FAFC', borderRadius: 2.5, border: '1px solid #CBD5E1' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F172A' }}>
              Kết quả: {searchResult.fullName} (@{searchResult.username})
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              SĐT: <strong>{searchResult.phone}</strong> | Email: <strong>{searchResult.email || 'Chưa có'}</strong> | ID: <strong>#{searchResult.userId}</strong>
            </Typography>
            <Stack direction="row" spacing={1.5} sx={{ mt: 2 }}>
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={() => navigate(`/reception/on-behalf?userId=${searchResult.userId}`)}
                sx={{ fontWeight: 700 }}
              >
                Đăng Ký Gói / Lớp Cho Khách Này
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={() => navigate(`/reception/members?search=${searchResult.phone}`)}
              >
                Xem Toàn Bộ Lịch Sử
              </Button>
            </Stack>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ReceptionDashboard;
