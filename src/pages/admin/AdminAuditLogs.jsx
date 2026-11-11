import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { HistoryEdu as AuditIcon } from '@mui/icons-material';
import { adminApi } from '../../services/api';

const actionColorMap = {
  CREATE: 'success',
  UPDATE: 'info',
  DELETE: 'error',
};

const AdminAuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi
      .getAuditLogs(0, 50)
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.content || [];
        setLogs(list);
      })
      .catch((err) => {
        setError(err.message || 'Không thể tải nhật ký hoạt động hệ thống.');
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
          Nhật Ký Hoạt Động Hệ Thống (Audit Logs)
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Ghi nhận toàn bộ thao tác thêm, sửa, xóa và tác động dữ liệu của nhân sự quản lý và lễ tân trên CSDL.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#F8FAFC' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Mã Log</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Hành Động</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Đối Tượng Thực Thể</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Mã Thực Thể</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Người Thực Hiện</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Nội Dung Chi Tiết</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Thời Gian</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                    Chưa có nhật ký hoạt động nào.
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log, index) => (
                  <TableRow key={log.logId || log.id || index} hover>
                    <TableCell sx={{ fontWeight: 600 }}>#{log.logId || log.id || index + 1}</TableCell>
                    <TableCell>
                      <Chip
                        label={log.actionType || 'ACTION'}
                        size="small"
                        color={actionColorMap[log.actionType] || 'default'}
                        sx={{ fontWeight: 800, fontSize: '0.7rem' }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>{log.entityName}</TableCell>
                    <TableCell>#{log.entityId}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>
                      User ID: #{log.actorUserId || log.userId || 1}
                    </TableCell>
                    <TableCell sx={{ maxWidth: 350 }}>{log.details || '—'}</TableCell>
                    <TableCell sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                      {new Date(log.createdAt).toLocaleString('vi-VN')}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default AdminAuditLogs;
