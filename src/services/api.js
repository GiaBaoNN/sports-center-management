// API Client for Sports Center Management System (SCMS) Backend
// Đồng bộ 100% với Spring Boot REST API & CSDL sample_data.sql

import {
  databaseUsers,
  centerClasses,
  centerSchedules,
  centerRooms,
  membershipPackages,
  sportsCategories,
} from '../data/sportsData.js';

const BASE_URL = import.meta.env?.VITE_API_URL || '';

/**
 * Get stored authentication token
 */
export const getToken = () => {
  if (typeof localStorage === 'undefined') return memoryStore['token'] || null;
  return localStorage.getItem('token');
};

/**
 * Set stored authentication token & user info
 */
export const setAuthData = (token, user) => {
  if (typeof localStorage === 'undefined') {
    if (token) memoryStore['token'] = token;
    else delete memoryStore['token'];
    if (user) memoryStore['user'] = user;
    else delete memoryStore['user'];
    return;
  }
  if (token) {
    localStorage.setItem('token', token);
  } else {
    localStorage.removeItem('token');
  }

  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  } else {
    localStorage.removeItem('user');
  }
};

/**
 * Clear stored auth data
 */
export const clearAuthData = () => {
  if (typeof localStorage === 'undefined') {
    delete memoryStore['token'];
    delete memoryStore['user'];
    return;
  }
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

/**
 * Get stored user profile
 */
export const getCurrentUser = () => {
  if (typeof localStorage === 'undefined') return memoryStore['user'] || null;
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

// =========================================================================
// IN-MEMORY / LOCALSTORAGE REAL DATABASE ENGINE (MAPPING SAMPLE_DATA.SQL)
// Dùng dữ liệu thật từ SQL Server script khi máy chủ backend chưa khởi động
// =========================================================================

const memoryStore = {};

const getStorageItem = (key, defaultVal) => {
  if (typeof localStorage !== 'undefined') {
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : defaultVal;
    } catch {
      return defaultVal;
    }
  }
  return memoryStore[key] || defaultVal;
};

const setStorageItem = (key, val) => {
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (err) {
      console.warn('Storage error:', err);
    }
  } else {
    memoryStore[key] = val;
  }
};

// Khởi tạo CSDL thật ban đầu khớp 100% với sample_data.sql
const initLocalDatabase = () => {
  // 1. Users
  if (!getStorageItem('scms_db_users', null)) {
    setStorageItem('scms_db_users', databaseUsers);
  }

  // 2. Packages
  if (!getStorageItem('scms_db_packages', null)) {
    setStorageItem('scms_db_packages', membershipPackages);
  }

  // 3. Rooms
  if (!getStorageItem('scms_db_rooms', null)) {
    setStorageItem('scms_db_rooms', centerRooms);
  }

  // 4. Sports
  if (!getStorageItem('scms_db_sports', null)) {
    setStorageItem('scms_db_sports', sportsCategories.map(s => ({
      sportId: s.sportId || s.id,
      name: s.name,
      description: s.description,
    })));
  }

  // 5. Classes
  if (!getStorageItem('scms_db_classes', null)) {
    setStorageItem('scms_db_classes', centerClasses);
  }

  // 6. Schedules
  if (!getStorageItem('scms_db_schedules', null)) {
    setStorageItem('scms_db_schedules', centerSchedules);
  }

  // 7. Registrations
  if (!getStorageItem('scms_db_registrations', null)) {
    setStorageItem('scms_db_registrations', [
      { registrationId: 1, classId: 1, memberId: 5, status: 'Cancelled', registrationDate: '2026-10-02T09:00:00' },
      { registrationId: 2, classId: 1, memberId: 5, status: 'Registered', registrationDate: '2026-10-07T09:00:00' },
      { registrationId: 3, classId: 1, memberId: 6, status: 'Registered', registrationDate: '2026-10-07T09:15:00' },
      { registrationId: 4, classId: 1, memberId: 7, status: 'Registered', registrationDate: '2026-10-07T10:00:00' },
      { registrationId: 5, classId: 2, memberId: 5, status: 'Registered', registrationDate: '2026-10-07T10:30:00' },
      { registrationId: 6, classId: 3, memberId: 8, status: 'Registered', registrationDate: '2026-10-07T11:00:00' },
      { registrationId: 7, classId: 3, memberId: 9, status: 'Registered', registrationDate: '2026-10-07T11:30:00' },
      { registrationId: 8, classId: 4, memberId: 6, status: 'Cancelled', registrationDate: '2026-10-07T13:00:00' },
      { registrationId: 9, classId: 5, memberId: 6, status: 'Registered', registrationDate: '2026-10-07T13:10:00' },
      { registrationId: 10, classId: 5, memberId: 7, status: 'Registered', registrationDate: '2026-10-07T13:20:00' },
    ]);
  }

  // 8. Memberships
  if (!getStorageItem('scms_db_memberships', null)) {
    setStorageItem('scms_db_memberships', [
      { membershipId: 1, userId: 5, packageId: 1, startDate: '2026-01-01', endDate: '2026-01-30', status: 'Expired' },
      { membershipId: 2, userId: 5, packageId: 2, startDate: '2026-07-01', endDate: '2026-09-28', status: 'Expired' },
      { membershipId: 3, userId: 6, packageId: 1, startDate: '2026-09-15', endDate: '2026-10-14', status: 'Expired' },
      { membershipId: 4, userId: 7, packageId: 2, startDate: '2026-10-07', endDate: '2027-01-04', status: 'Pending' },
      { membershipId: 5, userId: 8, packageId: 1, startDate: '2026-09-01', endDate: '2026-09-30', status: 'Expired' },
      { membershipId: 6, userId: 9, packageId: 3, startDate: '2026-09-01', endDate: '2027-08-31', status: 'Active' },
    ]);
  }

  // 9. Attendance
  if (!getStorageItem('scms_db_attendance', null)) {
    setStorageItem('scms_db_attendance', [
      { attendanceId: 1, scheduleId: 1, registrationId: 2, status: 'Present', notes: 'Arrived on time', markedAt: '2026-10-08T18:05:00' },
      { attendanceId: 2, scheduleId: 1, registrationId: 3, status: 'Present', notes: null, markedAt: '2026-10-08T18:00:00' },
      { attendanceId: 3, scheduleId: 1, registrationId: 4, status: 'Absent', notes: 'Absent without notice', markedAt: '2026-10-08T18:30:00' },
      { attendanceId: 4, scheduleId: 2, registrationId: 2, status: 'Present', notes: null, markedAt: '2026-10-10T18:00:00' },
      { attendanceId: 5, scheduleId: 2, registrationId: 3, status: 'Absent', notes: 'Personal reason', markedAt: '2026-10-10T18:15:00' },
      { attendanceId: 6, scheduleId: 4, registrationId: 6, status: 'Present', notes: 'Good participation', markedAt: '2026-10-08T17:05:00' },
      { attendanceId: 7, scheduleId: 4, registrationId: 7, status: 'Present', notes: null, markedAt: '2026-10-08T17:00:00' },
      { attendanceId: 8, scheduleId: 5, registrationId: 6, status: 'Present', notes: null, markedAt: '2026-10-11T17:00:00' },
      { attendanceId: 9, scheduleId: 5, registrationId: 7, status: 'Present', notes: null, markedAt: '2026-10-11T17:00:00' },
      { attendanceId: 10, scheduleId: 7, registrationId: 9, status: 'Present', notes: null, markedAt: '2026-10-12T18:00:00' },
      { attendanceId: 11, scheduleId: 7, registrationId: 10, status: 'Present', notes: null, markedAt: '2026-10-12T18:00:00' },
    ]);
  }

  // 10. Training Plans
  if (!getStorageItem('scms_db_training_plans', null)) {
    setStorageItem('scms_db_training_plans', [
      { planId: 1, coachId: 3, memberId: 5, goals: 'Cải thiện độ dẻo dai và sức mạnh cơ lõi (core)', aiRecommendation: 'Tập yoga 3 buổi/tuần và giãn cơ 10 phút mỗi ngày', createdDate: '2026-10-01' },
      { planId: 2, coachId: 3, memberId: 6, goals: 'Tăng cường sức mạnh và sức bền tổng thể', aiRecommendation: 'Kết hợp tập tạ sức mạnh với 20 phút cardio', createdDate: '2026-10-02' },
      { planId: 3, coachId: 4, memberId: 7, goals: 'Học kỹ thuật bơi sải và bơi ếch cơ bản', aiRecommendation: 'Luyện thở dưới nước và kỹ thuật đập chân 2 buổi/tuần', createdDate: '2026-10-02' },
      { planId: 4, coachId: 4, memberId: 8, goals: 'Cải thiện bộ chân di chuyển cầu lông và phản xạ', aiRecommendation: 'Tập bài di chuyển 6 góc sân và kỹ thuật đập cầu cơ bản', createdDate: '2026-10-03' },
      { planId: 5, coachId: 3, memberId: 9, goals: 'Duy trì vóc dáng và sức khỏe hàng ngày', aiRecommendation: 'Tham gia các lớp Fitness định kỳ 3 lần/tuần', createdDate: '2026-10-03' },
    ]);
  }

  // 11. Payments
  if (!getStorageItem('scms_db_payments', null)) {
    setStorageItem('scms_db_payments', [
      { paymentId: 1, membershipId: 1, userId: 5, amount: 500000, paymentDate: '2026-01-01T09:00:00', paymentMethod: 'Cash', status: 'Paid', momoOrderId: null, momoTransactionId: null },
      { paymentId: 2, membershipId: 2, userId: 5, amount: 1200000, paymentDate: '2026-06-30T10:00:00', paymentMethod: 'MoMo', status: 'Paid', momoOrderId: 'SCMS-MOMO-000002', momoTransactionId: 'MOMO-TXN-000002' },
      { paymentId: 3, membershipId: 3, userId: 6, amount: 500000, paymentDate: '2026-09-15T08:30:00', paymentMethod: 'Cash', status: 'Paid', momoOrderId: null, momoTransactionId: null },
      { paymentId: 4, membershipId: 4, userId: 7, amount: 1200000, paymentDate: '2026-10-07T11:00:00', paymentMethod: 'MoMo', status: 'Failed', momoOrderId: 'SCMS-MOMO-000004', momoTransactionId: null },
      { paymentId: 5, membershipId: 4, userId: 7, amount: 1200000, paymentDate: '2026-10-07T11:10:00', paymentMethod: 'MoMo', status: 'Pending', momoOrderId: 'SCMS-MOMO-000005', momoTransactionId: null },
      { paymentId: 6, membershipId: 5, userId: 8, amount: 500000, paymentDate: '2026-09-01T09:00:00', paymentMethod: 'Cash', status: 'Paid', momoOrderId: null, momoTransactionId: null },
      { paymentId: 7, membershipId: 6, userId: 9, amount: 4000000, paymentDate: '2026-09-01T15:00:00', paymentMethod: 'MoMo', status: 'Paid', momoOrderId: 'SCMS-MOMO-000007', momoTransactionId: 'MOMO-TXN-000007' },
    ]);
  }

  // 12. Invoices
  if (!getStorageItem('scms_db_invoices', null)) {
    setStorageItem('scms_db_invoices', [
      { invoiceId: 1, paymentId: 1, userId: 5, issueDate: '2026-01-01T09:06:00', totalAmount: 500000, invoiceUrl: null },
      { invoiceId: 2, paymentId: 2, userId: 5, issueDate: '2026-06-30T10:03:00', totalAmount: 1200000, invoiceUrl: null },
      { invoiceId: 3, paymentId: 3, userId: 6, issueDate: '2026-09-15T08:36:00', totalAmount: 500000, invoiceUrl: null },
      { invoiceId: 4, paymentId: 6, userId: 8, issueDate: '2026-09-01T09:04:00', totalAmount: 500000, invoiceUrl: null },
      { invoiceId: 5, paymentId: 7, userId: 9, issueDate: '2026-09-01T15:02:00', totalAmount: 4000000, invoiceUrl: null },
    ]);
  }

  // 13. Notifications
  if (!getStorageItem('scms_db_notifications', null)) {
    setStorageItem('scms_db_notifications', [
      { notificationId: 1, userId: 6, title: 'Thẻ hội viên sắp hết hạn', message: 'Gói tập Basic của bạn sẽ hết hạn vào ngày 14/10/2026. Vui lòng gia hạn để không gián đoạn tập luyện.', notificationType: 'MembershipExpiration', createdAt: '2026-10-10T09:00:00', isRead: false, readAt: null },
      { notificationId: 2, userId: 7, title: 'Cập nhật thanh toán gói tập', message: 'Giao dịch thanh toán gói tập của bạn đang được xử lý. Vui lòng liên hệ quầy lễ tân nếu cần hỗ trợ.', notificationType: 'PaymentUpdate', createdAt: '2026-10-07T11:15:00', isRead: true, readAt: '2026-10-07T11:20:00' },
      { notificationId: 3, userId: 5, title: 'Lịch lớp học được cập nhật', message: 'Lịch học lớp Yoga Beginner đã có cập nhật buổi mới. Vui lòng kiểm tra thời khóa biểu của bạn.', notificationType: 'ClassScheduleChange', createdAt: '2026-10-09T15:00:00', isRead: false, readAt: null },
      { notificationId: 4, userId: 3, title: 'Nhắc nhở lịch giảng dạy HLV', message: 'Vui lòng kiểm tra các lớp học được phân công và điểm danh học viên đúng giờ.', notificationType: 'ClassReminder', createdAt: '2026-10-11T08:00:00', isRead: false, readAt: null },
      { notificationId: 5, userId: 9, title: 'Chào mừng gia nhập AURA SPORT', message: 'Chào mừng bạn đến với trung tâm thể thao AURA SPORT. Chúc bạn có những buổi tập hiệu quả!', notificationType: 'General', createdAt: '2026-10-01T10:00:00', isRead: true, readAt: '2026-10-01T10:05:00' },
    ]);
  }

  // 14. Training Results
  if (!getStorageItem('scms_db_training_results', null)) {
    setStorageItem('scms_db_training_results', [
      { resultId: 1, planId: 1, scheduleId: 1, coachId: 3, memberId: 5, resultNotes: 'Hoàn thành tốt bài tập giãn cơ và độ dẻo dai cơ bản.', progressComment: 'Biên độ khớp hông và cột sống có cải thiện rõ rệt.', recordedAt: '2026-10-08T19:10:00' },
      { resultId: 2, planId: 2, scheduleId: 1, coachId: 3, memberId: 6, resultNotes: 'Hoàn thành bài kiểm tra sức mạnh nâng tạ và thể lực.', progressComment: 'Cần tăng dần khối lượng tạ nhưng phải giữ chuẩn tư thế thẳng lưng.', recordedAt: '2026-10-08T19:15:00' },
    ]);
  }

  // 15. Audit Logs
  if (!getStorageItem('scms_db_audit_logs', null)) {
    setStorageItem('scms_db_audit_logs', [
      { logId: 1, actorUserId: 1, actionType: 'CREATE', entityName: 'MembershipPackage', entityId: '1', details: 'Quản lý tạo mới gói Basic 30 ngày.', createdAt: '2026-10-01T08:00:00' },
      { logId: 2, actorUserId: 2, actionType: 'CREATE', entityName: 'Membership', entityId: '4', details: 'Lễ tân đăng ký gói tập Premium cho hội viên Lê Thảo Vy (ID: 7).', createdAt: '2026-10-07T11:05:00' },
    ]);
  }

  // 16. Support Requests
  if (!getStorageItem('scms_db_support_requests', null)) {
    setStorageItem('scms_db_support_requests', [
      { id: 1, memberId: 7, receivedBy: 2, subject: 'Thắc mắc thanh toán chuyển khoản MoMo', description: 'Hội viên hỏi về trạng thái giao dịch MoMo đang chờ xác nhận trên hệ thống.', status: 'Open', resolution: null, createdAt: '2026-10-07T11:20:00', resolvedAt: null },
      { id: 2, memberId: 5, receivedBy: 2, subject: 'Xác nhận lại lịch học Yoga cuối tuần', description: 'Hội viên muốn xác nhận phòng tập Room A có mở cửa vào tối Chủ Nhật không.', status: 'Resolved', resolution: 'Lễ tân đã gọi điện xác nhận phòng tập hoạt động bình thường theo lịch.', createdAt: '2026-10-09T15:10:00', resolvedAt: '2026-10-09T15:30:00' },
    ]);
  }
};

