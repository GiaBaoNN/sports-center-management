import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Stack,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import {
  Send as SendIcon,
  ContactSupport as SupportIcon,
  CheckCircle as ResolvedIcon,
  HourglassEmpty as OpenIcon,
  SupportAgent as AgentIcon,
} from '@mui/icons-material';
import { supportApi } from '../../services/api';

const statusConfig = {
  Open: { label: 'Đang Chờ Tiếp Nhận', color: 'warning' },
  InProgress: { label: 'Đang Xử Lý', color: 'info' },
  Resolved: { label: 'Đã Giải Quyết', color: 'success' },
  Closed: { label: 'Đã Đóng', color: 'default' },
};

const MemberSupport = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');

  const fetchRequests = () => {
    setLoading(true);
    supportApi
      .getMy()
      .then((data) => {
        setRequests(data || []);
      })
      .catch((err) => {
        setError(err.message || 'Không thể tải yêu cầu hỗ trợ.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) {
      setError('Vui lòng nhập tiêu đề và nội dung cần hỗ trợ.');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccessMsg('');

    try {
      await supportApi.create({
        subject: subject.trim(),
        description: description.trim(),
      });
      setSuccessMsg('Gửi yêu cầu hỗ trợ thành công! Đội ngũ lễ tân và quản lý sẽ phản hồi sớm nhất.');
      setSubject('');
      setDescription('');
      fetchRequests();
    } catch (err) {
      setError(err.message || 'Gửi yêu cầu không thành công.');
    } finally {
      setSubmitting(false);
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
          Hỗ Trợ & Tiếp Nhận Ý Kiến Hội Viên
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Gửi yêu cầu giải đáp thắc mắc về thẻ tập, thanh toán, hoặc phản hồi chất lượng phòng tập tới ban quản lý.
        </Typography>
      </Box>

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

      <Grid container spacing={3}>
        {/* Form to submit request */}
        <Grid item xs={12} md={5}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <AgentIcon color="primary" /> Gửi Yêu Cầu Mới
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
              Yêu cầu của bạn sẽ được chuyển trực tiếp tới bàn Lễ tân và Quản lý trung tâm.
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2.5}>
                <TextField
                  fullWidth
                  required
                  label="Tiêu đề yêu cầu"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Ví dụ: Cần kiểm tra giao dịch MoMo"
                />

                <TextField
                  fullWidth
                  required
                  multiline
                  rows={4}
                  label="Nội dung chi tiết"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Mô tả cụ thể vấn đề hoặc ý kiến đóng góp của bạn..."
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={submitting}
                  startIcon={submitting ? <CircularProgress size={18} /> : <SendIcon />}
                  sx={{ py: 1.2, fontWeight: 700 }}
                >
                  {submitting ? 'Đang gửi...' : 'Gửi Yêu Cầu Hỗ Trợ'}
                </Button>
              </Stack>
            </Box>
          </Paper>
        </Grid>

        {/* List of my submitted requests */}
        <Grid item xs={12} md={7}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
              Lịch Sử Yêu Cầu Đã Gửi ({requests.length})
            </Typography>

            {requests.length === 0 ? (
              <Box sx={{ py: 4, textAlign: 'center' }}>
                <SupportIcon sx={{ fontSize: 44, color: 'text.secondary', mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Bạn chưa gửi yêu cầu hỗ trợ nào.
                </Typography>
              </Box>
            ) : (
              <Stack spacing={2}>
                {requests.map((req) => {
                  const cfg = statusConfig[req.status] || statusConfig.Open;
                  return (
                    <Card key={req.id} sx={{ borderRadius: 2.5, border: '1px solid #E2E8F0', boxShadow: 'none' }}>
                      <CardContent sx={{ p: 2.5 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                            {req.subject}
                          </Typography>
                          <Chip label={cfg.label} size="small" color={cfg.color} sx={{ fontWeight: 700 }} />
                        </Stack>

                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
                          Gửi ngày: {new Date(req.createdAt).toLocaleString('vi-VN')} | Mã: #{req.id}
                        </Typography>

                        <Typography variant="body2" sx={{ color: '#334155', mb: 2 }}>
                          {req.description}
                        </Typography>

                        {req.resolution ? (
                          <Box sx={{ p: 2, bgcolor: 'rgba(34, 197, 94, 0.08)', borderRadius: 2, border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: 'success.main', display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                              <ResolvedIcon fontSize="small" /> PHẢN HỒI TỪ BAN QUẢN LÝ / LỄ TÂN:
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#0F172A' }}>
                              {req.resolution}
                            </Typography>
                          </Box>
                        ) : (
                          <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                            Đang chờ phản hồi từ nhân viên tiếp nhận...
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </Stack>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MemberSupport;
