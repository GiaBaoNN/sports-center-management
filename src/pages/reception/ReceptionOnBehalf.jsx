import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  MenuItem,
  TextField,
  Button,
  Stack,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import {
  CardMembership as MembershipIcon,
  FitnessCenter as ClassIcon,
  CheckCircle as SuccessIcon,
} from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';
import { receptionApi, packageApi, classApi } from '../../services/api';

const ReceptionOnBehalf = () => {
  const [searchParams] = useSearchParams();

  const [members, setMembers] = useState([]);
  const [packages, setPackages] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form 1: Membership on behalf
  const [memUserId, setMemUserId] = useState('');
  const [memPackageId, setMemPackageId] = useState('');
  const [memPaymentMethod, setMemPaymentMethod] = useState('Cash');
  const [memSubmitting, setMemSubmitting] = useState(false);
  const [memSuccess, setMemSuccess] = useState('');
  const [memError, setMemError] = useState('');

  // Form 2: Class registration on behalf
  const [clsMemberId, setClsMemberId] = useState('');
  const [clsClassId, setClsClassId] = useState('');
  const [clsSubmitting, setClsSubmitting] = useState(false);
  const [clsSuccess, setClsSuccess] = useState('');
  const [clsError, setClsError] = useState('');

  useEffect(() => {
    Promise.allSettled([
      receptionApi.getAllMembers(),
      packageApi.getAll(),
      classApi.getAll(),
    ])
      .then(([memsRes, pkgsRes, classesRes]) => {
        const memberList = memsRes.status === 'fulfilled' ? memsRes.value || [] : [];
        const pkgList = pkgsRes.status === 'fulfilled' ? pkgsRes.value || [] : [];
        const clsList = classesRes.status === 'fulfilled' ? classesRes.value || [] : [];

        setMembers(memberList);
        setPackages(pkgList);
        setClasses(clsList);

        const paramUserId = searchParams.get('userId');
        if (paramUserId) {
          setMemUserId(Number(paramUserId));
          setClsMemberId(Number(paramUserId));
        } else if (memberList.length > 0) {
          setMemUserId(memberList[0].userId);
          setClsMemberId(memberList[0].userId);
        }

        if (pkgList.length > 0) setMemPackageId(pkgList[0].packageId || pkgList[0].id);
        if (clsList.length > 0) setClsClassId(clsList[0].classId || clsList[0].id);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [searchParams]);

  const handleRegisterMembershipOnBehalf = async (e) => {
    e.preventDefault();
    if (!memUserId || !memPackageId) return;

    setMemSubmitting(true);
    setMemError('');
    setMemSuccess('');

    try {
      const res = await receptionApi.registerMembershipOnBehalf(memUserId, {
        packageId: Number(memPackageId),
        paymentMethod: memPaymentMethod,
      });
      setMemSuccess(`Đã đăng ký thành công gói hội viên cho khách hàng (Mã thẻ #${res.membershipId || res.id})!`);
    } catch (err) {
      setMemError(err.message || 'Đăng ký gói hội viên hộ thất bại.');
    } finally {
      setMemSubmitting(false);
    }
  };

  const handleRegisterClassOnBehalf = async (e) => {
    e.preventDefault();
    if (!clsClassId || !clsMemberId) return;

    setClsSubmitting(true);
    setClsError('');
    setClsSuccess('');

    try {
      const res = await receptionApi.registerClassOnBehalf(clsClassId, clsMemberId);
      setClsSuccess(`Đã ghi danh thành công học viên vào lớp học (Mã đăng ký #${res.registrationId || res.id})!`);
    } catch (err) {
      setClsError(err.message || 'Đăng ký lớp hộ thất bại.');
    } finally {
      setClsSubmitting(false);
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
          Đăng Ký Gói & Lớp Học Hộ Hội Viên
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Hỗ trợ hội viên đăng ký thẻ tập hoặc ghi danh vào các lớp thể thao trực tiếp tại quầy lễ tân.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Form 1: Register Membership */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3.5, borderRadius: 3, border: '1px solid #E2E8F0', height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
              <MembershipIcon /> Đăng Ký Gói Hội Viên Hộ
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Tạo thẻ hội viên mới hoặc gia hạn gói tập cho khách hàng tại bàn lễ tân.
            </Typography>

            {memSuccess && (
              <Alert severity="success" icon={<SuccessIcon />} sx={{ mb: 2.5 }}>
                {memSuccess}
              </Alert>
            )}
            {memError && (
              <Alert severity="error" sx={{ mb: 2.5 }}>
                {memError}
              </Alert>
            )}

            <Box component="form" onSubmit={handleRegisterMembershipOnBehalf}>
              <Stack spacing={2.5}>
                <TextField
                  select
                  fullWidth
                  required
                  label="Chọn Hội Viên"
                  value={memUserId}
                  onChange={(e) => setMemUserId(Number(e.target.value))}
                >
                  {members.map((m) => (
                    <MenuItem key={m.userId} value={m.userId}>
                      {m.fullName} - {m.phone} (#{m.userId})
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  fullWidth
                  required
                  label="Chọn Gói Hội Viên"
                  value={memPackageId}
                  onChange={(e) => setMemPackageId(Number(e.target.value))}
                >
                  {packages.map((pkg) => (
                    <MenuItem key={pkg.packageId || pkg.id} value={pkg.packageId || pkg.id}>
                      {pkg.name} ({pkg.durationDays} ngày) - {Number(pkg.price).toLocaleString('vi-VN')} đ
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  fullWidth
                  required
                  label="Hình Thức Thanh Toán"
                  value={memPaymentMethod}
                  onChange={(e) => setMemPaymentMethod(e.target.value)}
                >
                  <MenuItem value="Cash">Tiền mặt tại quầy (Cash)</MenuItem>
                  <MenuItem value="MoMo">Ví điện tử MoMo (MoMo)</MenuItem>
                </TextField>

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={memSubmitting || members.length === 0}
                  sx={{ py: 1.3, fontWeight: 700 }}
                >
                  {memSubmitting ? 'Đang tạo thẻ...' : 'Xác Nhận Đăng Ký Gói'}
                </Button>
              </Stack>
            </Box>
          </Paper>
        </Grid>

        {/* Form 2: Register Class */}
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ p: 3.5, borderRadius: 3, border: '1px solid #E2E8F0', height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, display: 'flex', alignItems: 'center', gap: 1, color: 'secondary.main' }}>
              <ClassIcon /> Đăng Ký Lớp Học Hộ
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Ghi danh hội viên vào lớp thể thao theo yêu cầu trực tiếp tại quầy.
            </Typography>

            {clsSuccess && (
              <Alert severity="success" icon={<SuccessIcon />} sx={{ mb: 2.5 }}>
                {clsSuccess}
              </Alert>
            )}
            {clsError && (
              <Alert severity="error" sx={{ mb: 2.5 }}>
                {clsError}
              </Alert>
            )}

            <Box component="form" onSubmit={handleRegisterClassOnBehalf}>
              <Stack spacing={2.5}>
                <TextField
                  select
                  fullWidth
                  required
                  label="Chọn Hội Viên"
                  value={clsMemberId}
                  onChange={(e) => setClsMemberId(Number(e.target.value))}
                >
                  {members.map((m) => (
                    <MenuItem key={m.userId} value={m.userId}>
                      {m.fullName} - {m.phone} (#{m.userId})
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  select
                  fullWidth
                  required
                  label="Chọn Lớp Học"
                  value={clsClassId}
                  onChange={(e) => setClsClassId(Number(e.target.value))}
                >
                  {classes.map((c) => (
                    <MenuItem key={c.classId || c.id} value={c.classId || c.id}>
                      {c.className || c.title} ({c.sport?.name || 'Môn'}) - Phòng {c.room?.roomName || 'A'}
                    </MenuItem>
                  ))}
                </TextField>

                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  disabled={clsSubmitting || members.length === 0}
                  sx={{ py: 1.3, fontWeight: 700 }}
                >
                  {clsSubmitting ? 'Đang ghi danh...' : 'Xác Nhận Đăng Ký Lớp'}
                </Button>
              </Stack>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReceptionOnBehalf;
