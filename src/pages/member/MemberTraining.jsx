import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
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
  Assignment as PlanIcon,
  SportsKabaddi as CoachIcon,
  EmojiEvents as TrophyIcon,
  Psychology as AiIcon,
  EventNote as ResultIcon,
} from '@mui/icons-material';
import { trainingApi } from '../../services/api';

const MemberTraining = () => {
  const [plans, setPlans] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.allSettled([trainingApi.getMyPlans(), trainingApi.getMyResults()])
      .then(([plansRes, resultsRes]) => {
        if (plansRes.status === 'fulfilled') setPlans(plansRes.value || []);
        if (resultsRes.status === 'fulfilled') setResults(resultsRes.value || []);
      })
      .catch((err) => {
        setError(err.message || 'Không thể tải giáo trình huấn luyện.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

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
          Kế Hoạch & Kết Quả Huấn Luyện
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Theo dõi giáo trình tập luyện cá nhân hóa do HLV xây dựng và lịch sử đánh giá thể lực.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Plans Section */}
      <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
        Giáo Trình & Mục Tiêu Tập Luyện ({plans.length})
      </Typography>

      {plans.length === 0 ? (
        <Paper elevation={0} sx={{ p: 4, textAlign: 'center', borderRadius: 3, border: '1px solid #E2E8F0', mb: 4 }}>
          <PlanIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1.5 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Chưa có kế hoạch tập luyện nào
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Huấn luyện viên phụ trách lớp học sẽ lập kế hoạch rèn luyện chi tiết cho bạn sau buổi học đầu tiên.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {plans.map((plan) => (
            <Grid item xs={12} md={6} key={plan.planId}>
              <Card sx={{ borderRadius: 3, border: '1px solid #E2E8F0', boxShadow: 'none' }}>
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Chip label={`Kế hoạch #${plan.planId}`} color="primary" size="small" sx={{ fontWeight: 700 }} />
                    <Typography variant="caption" color="text.secondary">
                      Tạo ngày: {plan.createdDate}
                    </Typography>
                  </Stack>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.secondary', mb: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TrophyIcon fontSize="small" color="primary" /> MỤC TIÊU HUẤN LUYỆN:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#0F172A' }}>
                      {plan.goals}
                    </Typography>
                  </Box>

                  {plan.aiRecommendation && (
                    <Box sx={{ p: 2, bgcolor: 'rgba(25, 118, 210, 0.05)', borderRadius: 2, border: '1px solid rgba(25, 118, 210, 0.15)', mb: 2 }}>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                        <AiIcon fontSize="small" /> LỜI KHUYÊN & ĐỀ XUẤT:
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.primary' }}>
                        {plan.aiRecommendation}
                      </Typography>
                    </Box>
                  )}

                  <Divider sx={{ my: 1.5 }} />
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                    <CoachIcon fontSize="small" /> HLV Phụ Trách: <strong>{plan.coach?.fullName || 'HLV Trung tâm'}</strong>
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Results Section */}
      <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
        Đánh Giá Tiến Độ & Kết Quả Buổi Tập ({results.length})
      </Typography>

      {results.length === 0 ? (
        <Paper elevation={0} sx={{ p: 4, textAlign: 'center', borderRadius: 3, border: '1px solid #E2E8F0' }}>
          <ResultIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1.5 }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Chưa có ghi nhận kết quả tập luyện
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Sau khi bạn hoàn thành các buổi tập với HLV, kết quả và nhận xét tiến bộ sẽ được cập nhật tại đây.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {results.map((res) => (
            <Grid item xs={12} md={6} key={res.resultId}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1976D2' }}>
                    Buổi tập ngày {new Date(res.recordedAt).toLocaleDateString('vi-VN')}
                  </Typography>
                  <Chip label="Đã hoàn thành" size="small" color="success" sx={{ fontWeight: 700 }} />
                </Stack>

                <Typography variant="body2" sx={{ mb: 1.5, color: '#0F172A' }}>
                  <strong>Nội dung buổi tập:</strong> {res.resultNotes}
                </Typography>

                {res.progressComment && (
                  <Box sx={{ p: 1.5, bgcolor: '#F8FAFC', borderRadius: 2, border: '1px solid #E2E8F0' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block', mb: 0.5 }}>
                      Nhận xét của HLV:
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {res.progressComment}
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default MemberTraining;