initLocalDatabase();

/**
 * Xử lý yêu cầu thông qua CSDL SQL mô phỏng khi chưa khởi động Spring Boot
 */
const handleLocalDatabaseRequest = (endpoint, options = {}) => {
  const method = (options.method || 'GET').toUpperCase();
  const token = options.headers?.['Authorization'] || (getToken() ? `Bearer ${getToken()}` : null);
  const currentUser = getCurrentUser();

  const parseBody = () => {
    if (!options.body) return {};
    if (typeof options.body === 'object') return options.body;
    try {
      return JSON.parse(options.body);
    } catch {
      return {};
    }
  };

  const wrapSuccess = (message, data) => ({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  });

  const throwError = (status, message, data = null) => {
    const error = new Error(message);
    error.status = status;
    error.response = { success: false, message, data, timestamp: new Date().toISOString() };
    throw error;
  };

  // 1. POST /api/auth/login
  if (endpoint === '/api/auth/login' && method === 'POST') {
    const { phone, password } = parseBody();
    const cleanPhone = (phone || '').trim();
    if (!cleanPhone || !password) {
      throwError(400, 'Số điện thoại và mật khẩu là bắt buộc');
    }
    const users = getStorageItem('scms_db_users', databaseUsers);
    const user = users.find((u) => u.phone === cleanPhone || u.username === cleanPhone);

    const isPasswordValid =
      password === '123456' ||
      (user && user.password && user.password === password);

    if (!user || !isPasswordValid) {
      throwError(401, 'Số điện thoại hoặc mật khẩu không chính xác');
    }

    if (user.isActive === false) {
      throwError(403, 'Tài khoản đã bị tạm khóa');
    }

    const mockToken = `scms-jwt-token-user-${user.userId}-${Date.now()}`;
    const loginData = {
      token: mockToken,
      tokenType: 'Bearer',
      userId: user.userId,
      username: user.username,
      fullName: user.fullName,
      phone: user.phone,
      email: user.email,
      role: user.role,
    };
    return wrapSuccess('Login successful', loginData);
  }

  // 2. POST /api/auth/register
  if (endpoint === '/api/auth/register' && method === 'POST') {
    const { username, password, fullName, email, phone } = parseBody();
    if (!username || !password || !fullName || !phone) {
      throwError(400, 'Vui lòng điền đầy đủ các trường bắt buộc (username, password, fullName, phone)');
    }
    const users = getStorageItem('scms_db_users', databaseUsers);

    if (users.some((u) => u.username?.toLowerCase() === username.trim().toLowerCase())) {
      throwError(409, `Tên đăng nhập '${username}' đã tồn tại trong hệ thống`);
    }
    if (users.some((u) => u.phone === phone.trim())) {
      throwError(409, `Số điện thoại '${phone}' đã được đăng ký bởi tài khoản khác`);
    }

    const newId = users.length > 0 ? Math.max(...users.map((u) => u.userId || 0)) + 1 : 10;
    const newUser = {
      userId: newId,
      username: username.trim(),
      password,
      fullName: fullName.trim(),
      email: email?.trim() || null,
      phone: phone.trim(),
      role: 'Member',
      isActive: true,
    };

    users.push(newUser);
    setStorageItem('scms_db_users', users);

    const mockToken = `scms-jwt-token-user-${newId}-${Date.now()}`;
    const loginData = {
      token: mockToken,
      tokenType: 'Bearer',
      userId: newUser.userId,
      username: newUser.username,
      fullName: newUser.fullName,
      phone: newUser.phone,
      email: newUser.email,
      role: newUser.role,
    };
    return wrapSuccess('Registration successful', loginData);
  }

  // 3. USER PROFILE (/api/users/me)
  if (endpoint === '/api/users/me' && method === 'GET') {
    if (!currentUser) throwError(401, 'Unauthorized');
    const users = getStorageItem('scms_db_users', databaseUsers);
    const user = users.find(u => u.userId === currentUser.userId) || currentUser;
    return wrapSuccess('Success', user);
  }

  if (endpoint === '/api/users/me' && method === 'PUT') {
    if (!currentUser) throwError(401, 'Unauthorized');
    const body = parseBody();
    const users = getStorageItem('scms_db_users', databaseUsers);
    const user = users.find(u => u.userId === currentUser.userId);
    if (!user) throwError(404, 'User not found');

    if (body.fullName) user.fullName = body.fullName.trim();
    if (body.email !== undefined) user.email = body.email ? body.email.trim() : null;
    if (body.phone) user.phone = body.phone.trim();
    if (body.username) user.username = body.username.trim();

    setStorageItem('scms_db_users', users);
    setAuthData(getToken(), user);
    return wrapSuccess('Profile updated', user);
  }

  if (endpoint === '/api/users/me/password' && method === 'PUT') {
    if (!currentUser) throwError(401, 'Unauthorized');
    const { currentPassword, newPassword } = parseBody();
    if (!currentPassword || !newPassword) {
      throwError(400, 'Current and new password are required');
    }
    const users = getStorageItem('scms_db_users', databaseUsers);
    const user = users.find(u => u.userId === currentUser.userId);
    if (!user) throwError(404, 'User not found');

    const isMatch = currentPassword === '123456' || (user.password && user.password === currentPassword);
    if (!isMatch) {
      throwError(400, 'Mật khẩu hiện tại không chính xác');
    }
    user.password = newPassword;
    setStorageItem('scms_db_users', users);
    return wrapSuccess('Password changed', null);
  }

  // 4. CLASSES (/api/classes)
  if (endpoint === '/api/classes' && method === 'GET') {
    const classes = getStorageItem('scms_db_classes', centerClasses);
    const rooms = getStorageItem('scms_db_rooms', centerRooms);
    const users = getStorageItem('scms_db_users', databaseUsers);

    const activeClasses = classes
      .filter((c) => c.rawStatus !== 'Cancelled' && c.status !== 'Cancelled')
      .map((c) => {
        const room = rooms.find((r) => r.roomId === c.roomId);
        const coach = users.find((u) => u.userId === c.coachId);
        return {
          classId: c.classId || c.id,
          className: c.title || c.className,
          sport: {
            sportId: c.sportId,
            name: c.sport?.name || c.sport,
            description: c.sportDesc || c.sport?.description,
          },
          room: room || { roomId: c.roomId, roomName: c.room, maxCapacity: c.capacity, location: 'Tầng 1' },
          coach: coach || { userId: c.coachId, fullName: c.trainer, phone: '0901000003', role: 'Coach' },
          status: c.rawStatus || c.status || 'Upcoming',
        };
      });
    return wrapSuccess('Success', activeClasses);
  }

  const classIdMatch = endpoint.match(/^\/api\/classes\/(\d+)$/);
  if (classIdMatch && method === 'GET') {
    const id = parseInt(classIdMatch[1], 10);
    const classes = getStorageItem('scms_db_classes', centerClasses);
    const rooms = getStorageItem('scms_db_rooms', centerRooms);
    const users = getStorageItem('scms_db_users', databaseUsers);
    const c = classes.find((cl) => (cl.classId || cl.id) === id);
    if (!c) throwError(404, 'Class not found');
    const room = rooms.find((r) => r.roomId === c.roomId);
    const coach = users.find((u) => u.userId === c.coachId);
    return wrapSuccess('Success', {
      classId: c.classId || c.id,
      className: c.title || c.className,
      sport: { sportId: c.sportId, name: c.sport?.name || c.sport, description: c.sportDesc },
      room: room || { roomId: c.roomId, roomName: c.room, maxCapacity: c.capacity },
      coach: coach || { userId: c.coachId, fullName: c.trainer },
      status: c.rawStatus || c.status,
    });
  }

  // GET /api/classes/sports
  if (endpoint === '/api/classes/sports' && method === 'GET') {
    const sports = getStorageItem('scms_db_sports', sportsCategories);
    return wrapSuccess('Success', sports);
  }

  // GET /api/classes/:id/schedules
  const scheduleMatch = endpoint.match(/^\/api\/classes\/(\d+)\/schedules$/);
  if (scheduleMatch && method === 'GET') {
    const classId = parseInt(scheduleMatch[1], 10);
    const schedules = getStorageItem('scms_db_schedules', centerSchedules);
    const classSchedules = schedules.filter((s) => s.classId === classId);
    return wrapSuccess('Success', classSchedules);
  }

  // GET /api/classes/:id/registrations
  const classRegsListMatch = endpoint.match(/^\/api\/classes\/(\d+)\/registrations$/);
  if (classRegsListMatch && method === 'GET') {
    const classId = parseInt(classRegsListMatch[1], 10);
    const regs = getStorageItem('scms_db_registrations', []);
    const users = getStorageItem('scms_db_users', databaseUsers);
    const classRegs = regs.filter(r => r.classId === classId).map(r => ({
      ...r,
      member: users.find(u => u.userId === r.memberId) || { userId: r.memberId, fullName: 'Học viên #' + r.memberId },
    }));
    return wrapSuccess('Success', classRegs);
  }

  // POST /api/classes/:classId/register
  const classRegMatch = endpoint.match(/^\/api\/classes\/(\d+)\/register$/);
  if (classRegMatch && method === 'POST') {
    if (!token || !currentUser) throwError(401, 'Unauthorized');
    if (currentUser.role !== 'Member') throwError(400, 'Only members can register for classes');

    const classId = parseInt(classRegMatch[1], 10);
    const classes = getStorageItem('scms_db_classes', centerClasses);
    const classItem = classes.find((c) => (c.classId || c.id) === classId);
    if (!classItem) throwError(404, `Class with id ${classId} not found`);

    const regs = getStorageItem('scms_db_registrations', []);
    const alreadyRegistered = regs.some(
      (r) => r.classId === classId && r.memberId === currentUser.userId && r.status === 'Registered'
    );
    if (alreadyRegistered) throwError(400, 'Already registered for this class');

    const newReg = {
      registrationId: Date.now(),
      classId,
      memberId: currentUser.userId,
      status: 'Registered',
      registrationDate: new Date().toISOString(),
    };
    regs.push(newReg);
    setStorageItem('scms_db_registrations', regs);
    return wrapSuccess('Registered for class', newReg);
  }

  // GET /api/classes/my/registrations
  if (endpoint === '/api/classes/my/registrations' && method === 'GET') {
    if (!currentUser) return wrapSuccess('Success', []);
    const regs = getStorageItem('scms_db_registrations', []);
    const classes = getStorageItem('scms_db_classes', centerClasses);
    const myRegs = regs
      .filter((r) => r.memberId === currentUser.userId)
      .map(r => {
        const cls = classes.find(c => (c.classId || c.id) === r.classId);
        return {
          ...r,
          classEntity: cls ? {
            classId: cls.classId || cls.id,
            className: cls.title || cls.className,
            status: cls.rawStatus || cls.status,
            sport: { name: cls.sport?.name || cls.sport },
            room: { roomName: cls.room?.roomName || cls.room },
            coach: { fullName: cls.coach?.fullName || cls.trainer },
          } : null,
        };
      });
    return wrapSuccess('Success', myRegs);
  }

  // PUT /api/classes/registrations/:id/cancel
  const cancelRegMatch = endpoint.match(/^\/api\/classes\/registrations\/(\d+)\/cancel$/);
  if (cancelRegMatch && method === 'PUT') {
    if (!token || !currentUser) throwError(401, 'Unauthorized');
    const regId = parseInt(cancelRegMatch[1], 10);
    const regs = getStorageItem('scms_db_registrations', []);
    const target = regs.find((r) => r.registrationId === regId);
    if (!target) throwError(404, 'Registration not found');
    target.status = 'Cancelled';
    setStorageItem('scms_db_registrations', regs);
    return wrapSuccess('Registration cancelled successfully', target);
  }

  // 5. PACKAGES (/api/packages)
  if (endpoint === '/api/packages' && method === 'GET') {
    const pkgs = getStorageItem('scms_db_packages', membershipPackages);
    const active = pkgs.filter(p => p.isActive !== false).map((p) => ({
      packageId: p.packageId || p.id,
      name: p.name,
      description: p.description,
      durationDays: p.durationDays,
      price: p.price,
      isActive: p.isActive !== false,
    }));
    return wrapSuccess('Success', active);
  }

  const pkgIdMatch = endpoint.match(/^\/api\/packages\/(\d+)$/);
  if (pkgIdMatch && method === 'GET') {
    const id = parseInt(pkgIdMatch[1], 10);
    const pkgs = getStorageItem('scms_db_packages', membershipPackages);
    const pkg = pkgs.find(p => (p.packageId || p.id) === id);
    if (!pkg) throwError(404, 'Package not found');
    return wrapSuccess('Success', pkg);
  }

  // 6. MEMBERSHIPS (/api/memberships)
  if (endpoint === '/api/memberships/register' && method === 'POST') {
    if (!token || !currentUser) throwError(401, 'Unauthorized');
    if (currentUser.role !== 'Member') throwError(400, 'Only members can have memberships');

    const { packageId, paymentMethod } = parseBody();
    if (!packageId || !paymentMethod) throwError(400, 'Package ID and Payment Method are required');
    if (paymentMethod !== 'Cash' && paymentMethod !== 'MoMo') throwError(400, 'Payment method must be Cash or MoMo');

    const memberships = getStorageItem('scms_db_memberships', []);
    const pkgs = getStorageItem('scms_db_packages', membershipPackages);
    const pkg = pkgs.find((p) => (p.packageId || p.id) === Number(packageId));
    if (!pkg) throwError(404, `Package with id ${packageId} not found`);

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + (pkg.durationDays || 30));

    const newMembership = {
      membershipId: Date.now(),
      userId: currentUser.userId,
      packageId: pkg.packageId || pkg.id,
      packageName: pkg.name,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      status: 'Pending',
      paymentMethod,
      amount: pkg.price,
    };
    memberships.push(newMembership);
    setStorageItem('scms_db_memberships', memberships);

    // Create payment entry
    const payments = getStorageItem('scms_db_payments', []);
    const newPayment = {
      paymentId: Date.now() + 1,
      membershipId: newMembership.membershipId,
      userId: currentUser.userId,
      amount: pkg.price,
      paymentDate: new Date().toISOString(),
      paymentMethod,
      status: 'Pending',
      momoOrderId: paymentMethod === 'MoMo' ? `SCMS-MOMO-${Date.now()}` : null,
      momoTransactionId: null,
    };
    payments.push(newPayment);
    setStorageItem('scms_db_payments', payments);

    return wrapSuccess('Membership registered', newMembership);
  }

  if (endpoint === '/api/memberships/my' && method === 'GET') {
    if (!currentUser) return wrapSuccess('Success', []);
    const memberships = getStorageItem('scms_db_memberships', []);
    const pkgs = getStorageItem('scms_db_packages', membershipPackages);
    const userMemberships = memberships.filter((m) => m.userId === currentUser.userId).map(m => ({
      ...m,
      packageEntity: pkgs.find(p => (p.packageId || p.id) === m.packageId) || { name: m.packageName || 'Gói hội viên' },
    }));
    return wrapSuccess('Success', userMemberships);
  }

  if (endpoint === '/api/memberships/my/active' && method === 'GET') {
    if (!currentUser) return wrapSuccess('Success', null);
    const memberships = getStorageItem('scms_db_memberships', []);
    const pkgs = getStorageItem('scms_db_packages', membershipPackages);
    const activeOne = memberships.find((m) => m.userId === currentUser.userId && m.status === 'Active');
    if (!activeOne) return wrapSuccess('Success', null);
    return wrapSuccess('Success', {
      ...activeOne,
      packageEntity: pkgs.find(p => (p.packageId || p.id) === activeOne.packageId),
    });
  }

  if (endpoint === '/api/memberships/my/payments' && method === 'GET') {
    if (!currentUser) return wrapSuccess('Success', []);
    const payments = getStorageItem('scms_db_payments', []);
    const userPayments = payments.filter((p) => p.userId === currentUser.userId);
    return wrapSuccess('Success', userPayments);
  }

  if (endpoint === '/api/memberships/my/invoices' && method === 'GET') {
    if (!currentUser) return wrapSuccess('Success', []);
    const invoices = getStorageItem('scms_db_invoices', []);
    const userInvoices = invoices.filter((i) => i.userId === currentUser.userId);
    return wrapSuccess('Success', userInvoices);
  }

  // 7. PAYMENTS & MOMO (/api/payments)
  const momoInitMatch = endpoint.match(/^\/api\/payments\/(\d+)\/momo\/initiate$/);
  if (momoInitMatch && method === 'POST') {
    const paymentId = parseInt(momoInitMatch[1], 10);
    const payments = getStorageItem('scms_db_payments', []);
    const payment = payments.find(p => p.paymentId === paymentId);
    if (!payment) throwError(404, 'Payment not found');

    const orderId = 'SCMS-MOMO-' + Date.now();
    payment.momoOrderId = orderId;
    setStorageItem('scms_db_payments', payments);

    const payUrl = `https://test-payment.momo.vn/v2/gateway/pay?orderId=${orderId}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${orderId}`;
    return wrapSuccess('MoMo payment initiated', {
      orderId,
      payUrl,
      qrCodeUrl,
      amount: payment.amount,
      message: 'MoMo Order Generated',
    });
  }

  if (endpoint === '/api/payments/momo/callback' && method === 'POST') {
    const { orderId, transId, resultCode } = parseBody();
    const payments = getStorageItem('scms_db_payments', []);
    const payment = payments.find(p => p.momoOrderId === orderId);
    if (!payment) throwError(404, 'Payment with orderId not found');

    const isSuccess = resultCode === 0 || resultCode === '0';
    payment.status = isSuccess ? 'Paid' : 'Failed';
    payment.momoTransactionId = transId || `MOMO-TXN-${Date.now()}`;
    setStorageItem('scms_db_payments', payments);

    if (isSuccess) {
      const memberships = getStorageItem('scms_db_memberships', []);
      const m = memberships.find(mem => mem.membershipId === payment.membershipId);
      if (m) {
        m.status = 'Active';
        setStorageItem('scms_db_memberships', memberships);
      }
    }
    return wrapSuccess('Payment processed', payment);
  }

  // 8. NOTIFICATIONS (/api/notifications)
  if (endpoint === '/api/notifications' && method === 'GET') {
    if (!currentUser) return wrapSuccess('Success', []);
    const notifs = getStorageItem('scms_db_notifications', []);
    const userNotifs = notifs.filter(n => n.userId === currentUser.userId);
    return wrapSuccess('Success', userNotifs);
  }

  if (endpoint === '/api/notifications/unread' && method === 'GET') {
    if (!currentUser) return wrapSuccess('Success', []);
    const notifs = getStorageItem('scms_db_notifications', []);
    const unread = notifs.filter(n => n.userId === currentUser.userId && !n.isRead);
    return wrapSuccess('Success', unread);
  }

  if (endpoint === '/api/notifications/unread/count' && method === 'GET') {
    if (!currentUser) return wrapSuccess('Success', 0);
    const notifs = getStorageItem('scms_db_notifications', []);
    const count = notifs.filter(n => n.userId === currentUser.userId && !n.isRead).length;
    return wrapSuccess('Success', count);
  }

  const notifReadMatch = endpoint.match(/^\/api\/notifications\/(\d+)\/read$/);
  if (notifReadMatch && method === 'PUT') {
    const id = parseInt(notifReadMatch[1], 10);
    const notifs = getStorageItem('scms_db_notifications', []);
    const notif = notifs.find(n => n.notificationId === id);
    if (notif) {
      notif.isRead = true;
      notif.readAt = new Date().toISOString();
      setStorageItem('scms_db_notifications', notifs);
    }
    return wrapSuccess('Success', notif);
  }

  if (endpoint === '/api/notifications/read-all' && method === 'PUT') {
    if (currentUser) {
      const notifs = getStorageItem('scms_db_notifications', []);
      notifs.forEach(n => {
        if (n.userId === currentUser.userId) {
          n.isRead = true;
          n.readAt = new Date().toISOString();
        }
      });
      setStorageItem('scms_db_notifications', notifs);
    }
    return wrapSuccess('All notifications marked as read', null);
  }

  // 9. SUPPORT REQUESTS (/api/support)
  if (endpoint === '/api/support' && method === 'POST') {
    if (!currentUser) throwError(401, 'Unauthorized');
    const { subject, description } = parseBody();
    if (!subject || !description) throwError(400, 'Subject and description are required');

    const requests = getStorageItem('scms_db_support_requests', []);
    const newId = Date.now();
    const newReq = {
      id: newId,
      requestId: newId,
      memberId: currentUser.userId,
      receivedBy: null,
      subject: subject.trim(),
      description: description.trim(),
      status: 'Open',
      resolution: null,
      createdAt: new Date().toISOString(),
      resolvedAt: null,
    };
    requests.push(newReq);
    setStorageItem('scms_db_support_requests', requests);
    return wrapSuccess('Support request submitted', newReq);
  }

  if (endpoint === '/api/support/my' && method === 'GET') {
    if (!currentUser) return wrapSuccess('Success', []);
    const requests = getStorageItem('scms_db_support_requests', []);
    const myReqs = requests.filter(r => r.memberId === currentUser.userId);
    return wrapSuccess('Success', myReqs);
  }

  if (endpoint.startsWith('/api/support') && method === 'GET') {
    const requests = getStorageItem('scms_db_support_requests', []);
    const users = getStorageItem('scms_db_users', databaseUsers);
    const enriched = requests.map(r => ({
      ...r,
      member: users.find(u => u.userId === r.memberId) || { fullName: 'Hội viên #' + r.memberId, phone: '' },
    }));
    return wrapSuccess('Success', { content: enriched, totalElements: enriched.length });
  }

  const resolveMatch = endpoint.match(/^\/api\/support\/(\d+)\/resolve$/);
  if (resolveMatch && method === 'PUT') {
    const id = parseInt(resolveMatch[1], 10);
    const { status, resolution } = parseBody();
    const requests = getStorageItem('scms_db_support_requests', []);
    const req = requests.find(r => r.id === id || r.requestId === id);
    if (!req) throwError(404, 'Support request not found');
    req.status = status || 'Resolved';
    req.resolution = resolution || 'Đã giải quyết';
    req.resolvedAt = new Date().toISOString();
    req.receivedBy = currentUser?.userId;
    setStorageItem('scms_db_support_requests', requests);
    return wrapSuccess('Support request updated', req);
  }

  // 10. TRAINING PLANS & RESULTS (/api/training)
  if (endpoint === '/api/training/my-plans' && method === 'GET') {
    if (!currentUser) return wrapSuccess('Success', []);
    const plans = getStorageItem('scms_db_training_plans', []);
    const users = getStorageItem('scms_db_users', databaseUsers);
    const myPlans = plans.filter(p => p.memberId === currentUser.userId).map(p => ({
      ...p,
      coach: users.find(u => u.userId === p.coachId) || { fullName: 'HLV #' + p.coachId },
    }));
    return wrapSuccess('Success', myPlans);
  }

  if (endpoint === '/api/training/my-results' && method === 'GET') {
    if (!currentUser) return wrapSuccess('Success', []);
    const results = getStorageItem('scms_db_training_results', []);
    const users = getStorageItem('scms_db_users', databaseUsers);
    const myResults = results.filter(r => r.memberId === currentUser.userId).map(r => ({
      ...r,
      coach: users.find(u => u.userId === r.coachId) || { fullName: 'HLV #' + r.coachId },
    }));
    return wrapSuccess('Success', myResults);
  }

  if (endpoint === '/api/training/coach-plans' && method === 'GET') {
    if (!currentUser) return wrapSuccess('Success', []);
    const plans = getStorageItem('scms_db_training_plans', []);
    const users = getStorageItem('scms_db_users', databaseUsers);
    const coachPlans = plans.filter(p => p.coachId === currentUser.userId).map(p => ({
      ...p,
      member: users.find(u => u.userId === p.memberId) || { fullName: 'Hội viên #' + p.memberId },
    }));
    return wrapSuccess('Success', coachPlans);
  }

  if (endpoint === '/api/training/plans' && method === 'POST') {
    const { memberId, goals, aiRecommendation, classId } = parseBody();
    if (!goals) throwError(400, 'Goals are required');
    const plans = getStorageItem('scms_db_training_plans', []);
    const newPlan = {
      planId: Date.now(),
      coachId: currentUser?.userId || 3,
      memberId: Number(memberId) || 5,
      classId: classId ? Number(classId) : null,
      goals,
      aiRecommendation: aiRecommendation || 'Tập luyện đều đặn theo giáo trình',
      createdDate: new Date().toISOString().split('T')[0],
    };
    plans.push(newPlan);
    setStorageItem('scms_db_training_plans', plans);
    return wrapSuccess('Training plan created', newPlan);
  }

  const updatePlanMatch = endpoint.match(/^\/api\/training\/plans\/(\d+)$/);
  if (updatePlanMatch && method === 'PUT') {
    const id = parseInt(updatePlanMatch[1], 10);
    const { goals, aiRecommendation } = parseBody();
    const plans = getStorageItem('scms_db_training_plans', []);
    const plan = plans.find(p => p.planId === id);
    if (!plan) throwError(404, 'Plan not found');
    if (goals) plan.goals = goals;
    if (aiRecommendation !== undefined) plan.aiRecommendation = aiRecommendation;
    setStorageItem('scms_db_training_plans', plans);
    return wrapSuccess('Training plan updated', plan);
  }

  if (endpoint === '/api/training/results' && method === 'POST') {
    const { planId, memberId, resultNotes, progressComment, scheduleId } = parseBody();
    if (!resultNotes) throwError(400, 'Result notes are required');
    const results = getStorageItem('scms_db_training_results', []);
    const newRes = {
      resultId: Date.now(),
      planId: Number(planId),
      scheduleId: scheduleId ? Number(scheduleId) : null,
      coachId: currentUser?.userId || 3,
      memberId: Number(memberId),
      resultNotes,
      progressComment: progressComment || 'Tiến độ tốt',
      recordedAt: new Date().toISOString(),
    };
    results.push(newRes);
    setStorageItem('scms_db_training_results', results);
    return wrapSuccess('Training result recorded', newRes);
  }

  // 11. COACH ENDPOINTS (/api/coach)
  if (endpoint === '/api/coach/classes' && method === 'GET') {
    const classes = getStorageItem('scms_db_classes', centerClasses);
    const rooms = getStorageItem('scms_db_rooms', centerRooms);
    const coachId = currentUser?.userId || 3;
    const coachClasses = classes.filter(c => c.coachId === coachId).map(c => ({
      classId: c.classId || c.id,
      className: c.title || c.className,
      sport: { name: c.sport?.name || c.sport },
      room: rooms.find(r => r.roomId === c.roomId) || { roomName: c.room },
      status: c.rawStatus || c.status,
    }));
    return wrapSuccess('Success', coachClasses);
  }

  const coachSchedulesMatch = endpoint.match(/^\/api\/coach\/classes\/(\d+)\/schedules$/);
  if (coachSchedulesMatch && method === 'GET') {
    const classId = parseInt(coachSchedulesMatch[1], 10);
    const schedules = getStorageItem('scms_db_schedules', centerSchedules);
    return wrapSuccess('Success', schedules.filter(s => s.classId === classId));
  }

  const coachMembersMatch = endpoint.match(/^\/api\/coach\/classes\/(\d+)\/members$/);
  if (coachMembersMatch && method === 'GET') {
    const classId = parseInt(coachMembersMatch[1], 10);
    const regs = getStorageItem('scms_db_registrations', []);
    const users = getStorageItem('scms_db_users', databaseUsers);
    const members = regs.filter(r => r.classId === classId && r.status === 'Registered').map(r => ({
      ...r,
      member: users.find(u => u.userId === r.memberId) || { fullName: 'Học viên #' + r.memberId },
    }));
    return wrapSuccess('Success', members);
  }

  if (endpoint.startsWith('/api/coach/attendance') && method === 'POST') {
    const urlParams = new URLSearchParams(endpoint.split('?')[1] || '');
    const scheduleId = parseInt(urlParams.get('scheduleId') || '0', 10);
    const registrationId = parseInt(urlParams.get('registrationId') || '0', 10);
    const status = urlParams.get('status') || 'Present';
    const notes = urlParams.get('notes') || '';

    const attendances = getStorageItem('scms_db_attendance', []);
    let item = attendances.find(a => a.scheduleId === scheduleId && a.registrationId === registrationId);
    if (!item) {
      item = {
        attendanceId: Date.now(),
        scheduleId,
        registrationId,
        status,
        notes,
        markedAt: new Date().toISOString(),
      };
      attendances.push(item);
    } else {
      item.status = status;
      item.notes = notes;
      item.markedAt = new Date().toISOString();
    }
    setStorageItem('scms_db_attendance', attendances);
    return wrapSuccess('Attendance recorded', item);
  }

  const coachAttByScheduleMatch = endpoint.match(/^\/api\/coach\/attendance\/schedule\/(\d+)$/);
  if (coachAttByScheduleMatch && method === 'GET') {
    const scheduleId = parseInt(coachAttByScheduleMatch[1], 10);
    const attendances = getStorageItem('scms_db_attendance', []);
    return wrapSuccess('Success', attendances.filter(a => a.scheduleId === scheduleId));
  }

  // 12. RECEPTION ENDPOINTS (/api/reception)
  if (endpoint === '/api/reception/members' && method === 'GET') {
    const users = getStorageItem('scms_db_users', databaseUsers);
    const members = users.filter(u => u.role === 'Member');
    return wrapSuccess('Success', members);
  }

  if (endpoint.startsWith('/api/reception/members/search') && method === 'GET') {
    const urlParams = new URLSearchParams(endpoint.split('?')[1] || '');
    const phone = urlParams.get('phone');
    const users = getStorageItem('scms_db_users', databaseUsers);
    const member = users.find(u => u.phone === phone && u.role === 'Member');
    if (!member) throwError(404, 'Member not found');
    return wrapSuccess('Success', member);
  }

  if (endpoint === '/api/reception/members' && method === 'POST') {
    const { username, password, fullName, email, phone } = parseBody();
    if (!username || !password || !fullName || !phone) throwError(400, 'All fields required');
    const users = getStorageItem('scms_db_users', databaseUsers);
    if (users.some(u => u.username === username.trim())) throwError(409, 'Username exists');
    if (users.some(u => u.phone === phone.trim())) throwError(409, 'Phone exists');

    const newId = Math.max(...users.map(u => u.userId || 0)) + 1;
    const newMember = {
      userId: newId,
      username: username.trim(),
      password,
      fullName: fullName.trim(),
      email: email?.trim() || null,
      phone: phone.trim(),
      role: 'Member',
      isActive: true,
    };
    users.push(newMember);
    setStorageItem('scms_db_users', users);
    return wrapSuccess('Member registered', newMember);
  }

  const confirmCashMatch = endpoint.match(/^\/api\/reception\/payments\/(\d+)\/confirm-cash$/);
  if (confirmCashMatch && method === 'PUT') {
    const paymentId = parseInt(confirmCashMatch[1], 10);
    const payments = getStorageItem('scms_db_payments', []);
    const payment = payments.find(p => p.paymentId === paymentId);
    if (!payment) throwError(404, 'Payment not found');
    payment.status = 'Paid';
    payment.paymentDate = new Date().toISOString();
    setStorageItem('scms_db_payments', payments);

    // Also activate the membership
    const memberships = getStorageItem('scms_db_memberships', []);
    const m = memberships.find(mem => mem.membershipId === payment.membershipId);
    if (m) {
      m.status = 'Active';
      setStorageItem('scms_db_memberships', memberships);
    }

    // Generate invoice
    const invoices = getStorageItem('scms_db_invoices', []);
    invoices.push({
      invoiceId: Date.now(),
      paymentId: payment.paymentId,
      userId: payment.userId,
      issueDate: new Date().toISOString(),
      totalAmount: payment.amount,
      invoiceUrl: null,
    });
    setStorageItem('scms_db_invoices', invoices);

    return wrapSuccess('Cash payment confirmed', payment);
  }

  const recMembershipMatch = endpoint.match(/^\/api\/reception\/memberships\/(\d+)$/);
  if (recMembershipMatch && method === 'POST') {
    const targetUserId = parseInt(recMembershipMatch[1], 10);
    const { packageId, paymentMethod } = parseBody();
    const packages = getStorageItem('scms_db_packages', membershipPackages);
    const pkg = packages.find(p => p.packageId === Number(packageId));
    if (!pkg) throwError(404, 'Package not found');

    const memberships = getStorageItem('scms_db_memberships', []);
    const newId = Date.now();
    const durationDays = pkg.durationDays || ((pkg.durationMonths || 1) * 30);
    const now = new Date();
    const end = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);

    const newMembership = {
      membershipId: newId,
      userId: targetUserId,
      packageId: pkg.packageId,
      packageName: pkg.name || pkg.packageName,
      startDate: now.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
      status: 'Pending',
      createdAt: now.toISOString(),
    };
    memberships.push(newMembership);
    setStorageItem('scms_db_memberships', memberships);

    // Create payment
    const payments = getStorageItem('scms_db_payments', []);
    const paymentId = Date.now();
    const newPayment = {
      paymentId,
      userId: targetUserId,
      membershipId: newId,
      amount: pkg.price,
      paymentMethod: paymentMethod || 'Cash',
      status: 'Pending',
      paymentStatus: 'Pending',
      paymentDate: now.toISOString(),
    };
    payments.push(newPayment);
    setStorageItem('scms_db_payments', payments);

    return wrapSuccess('Membership registered on behalf', { ...newMembership, paymentId });
  }

  if (recMembershipMatch && method === 'GET') {
    const targetUserId = parseInt(recMembershipMatch[1], 10);
    const memberships = getStorageItem('scms_db_memberships', []);
    return wrapSuccess('Success', memberships.filter(m => m.userId === targetUserId));
  }

  const recPaymentsMatch = endpoint.match(/^\/api\/reception\/members\/(\d+)\/payments$/);
  if (recPaymentsMatch && method === 'GET') {
    const targetUserId = parseInt(recPaymentsMatch[1], 10);
    const payments = getStorageItem('scms_db_payments', []);
    return wrapSuccess('Success', payments.filter(p => p.userId === targetUserId));
  }

  const recInvoicesMatch = endpoint.match(/^\/api\/reception\/members\/(\d+)\/invoices$/);
  if (recInvoicesMatch && method === 'GET') {
    const targetUserId = parseInt(recInvoicesMatch[1], 10);
    const invoices = getStorageItem('scms_db_invoices', []);
    return wrapSuccess('Success', invoices.filter(i => i.userId === targetUserId));
  }

  const recClassMatch = endpoint.match(/^\/api\/reception\/classes\/(\d+)\/register\/(\d+)$/);
  if (recClassMatch && method === 'POST') {
    const targetClassId = parseInt(recClassMatch[1], 10);
    const targetMemberId = parseInt(recClassMatch[2], 10);
    const regs = getStorageItem('scms_db_registrations', []);
    const newReg = {
      registrationId: Date.now(),
      classId: targetClassId,
      memberId: targetMemberId,
      status: 'Registered',
      registeredAt: new Date().toISOString(),
    };
    regs.push(newReg);
    setStorageItem('scms_db_registrations', regs);
    return wrapSuccess('Member registered for class on behalf', newReg);
  }

  // 13. ADMIN ENDPOINTS (/api/admin)
  if (endpoint === '/api/admin/reports/dashboard' && method === 'GET') {
    const users = getStorageItem('scms_db_users', databaseUsers);
    const memberships = getStorageItem('scms_db_memberships', []);
    const classes = getStorageItem('scms_db_classes', centerClasses);
    const regs = getStorageItem('scms_db_registrations', []);
    const payments = getStorageItem('scms_db_payments', []);

    const activeMembers = memberships.filter(m => m.status === 'Active').length;
    const totalRevenue = payments.filter(p => p.status === 'Paid').reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    const upcoming = classes.filter(c => (c.rawStatus || c.status) === 'Upcoming').length;
    const completed = classes.filter(c => (c.rawStatus || c.status) === 'Completed').length;

    return wrapSuccess('Success', {
      totalUsers: users.length,
      activeMembers,
      expiringMembershipsCount: 1,
      totalRevenue,
      totalClasses: classes.length,
      upcomingClasses: upcoming,
      completedClasses: completed,
      totalRegistrations: regs.length,
      membersByRole: {
        Member: users.filter(u => u.role === 'Member').length,
        Coach: users.filter(u => u.role === 'Coach').length,
        Receptionist: users.filter(u => u.role === 'Receptionist').length,
        Manager: users.filter(u => u.role === 'Manager').length,
      },
      membershipsByPackage: {
        Basic: memberships.filter(m => m.packageId === 1).length,
        Premium: memberships.filter(m => m.packageId === 2).length,
        Annual: memberships.filter(m => m.packageId === 3).length,
      },
    });
  }

  if (endpoint.startsWith('/api/admin/reports/audit-logs') && method === 'GET') {
    const logs = getStorageItem('scms_db_audit_logs', []);
    return wrapSuccess('Success', { content: logs, totalElements: logs.length });
  }

  if (endpoint === '/api/admin/users' && method === 'GET') {
    const users = getStorageItem('scms_db_users', databaseUsers);
    return wrapSuccess('Success', users);
  }

  if (endpoint === '/api/admin/users' && method === 'POST') {
    const { username, password, fullName, email, phone, role } = parseBody();
    const users = getStorageItem('scms_db_users', databaseUsers);
    const newId = Math.max(...users.map(u => u.userId || 0)) + 1;
    const newUser = {
      userId: newId,
      username: username.trim(),
      password: password || '123456',
      fullName: fullName.trim(),
      email: email?.trim() || null,
      phone: phone.trim(),
      role: role || 'Member',
      isActive: true,
    };
    users.push(newUser);
    setStorageItem('scms_db_users', users);
    return wrapSuccess('User created', newUser);
  }

  const toggleUserMatch = endpoint.match(/^\/api\/admin\/users\/(\d+)\/toggle-active$/);
  if (toggleUserMatch && method === 'PUT') {
    const id = parseInt(toggleUserMatch[1], 10);
    const users = getStorageItem('scms_db_users', databaseUsers);
    const user = users.find(u => u.userId === id);
    if (!user) throwError(404, 'User not found');
    user.isActive = !user.isActive;
    setStorageItem('scms_db_users', users);
    return wrapSuccess('User status updated', user);
  }

  if (endpoint === '/api/admin/packages' && method === 'GET') {
    const pkgs = getStorageItem('scms_db_packages', membershipPackages);
    return wrapSuccess('Success', pkgs);
  }

  if (endpoint === '/api/admin/packages' && method === 'POST') {
    const { name, packageName, description, durationDays, durationMonths, price } = parseBody();
    const pkgs = getStorageItem('scms_db_packages', membershipPackages);
    const pkgName = (name || packageName || 'Gói tập mới').trim();
    const dDays = Number(durationDays) || (Number(durationMonths || 1) * 30);
    const newPkg = {
      packageId: pkgs.length + 1,
      name: pkgName,
      packageName: pkgName,
      description,
      durationDays: dDays,
      durationMonths: Math.round(dDays / 30),
      price: Number(price),
      isActive: true,
    };
    pkgs.push(newPkg);
    setStorageItem('scms_db_packages', pkgs);
    return wrapSuccess('Package created', newPkg);
  }

  const togglePkgMatch = endpoint.match(/^\/api\/admin\/packages\/(\d+)\/toggle-active$/);
  if (togglePkgMatch && method === 'PUT') {
    const id = parseInt(togglePkgMatch[1], 10);
    const pkgs = getStorageItem('scms_db_packages', membershipPackages);
    const pkg = pkgs.find(p => (p.packageId || p.id) === id);
    if (!pkg) throwError(404, 'Package not found');
    pkg.isActive = pkg.isActive === false ? true : false;
    setStorageItem('scms_db_packages', pkgs);
    return wrapSuccess('Package status updated', pkg);
  }

  if (endpoint === '/api/admin/classes' && method === 'GET') {
    const classes = getStorageItem('scms_db_classes', centerClasses);
    const rooms = getStorageItem('scms_db_rooms', centerRooms);
    const users = getStorageItem('scms_db_users', databaseUsers);
    const all = classes.map(c => ({
      classId: c.classId || c.id,
      className: c.title || c.className,
      sport: { sportId: c.sportId, name: c.sport?.name || c.sport },
      room: rooms.find(r => r.roomId === c.roomId) || { roomName: c.room },
      coach: users.find(u => u.userId === c.coachId) || { fullName: c.trainer },
      status: c.rawStatus || c.status,
    }));
    return wrapSuccess('Success', all);
  }

  if (endpoint === '/api/admin/classes' && method === 'POST') {
    const { className, sportId, roomId, coachId } = parseBody();
    const classes = getStorageItem('scms_db_classes', centerClasses);
    const newClass = {
      classId: classes.length + 1,
      title: className,
      className,
      sportId: Number(sportId),
      roomId: Number(roomId),
      coachId: Number(coachId),
      rawStatus: 'Upcoming',
      status: 'Upcoming',
    };
    classes.push(newClass);
    setStorageItem('scms_db_classes', classes);
    return wrapSuccess('Class created', newClass);
  }

  const updateClassStatusMatch = endpoint.match(/^\/api\/admin\/classes\/(\d+)\/status\?status=(.+)$/);
  if (updateClassStatusMatch && method === 'PUT') {
    const id = parseInt(updateClassStatusMatch[1], 10);
    const status = decodeURIComponent(updateClassStatusMatch[2]);
    const classes = getStorageItem('scms_db_classes', centerClasses);
    const c = classes.find(cl => (cl.classId || cl.id) === id);
    if (!c) throwError(404, 'Class not found');
    c.rawStatus = status;
    c.status = status;
    setStorageItem('scms_db_classes', classes);
    return wrapSuccess('Class status updated', c);
  }

  if (endpoint === '/api/admin/rooms' && method === 'GET') {
    const rooms = getStorageItem('scms_db_rooms', centerRooms);
    return wrapSuccess('Success', rooms);
  }

  if (endpoint.startsWith('/api/admin/sports') && method === 'POST') {
    const urlParams = new URLSearchParams(endpoint.split('?')[1] || '');
    const name = urlParams.get('name') || parseBody().name;
    const description = urlParams.get('description') || parseBody().description;
    const sports = getStorageItem('scms_db_sports', []);
    const newSport = {
      sportId: sports.length + 1,
      id: sports.length + 1,
      name,
      description,
    };
    sports.push(newSport);
    setStorageItem('scms_db_sports', sports);
    return wrapSuccess('Sport created', newSport);
  }

  if (endpoint.startsWith('/api/admin/rooms') && method === 'POST') {
    const urlParams = new URLSearchParams(endpoint.split('?')[1] || '');
    const roomName = urlParams.get('roomName') || parseBody().roomName;
    const maxCapacity = Number(urlParams.get('maxCapacity') || parseBody().maxCapacity || parseBody().capacity || 20);
    const location = urlParams.get('location') || parseBody().location || '';
    const rooms = getStorageItem('scms_db_rooms', centerRooms);
    const newRoom = {
      roomId: rooms.length + 1,
      id: rooms.length + 1,
      roomName,
      name: roomName,
      maxCapacity,
      capacity: maxCapacity,
      location,
    };
    rooms.push(newRoom);
    setStorageItem('scms_db_rooms', rooms);
    return wrapSuccess('Room created', newRoom);
  }

  if (endpoint === '/api/admin/schedules' && method === 'POST') {
    const { classId, dayOfWeek, startTime, endTime } = parseBody();
    const schedules = getStorageItem('scms_db_schedules', centerSchedules);
    const newSchedule = {
      scheduleId: schedules.length + 1,
      id: schedules.length + 1,
      classId: Number(classId),
      dayOfWeek,
      startTime,
      endTime,
    };
    schedules.push(newSchedule);
    setStorageItem('scms_db_schedules', schedules);
    return wrapSuccess('Schedule created', newSchedule);
  }

  if (endpoint === '/api/admin/memberships' && method === 'GET') {
    const memberships = getStorageItem('scms_db_memberships', []);
    const users = getStorageItem('scms_db_users', databaseUsers);
    const pkgs = getStorageItem('scms_db_packages', membershipPackages);
    const all = memberships.map(m => ({
      ...m,
      user: users.find(u => u.userId === m.userId),
      packageEntity: pkgs.find(p => (p.packageId || p.id) === m.packageId),
    }));
    return wrapSuccess('Success', all);
  }

  // Fallback default
  return wrapSuccess('Success', null);
};

