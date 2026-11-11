import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Button,
  Stack,
  TextField,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from '@mui/material';
import {
  Assignment as PlanIcon,
  Add as AddIcon,
  Edit as EditIcon,
  NoteAdd as RecordResultIcon,
  Psychology as AiIcon,
} from '@mui/icons-material';
import { trainingApi } from '../../services/api';

const CoachTraining = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Create plan modal state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [submittingPlan, setSubmittingPlan] = useState(false);
  const [newPlan, setNewPlan] = useState({
    memberId: '',
    goals: '',
    aiRecommendation: '',
  });

  // Record result modal state
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [submittingResult, setSubmittingResult] = useState(false);
  const [selectedPlanForResult, setSelectedPlanForResult] = useState(null);
  const [resultData, setResultData] = useState({
    resultNotes: '',
    progressComment: '',
  });

  const fetchPlans = () => {
    setLoading(true);
    trainingApi
      .getCoachPlans()
      .then((data) => {
        setPlans(data || []);
      })
      .catch((err) => {
        setError(err.message || 'Không thể tải danh sách kế hoạch huấn luyện.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    if (!newPlan.memberId || !newPlan.goals.trim()) {
      setError('Vui lòng nhập Mã hội viên (Member ID) và Mục tiêu tập luyện.');
      return;
    }

    setSubmittingPlan(true);
    setError('');
    setSuccessMsg('');

    try {
      await trainingApi.createPlan({
        memberId: Number(newPlan.memberId),
        goals: newPlan.goals.trim(),
        aiRecommendation: newPlan.aiRecommendation.trim() || null,
      });
      setSuccessMsg('Đã tạo thành công giáo trình tập luyện cho học viên!');
      setCreateModalOpen(false);
      setNewPlan({ memberId: '', goals: '', aiRecommendation: '' });
      fetchPlans();
    } catch (err) {
      setError(err.message || 'Tạo kế hoạch không thành công.');
    } finally {
      setSubmittingPlan(false);
    }
  };

  const handleOpenRecordResult = (plan) => {
    setSelectedPlanForResult(plan);
    setResultData({ resultNotes: '', progressComment: '' });
    setResultModalOpen(true);
  };

  const handleSaveResult = async (e) => {
    e.preventDefault();
    if (!resultData.resultNotes.trim()) {
      setError('Vui lòng nhập nội dung đánh giá buổi tập.');
      return;
    }

    setSubmittingResult(true);
    setError('');
    setSuccessMsg('');

    try {
      await trainingApi.recordResult({
        planId: selectedPlanForResult.planId,
        memberId: selectedPlanForResult.memberId,
        resultNotes: resultData.resultNotes.trim(),
        progressComment: resultData.progressComment.trim() || null,
      });
      setSuccessMsg(`Đã ghi nhận kết quả tập luyện cho học viên #${selectedPlanForResult.memberId}!`);
      setResultModalOpen(false);
    } catch (err) {
      setError(err.message || 'Ghi nhận kết quả thất bại.');
    } finally {
      setSubmittingResult(false);
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
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} sx={{ mb: 4 }} spacing={2}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Quản Lý Giáo Trình & Đánh Giá Huấn Luyện
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Xây dựng mục tiêu tập luyện, ghi nhận lời khuyên dinh dưỡng và lưu trữ kết quả rèn luyện của học viên.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setCreateModalOpen(true)}
          sx={{ fontWeight: 700 }}
        >
          Tạo Kế Hoạch Mới
        </Button>
      </Stack>

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

      {plans.length === 0 ? (
        <Paper elevation={0} sx={{ p: 6, textAlign: 'center', borderRadius: 3, border: '1px solid #E2E8F0' }}>
          <PlanIcon sx={{ fontSize: 56, color: 'text.secondary', mb: 1.5 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
            Chưa có giáo trình tập luyện nào được tạo
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Hãy thiết lập kế hoạch tập luyện cá nhân hóa cho học viên đầu tiên của bạn.
          </Typography>
          <Button variant="contained" color="primary" onClick={() => setCreateModalOpen(true)}>
            Tạo Giáo Trình Đầu Tiên
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {plans.map((p) => (
            <Grid item xs={12} md={6} key={p.planId}>
              <Card sx={{ borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                    <Chip label={`Giáo trình #${p.planId}`} color="primary" size="small" sx={{ fontWeight: 700 }} />
                    <Typography variant="caption" color="text.secondary">
                      Ngày lập: {p.createdDate}
                    </Typography>
                  </Stack>

                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F172A', mb: 1 }}>
                    Học viên: {p.member?.fullName || `ID #${p.memberId}`}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block' }}>
                      MỤC TIÊU HUẤN LUYỆN:
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#1E293B' }}>
                      {p.goals}
                    </Typography>
                  </Box>

                  {p.aiRecommendation && (
                    <Box sx={{ p: 1.5, bgcolor: 'rgba(25, 118, 210, 0.05)', borderRadius: 2, border: '1px solid rgba(25, 118, 210, 0.15)' }}>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <AiIcon fontSize="small" /> ĐỀ XUẤT PHÁC ĐỒ:
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        {p.aiRecommendation}
                      </Typography>
                    </Box>
                  )}
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0, justifyContent: 'flex-end' }}>
                  <Button
                    size="small"
                    variant="contained"
                    color="secondary"
                    startIcon={<RecordResultIcon />}
                    onClick={() => handleOpenRecordResult(p)}
                    sx={{ fontWeight: 700 }}
                  >
                    Ghi Nhận Kết Quả Buổi Tập
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create Plan Dialog */}
      <Dialog open={createModalOpen} onClose={() => setCreateModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Tạo Kế Hoạch Huấn Luyện Cho Học Viên</DialogTitle>
        <Box component="form" onSubmit={handleCreatePlan}>
          <DialogContent>
            <Stack spacing={2.5}>
              <TextField
                required
                fullWidth
                label="Mã Hội Viên (Member ID)"
                type="number"
                value={newPlan.memberId}
                onChange={(e) => setNewPlan({ ...newPlan, memberId: e.target.value })}
                placeholder="Ví dụ: 5 (Nguyễn Gia Bảo) hoặc 6, 7..."
                helperText="Nhập ID tài khoản hội viên cần lập giáo trình"
              />

              <TextField
                required
                fullWidth
                multiline
                rows={3}
                label="Mục tiêu tập luyện (Goals)"
                value={newPlan.goals}
                onChange={(e) => setNewPlan({ ...newPlan, goals: e.target.value })}
                placeholder="Ví dụ: Cải thiện độ dẻo dai khớp vai và tăng sức bền cơ lõi..."
              />

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Lời khuyên hoặc Đề xuất giáo trình (AI Recommendation)"
                value={newPlan.aiRecommendation}
                onChange={(e) => setNewPlan({ ...newPlan, aiRecommendation: e.target.value })}
                placeholder="Ví dụ: Tập 3 buổi/tuần, bổ sung 2 lít nước và giãn cơ sau buổi..."
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setCreateModalOpen(false)} disabled={submittingPlan}>
              Hủy
            </Button>
            <Button type="submit" variant="contained" color="primary" disabled={submittingPlan} sx={{ fontWeight: 700 }}>
              {submittingPlan ? 'Đang tạo...' : 'Lưu Giáo Trình'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Record Result Dialog */}
      <Dialog open={resultModalOpen} onClose={() => setResultModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>
          Ghi Nhận Kết Quả & Đánh Giá Buổi Tập
        </DialogTitle>
        <Box component="form" onSubmit={handleSaveResult}>
          <DialogContent>
            {selectedPlanForResult && (
              <Alert severity="info" sx={{ mb: 2.5 }}>
                Đánh giá cho học viên: <strong>{selectedPlanForResult.member?.fullName || `#${selectedPlanForResult.memberId}`}</strong> (Kế hoạch #{selectedPlanForResult.planId})
              </Alert>
            )}

            <Stack spacing={2.5}>
              <TextField
                required
                fullWidth
                multiline
                rows={3}
                label="Nội dung và kết quả buổi tập (Result Notes)"
                value={resultData.resultNotes}
                onChange={(e) => setResultData({ ...resultData, resultNotes: e.target.value })}
                placeholder="Ví dụ: Đã hoàn thành 5 hiệp nâng tạ mức 40kg, nhịp tim ổn định..."
              />

              <TextField
                fullWidth
                multiline
                rows={2}
                label="Nhận xét tiến bộ của HLV (Progress Comment)"
                value={resultData.progressComment}
                onChange={(e) => setResultData({ ...resultData, progressComment: e.target.value })}
                placeholder="Ví dụ: Kỹ thuật thở đã cải thiện tốt, cần chú ý góc đặt bàn chân..."
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setResultModalOpen(false)} disabled={submittingResult}>
              Hủy
            </Button>
            <Button type="submit" variant="contained" color="secondary" disabled={submittingResult} sx={{ fontWeight: 700 }}>
              {submittingResult ? 'Đang lưu...' : 'Lưu Kết Quả Buổi Tập'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

export default CoachTraining;
