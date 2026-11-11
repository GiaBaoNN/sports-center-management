import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Stack,
  Button,
  Chip,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Notifications as NotifIcon,
  DoneAll as DoneAllIcon,
  CheckCircle as ReadIcon,
  Circle as UnreadIcon,
} from '@mui/icons-material';
import { notificationApi } from '../../services/api';

const MemberNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [markingAll, setMarkingAll] = useState(false);

  const fetchNotifications = () => {
    setLoading(true);
    notificationApi
      .getMy()
      .then((data) => {
        setNotifications(data || []);
      })
      .catch((err) => {
        setError(err.message || 'Không thể tải thông báo.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.notificationId === id ? { ...n, isRead: true, readAt: new Date().toISOString() } : n))
      );
    } catch (err) {
      setError(err.message || 'Lỗi khi cập nhật thông báo.');
    }
  };

  const handleMarkAllAsRead = async () => {
    setMarkingAll(true);
    try {
      await notificationApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true, readAt: new Date().toISOString() })));
    } catch (err) {
      setError(err.message || 'Lỗi khi đánh dấu tất cả đã đọc.');
    } finally {
      setMarkingAll(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <Box maxWidth="md">
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} sx={{ mb: 4 }} spacing={2}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Hộp Thư Thông Báo
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Cập nhật về lịch học, tình trạng thẻ hội viên và các thông báo quan trọng từ trung tâm.
          </Typography>
        </Box>
        {unreadCount > 0 && (
          <Button
            variant="outlined"
            startIcon={<DoneAllIcon />}
            onClick={handleMarkAllAsRead}
            disabled={markingAll}
            sx={{ fontWeight: 700 }}
          >
            Đánh Dấu Tất Cả Đã Đọc
          </Button>
        )}
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {notifications.length === 0 ? (
        <Paper elevation={0} sx={{ p: 6, textAlign: 'center', borderRadius: 4, border: '1px solid #E2E8F0' }}>
          <NotifIcon sx={{ fontSize: 56, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
            Chưa có thông báo nào
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Hộp thư của bạn hoàn toàn trống.
          </Typography>
        </Paper>
      ) : (
        <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
          <List disablePadding>
            {notifications.map((n, index) => (
              <ListItem
                key={n.notificationId}
                divider={index < notifications.length - 1}
                sx={{
                  py: 2.5,
                  px: 3,
                  bgcolor: n.isRead ? '#FFFFFF' : 'rgba(25, 118, 210, 0.04)',
                }}
                secondaryAction={
                  !n.isRead && (
                    <Tooltip title="Đánh dấu đã đọc">
                      <IconButton edge="end" onClick={() => handleMarkAsRead(n.notificationId)} size="small" color="primary">
                        <ReadIcon />
                      </IconButton>
                    </Tooltip>
                  )
                }
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  {n.isRead ? (
                    <UnreadIcon sx={{ fontSize: 10, color: 'transparent' }} />
                  ) : (
                    <UnreadIcon sx={{ fontSize: 12, color: 'primary.main' }} />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 0.5 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: n.isRead ? 600 : 800, color: n.isRead ? 'text.primary' : 'primary.main' }}>
                        {n.title}
                      </Typography>
                      {!n.isRead && (
                        <Chip label="Mới" size="small" color="primary" sx={{ height: 18, fontSize: '0.65rem', fontWeight: 800 }} />
                      )}
                    </Stack>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        {n.message}
                      </Typography>
                      <Typography variant="caption" color="text.disabled">
                        {new Date(n.createdAt).toLocaleString('vi-VN')}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
};

export default MemberNotifications;