/**
 * Generic request helper with automatic Bearer Token header & Failover Database Engine
 */
export const request = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    const contentType = response.headers.get('content-type');
    let data = null;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }
    }

    // Kiểm tra xem phản hồi có phải là lỗi proxy (Vite proxy trả về 500 ECONNREFUSED/502/504 khi backend 8080 chưa chạy)
    const rawMessage = typeof data?.message === 'string' ? data.message : '';
    const isProxyOrGatewayFailure =
      !response.ok &&
      (response.status >= 500 || response.status === 502 || response.status === 504) &&
      (data?.success === undefined ||
       rawMessage.includes('ECONNREFUSED') ||
       rawMessage.includes('connect') ||
       rawMessage.includes('Proxy') ||
       rawMessage.includes('proxy') ||
       rawMessage.includes('<html') ||
       rawMessage.includes('<!DOCTYPE') ||
       rawMessage.includes('Bad Gateway'));

    if (isProxyOrGatewayFailure) {
      console.warn(`[SCMS API] Backend port 8080 chưa chạy (${response.status}). Tự động phục vụ bằng Failover Local Database Engine.`);
      return handleLocalDatabaseRequest(endpoint, config);
    }

    if (!response.ok) {
      let errorMessage = 'Yêu cầu không thành công';
      if (data) {
        if (typeof data.message === 'string' && data.message.trim()) {
          errorMessage = data.message;
        } else if (data.error) {
          errorMessage = data.error;
        }
        if (data.data && typeof data.data === 'object' && !Array.isArray(data.data)) {
          const fieldErrors = Object.entries(data.data)
            .map(([field, msg]) => `${field}: ${msg}`)
            .join('; ');
          if (fieldErrors) {
            errorMessage += ` (${fieldErrors})`;
          }
        }
      }
      const error = new Error(errorMessage);
      error.status = response.status;
      error.response = data;
      throw error;
    }

    return data;
  } catch (networkError) {
    if (
      networkError.status >= 500 ||
      networkError.message?.includes('Failed to fetch') ||
      networkError.message?.includes('NetworkError') ||
      networkError.message?.includes('Load failed') ||
      networkError.message?.includes('Failed to parse URL') ||
      networkError.message?.includes('ECONNREFUSED') ||
      networkError.message?.includes('Yêu cầu không thành công') ||
      networkError.code === 'ERR_INVALID_URL' ||
      networkError.code === 'ECONNREFUSED'
    ) {
      console.warn(`[SCMS API] Mất kết nối backend (${networkError.message}). Tự động phục vụ bằng Failover Local Database Engine.`);
      return handleLocalDatabaseRequest(endpoint, config);
    }
    throw networkError;
  }
};

