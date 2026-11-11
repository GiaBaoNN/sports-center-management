import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Stack,
  Button,
  Chip,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Grid,
} from '@mui/material';
import {
  ContactSupport as SupportIcon,
  CheckCircle as ResolvedIcon,
  EditNote as ResolveIcon,
} from '@mui/icons-material';
import { supportApi } from '../../services/api';

const statusMap = {
  Open: { label: 'Chờ Tiếp Nhận', color: 'warning' },
  InProgress: { label: 'Đang Xử Lý', color: 'info' },
  Resolved: { label: 'Đã Giải Quyết', color: 'success' },
  Closed: { label: 'Đã Đóng', color: 'default' },
};

const ReceptionSupport = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Resolve dialog
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [resolveStatus, setResolveStatus] = useState('Resolved');
  const [resolutionText, setResolutionText] = useState('');
  const [resolving, setResolving] = useState(false);

  const fetchRequests = () => {
    setLoading(true);
    supportApi
      .getAll(0, 50)
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.content || [];
        setRequests(list);
      })
      .catch((err) => {
        setError(err.message || 'Không thể tải danh sách yêu cầu hỗ trợ.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleOpenResolve = (req) => {
    setSelectedRequest(req);
    setResolveStatus(req.status === 'Open' ? 'InProgress' : 'Resolved');
    setResolutionText(req.resolution || '');
    setResolveModalOpen(true);
  };

  const handleConfirmResolve = async (e) => {
    e.preventDefault();
    if (!selectedRequest) return;

    setResolving(true);
    setError('');
    setSuccessMsg('');

    try {
      await supportApi.resolve(selectedRequest.id, {
        status: resolveStatus,
        resolution: resolutionText.trim() || 'Đã tiếp nhận và xử lý thỏa đáng.',
      });
      setSuccessMsg(`Đã cập nhật trạng thái yêu cầu #${selectedRequest.id} thành công!`);
      setResolveModalOpen(false);
      fetchRequests();
    } catch (err) {
      setError(err.message || 'Cập nhật yêu cầu thất bại.');
    } finally {
      setResolving(false);
    }
  };

  const filteredRequests = requests.filter((r) => {
    if (statusFilter === 'ALL') return true;
    return r.status === statusFilter;
  });

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
          Tiếp Nhận & Xử Lý Yêu Cầu Hỗ Trợ
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Phản hồi thắc mắc, hỗ trợ sự cố thanh toán và giải đáp thông tin cho hội viên trung tâm.
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

      {/* Filter Tabs */}
      <Stack direction="row" spacing={1} sx={{ mb: 3 }} flexWrap="wrap">
        {['ALL', 'Open', 'InProgress', 'Resolved', 'Closed'].map((st) => (
          <Chip
            key={st}
            label={st === 'ALL' ? 'Tất Cả' : statusMap[st]?.label || st}
            onClick={() => setStatusFilter(st)}
            color={statusFilter === st ? 'primary' : 'default'}
            variant={statusFilter === st ? 'filled' : 'outlined'}
            sx={{ fontWeight: 700, mb: 1 }}
          />
        ))}
      </Stack>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <Paper elevation={0} sx={{ p: 5, textAlign: 'center', borderRadius: 3, border: '1px solid #E2E8F0' }}>
          <Typography variant="body2" color="text.secondary">
            Không có yêu cầu hỗ trợ nào trong danh mục này.
          </Typography>
        </Paper>
      ) : (
        <Stack spacing={2.5}>
          {filteredRequests.map((req) => {
            const cfg = statusMap[req.status] || statusMap.Open;
            return (
              <Card key={req.id} sx={{ borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none' }}>
                <CardContent sx={{ p: 3 }}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} sx={{ mb: 1.5 }} spacing={1}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        {req.subject}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Mã yêu cầu: #{req.id} | Hội viên: <strong>{req.member?.fullName || `ID #${req.memberId}`}</strong> ({req.member?.phone || 'SĐT: Không có'}) | Gửi ngày: {new Date(req.createdAt).toLocaleString('vi-VN')}
                      </Typography>
                    </Box>
                    <Chip label={cfg.label} color={cfg.color} size="small" sx={{ fontWeight: 700 }} />
                  </Stack>

                  <Typography variant="body1" sx={{ color: '#334155', mb: 2, bgcolor: '#F8FAFC', p: 2, borderRadius: 2 }}>
                    {req.description}
                  </Typography>

                  {req.resolution && (
                    <Box sx={{ p: 2, bgcolor: 'rgba(34, 197, 94, 0.08)', borderRadius: 2, border: '1px solid rgba(34, 197, 94, 0.2)', mb: 2 }}>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: 'success.main', display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                        <ResolvedIcon fontSize="small" /> NỘI DUNG ĐÃ PHẢN HỒI:
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#0F172A' }}>
                        {req.resolution}
                      </Typography>
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      startIcon={<ResolveIcon />}
                      onClick={() => handleOpenResolve(req)}
                      sx={{ fontWeight: 700 }}
                    >
                      Cập Nhật Trạng Thái & Phản Hồi
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      )}

      {/* Resolve Dialog */}
      <Dialog open={resolveModalOpen} onClose={() => setResolveModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>
          Xử Lý & Trả Lời Yêu Cầu Hỗ Trợ #{selectedRequest?.id}
        </DialogTitle>
        <Box component="form" onSubmit={handleConfirmResolve}>
          <DialogContent>
            {selectedRequest && (
              <Box sx={{ mb: 2.5, p: 2, bgcolor: '#F8FAFC', borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  Tiêu đề: {selectedRequest.subject}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Nội dung: {selectedRequest.description}
                </Typography>
              </Box>
            )}

            <Stack spacing={2.5}>
              <TextField
                select
                fullWidth
                required
                label="Trạng Thái Xử Lý Mới"
                value={resolveStatus}
                onChange={(e) => setResolveStatus(e.target.value)}
              >
                <MenuItem value="InProgress">Đang xử lý (InProgress)</MenuItem>
                <MenuItem value="Resolved">Đã giải quyết (Resolved)</MenuItem>
                <MenuItem value="Closed">Đóng yêu cầu (Closed)</MenuItem>
              </TextField>

              <TextField
                fullWidth
                required
                multiline
                rows={4}
                label="Nội dung phản hồi tới hội viên (Resolution)"
                value={resolutionText}
                onChange={(e) => setResolutionText(e.target.value)}
                placeholder="Ghi rõ hướng giải quyết hoặc câu trả lời tới hội viên..."
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setResolveModalOpen(false)} disabled={resolving}>
              Hủy
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={resolving} sx={{ fontWeight: 700 }}>
              {resolving ? 'Đang lưu...' : 'Lưu Phản Hồi'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default ReceptionSupport;