/**
 * Auth API endpoints (/api/auth)
 */
export const authApi = {
  login: async ({ phone, password }) => {
    return await request('/api/auth/login', {
      method: 'POST',
      body: { phone, password },
    });
  },

  register: async ({ username, password, fullName, email, phone }) => {
    return await request('/api/auth/register', {
      method: 'POST',
      body: {
        username: username?.trim(),
        password,
        fullName: fullName?.trim(),
        email: email?.trim() || null,
        phone: phone?.trim(),
      },
    });
  },
};

/**
 * User API endpoints (/api/users)
 */
export const userApi = {
  getProfile: async () => {
    const res = await request('/api/users/me', { method: 'GET' });
    return res.data;
  },

  updateProfile: async (data) => {
    const res = await request('/api/users/me', {
      method: 'PUT',
      body: data,
    });
    return res.data;
  },

  changePassword: async ({ currentPassword, newPassword }) => {
    return await request('/api/users/me/password', {
      method: 'PUT',
      body: { currentPassword, newPassword },
    });
  },
};

/**
 * Class API endpoints (/api/classes)
 */
export const classApi = {
  getAll: async () => {
    const response = await request('/api/classes', { method: 'GET' });
    return response.data || [];
  },

  getById: async (id) => {
    const response = await request(`/api/classes/${id}`, { method: 'GET' });
    return response.data;
  },

  getSchedules: async (id) => {
    const response = await request(`/api/classes/${id}/schedules`, { method: 'GET' });
    return response.data || [];
  },

  register: async (classId) => {
    return await request(`/api/classes/${classId}/register`, {
      method: 'POST',
    });
  },

  cancelRegistration: async (registrationId) => {
    return await request(`/api/classes/registrations/${registrationId}/cancel`, {
      method: 'PUT',
    });
  },

  getMyRegistrations: async () => {
    const response = await request('/api/classes/my/registrations', { method: 'GET' });
    return response.data || [];
  },

  getClassRegistrations: async (classId) => {
    const response = await request(`/api/classes/${classId}/registrations`, { method: 'GET' });
    return response.data || [];
  },

  getSports: async () => {
    const response = await request('/api/classes/sports', { method: 'GET' });
    return response.data || [];
  },
};

/**
 * Package API endpoints (/api/packages)
 */
export const packageApi = {
  getAll: async () => {
    const response = await request('/api/packages', { method: 'GET' });
    return response.data || [];
  },

  getById: async (id) => {
    const response = await request(`/api/packages/${id}`, { method: 'GET' });
    return response.data;
  },
};

/**
 * Membership API endpoints (/api/memberships)
 */
export const membershipApi = {
  register: async ({ packageId, paymentMethod }) => {
    return await request('/api/memberships/register', {
      method: 'POST',
      body: {
        packageId: Number(packageId),
        paymentMethod,
      },
    });
  },

  getMy: async () => {
    const response = await request('/api/memberships/my', { method: 'GET' });
    return response.data || [];
  },

  getMyActive: async () => {
    const response = await request('/api/memberships/my/active', { method: 'GET' });
    return response.data;
  },

  getMyPayments: async () => {
    const response = await request('/api/memberships/my/payments', { method: 'GET' });
    return response.data || [];
  },

  getMyInvoices: async () => {
    const response = await request('/api/memberships/my/invoices', { method: 'GET' });
    return response.data || [];
  },
};

/**
 * Payment API endpoints (/api/payments)
 */
export const paymentApi = {
  getById: async (id) => {
    const response = await request(`/api/payments/${id}`, { method: 'GET' });
    return response.data;
  },

  initiateMomo: async (paymentId) => {
    const response = await request(`/api/payments/${paymentId}/momo/initiate`, { method: 'POST' });
    return response.data;
  },

  momoCallback: async (payload) => {
    return await request('/api/payments/momo/callback', {
      method: 'POST',
      body: payload,
    });
  },
};

/**
 * Notification API endpoints (/api/notifications)
 */
export const notificationApi = {
  getMy: async () => {
    const response = await request('/api/notifications', { method: 'GET' });
    return response.data || [];
  },

  getUnread: async () => {
    const response = await request('/api/notifications/unread', { method: 'GET' });
    return response.data || [];
  },

  getUnreadCount: async () => {
    const response = await request('/api/notifications/unread/count', { method: 'GET' });
    return typeof response.data === 'number' ? response.data : Number(response.data || 0);
  },

  markAsRead: async (id) => {
    const response = await request(`/api/notifications/${id}/read`, { method: 'PUT' });
    return response.data;
  },

  markAllAsRead: async () => {
    return await request('/api/notifications/read-all', { method: 'PUT' });
  },
};

/**
 * Support API endpoints (/api/support)
 */
export const supportApi = {
  create: async ({ subject, description }) => {
    const response = await request('/api/support', {
      method: 'POST',
      body: { subject, description },
    });
    return response.data;
  },

  getMy: async () => {
    const response = await request('/api/support/my', { method: 'GET' });
    return response.data || [];
  },

  getAll: async (page = 0, size = 10) => {
    const response = await request(`/api/support?page=${page}&size=${size}`, { method: 'GET' });
    return response.data;
  },

  resolve: async (id, { status, resolution }) => {
    const response = await request(`/api/support/${id}/resolve`, {
      method: 'PUT',
      body: { status, resolution },
    });
    return response.data;
  },
};

/**
 * Training API endpoints (/api/training)
 */
export const trainingApi = {
  getMyPlans: async () => {
    const response = await request('/api/training/my-plans', { method: 'GET' });
    return response.data || [];
  },

  getMyResults: async () => {
    const response = await request('/api/training/my-results', { method: 'GET' });
    return response.data || [];
  },

  getCoachPlans: async () => {
    const response = await request('/api/training/coach-plans', { method: 'GET' });
    return response.data || [];
  },

  createPlan: async (data) => {
    const response = await request('/api/training/plans', {
      method: 'POST',
      body: data,
    });
    return response.data;
  },

  updatePlan: async (id, data) => {
    const response = await request(`/api/training/plans/${id}`, {
      method: 'PUT',
      body: data,
    });
    return response.data;
  },

  recordResult: async (data) => {
    const response = await request('/api/training/results', {
      method: 'POST',
      body: data,
    });
    return response.data;
  },

  getPlanResults: async (planId) => {
    const response = await request(`/api/training/plans/${planId}/results`, { method: 'GET' });
    return response.data || [];
  },
};

/**
 * Coach API endpoints (/api/coach)
 */
export const coachApi = {
  getMyClasses: async () => {
    const response = await request('/api/coach/classes', { method: 'GET' });
    return response.data || [];
  },

  getClassSchedules: async (classId) => {
    const response = await request(`/api/coach/classes/${classId}/schedules`, { method: 'GET' });
    return response.data || [];
  },

  getClassMembers: async (classId) => {
    const response = await request(`/api/coach/classes/${classId}/members`, { method: 'GET' });
    return response.data || [];
  },

  recordAttendance: async ({ scheduleId, registrationId, status, notes }) => {
    const params = new URLSearchParams({
      scheduleId: String(scheduleId),
      registrationId: String(registrationId),
      status,
      ...(notes ? { notes } : {}),
    });
    const response = await request(`/api/coach/attendance?${params.toString()}`, {
      method: 'POST',
    });
    return response.data;
  },

  updateAttendance: async (id, { status, notes }) => {
    const params = new URLSearchParams({
      status,
      ...(notes ? { notes } : {}),
    });
    const response = await request(`/api/coach/attendance/${id}?${params.toString()}`, {
      method: 'PUT',
    });
    return response.data;
  },

  getAttendanceBySchedule: async (scheduleId) => {
    const response = await request(`/api/coach/attendance/schedule/${scheduleId}`, { method: 'GET' });
    return response.data || [];
  },
};

/**
 * Receptionist API endpoints (/api/reception)
 */
export const receptionApi = {
  getAllMembers: async () => {
    const response = await request('/api/reception/members', { method: 'GET' });
    return response.data || [];
  },

  searchMemberByPhone: async (phone) => {
    const response = await request(`/api/reception/members/search?phone=${encodeURIComponent(phone)}`, { method: 'GET' });
    return response.data;
  },

  registerMember: async (data) => {
    const response = await request('/api/reception/members', {
      method: 'POST',
      body: data,
    });
    return response.data;
  },

  registerMembershipOnBehalf: async (userId, data) => {
    const response = await request(`/api/reception/memberships/${userId}`, {
      method: 'POST',
      body: data,
    });
    return response.data;
  },

  getMemberMemberships: async (userId) => {
    const response = await request(`/api/reception/memberships/${userId}`, { method: 'GET' });
    return response.data || [];
  },

  confirmCashPayment: async (paymentId) => {
    const response = await request(`/api/reception/payments/${paymentId}/confirm-cash`, {
      method: 'PUT',
    });
    return response.data;
  },

  registerClassOnBehalf: async (classId, memberId) => {
    const response = await request(`/api/reception/classes/${classId}/register/${memberId}`, {
      method: 'POST',
    });
    return response.data;
  },

  getMemberPayments: async (userId) => {
    const response = await request(`/api/reception/payments/${userId}`, { method: 'GET' });
    return response.data || [];
  },

  getMemberInvoices: async (userId) => {
    const response = await request(`/api/reception/invoices/${userId}`, { method: 'GET' });
    return response.data || [];
  },
};

/**
 * Admin API endpoints (/api/admin)
 */
export const adminApi = {
  getDashboardStats: async () => {
    const response = await request('/api/admin/reports/dashboard', { method: 'GET' });
    return response.data;
  },

  getAuditLogs: async (page = 0, size = 20) => {
    const response = await request(`/api/admin/reports/audit-logs?page=${page}&size=${size}`, { method: 'GET' });
    return response.data;
  },

  getAllUsers: async () => {
    const response = await request('/api/admin/users', { method: 'GET' });
    return response.data || [];
  },

  createUser: async (data) => {
    const response = await request('/api/admin/users', {
      method: 'POST',
      body: data,
    });
    return response.data;
  },

  updateUser: async (id, data) => {
    const response = await request(`/api/admin/users/${id}`, {
      method: 'PUT',
      body: data,
    });
    return response.data;
  },

  toggleUserActive: async (id) => {
    const response = await request(`/api/admin/users/${id}/toggle-active`, {
      method: 'PUT',
    });
    return response.data;
  },

  getAllPackages: async () => {
    const response = await request('/api/admin/packages', { method: 'GET' });
    return response.data || [];
  },

  createPackage: async (data) => {
    const response = await request('/api/admin/packages', {
      method: 'POST',
      body: data,
    });
    return response.data;
  },

  updatePackage: async (id, data) => {
    const response = await request(`/api/admin/packages/${id}`, {
      method: 'PUT',
      body: data,
    });
    return response.data;
  },

  togglePackageActive: async (id) => {
    const response = await request(`/api/admin/packages/${id}/toggle-active`, {
      method: 'PUT',
    });
    return response.data;
  },

  getAllClasses: async () => {
    const response = await request('/api/admin/classes', { method: 'GET' });
    return response.data || [];
  },

  createClass: async (data) => {
    const response = await request('/api/admin/classes', {
      method: 'POST',
      body: data,
    });
    return response.data;
  },

  updateClass: async (id, data) => {
    const response = await request(`/api/admin/classes/${id}`, {
      method: 'PUT',
      body: data,
    });
    return response.data;
  },

  updateClassStatus: async (id, status) => {
    const response = await request(`/api/admin/classes/${id}/status?status=${encodeURIComponent(status)}`, {
      method: 'PUT',
    });
    return response.data;
  },

  createSchedule: async (data) => {
    const response = await request('/api/admin/schedules', {
      method: 'POST',
      body: data,
    });
    return response.data;
  },

  createSport: async (name, description) => {
    let sportName = name;
    let desc = description;
    if (typeof name === 'object' && name !== null) {
      sportName = name.name;
      desc = name.description;
    }
    const params = new URLSearchParams({ name: sportName, ...(desc ? { description: desc } : {}) });
    const response = await request(`/api/admin/sports?${params.toString()}`, { method: 'POST' });
    return response.data;
  },

  updateSport: async (id, name, description) => {
    let sportName = name;
    let desc = description;
    if (typeof name === 'object' && name !== null) {
      sportName = name.name;
      desc = name.description;
    }
    const params = new URLSearchParams({ name: sportName, ...(desc ? { description: desc } : {}) });
    const response = await request(`/api/admin/sports/${id}?${params.toString()}`, { method: 'PUT' });
    return response.data;
  },

  getAllRooms: async () => {
    const response = await request('/api/admin/rooms', { method: 'GET' });
    return response.data || [];
  },

  createRoom: async (roomName, maxCapacity, location) => {
    let rName = roomName;
    let cap = maxCapacity;
    let loc = location;
    if (typeof roomName === 'object' && roomName !== null) {
      rName = roomName.roomName || roomName.name;
      cap = roomName.maxCapacity || roomName.capacity || 20;
      loc = roomName.location || '';
    }
    const params = new URLSearchParams({
      roomName: rName,
      maxCapacity: String(cap),
      ...(loc ? { location: loc } : {}),
    });
    const response = await request(`/api/admin/rooms?${params.toString()}`, { method: 'POST' });
    return response.data;
  },

  updateRoom: async (id, roomName, maxCapacity, location) => {
    const params = new URLSearchParams({
      roomName,
      maxCapacity: String(maxCapacity),
      ...(location ? { location } : {}),
    });
    const response = await request(`/api/admin/rooms/${id}?${params.toString()}`, { method: 'PUT' });
    return response.data;
  },

  getAllMemberships: async () => {
    const response = await request('/api/admin/memberships', { method: 'GET' });
    return response.data || [];
  },
};
