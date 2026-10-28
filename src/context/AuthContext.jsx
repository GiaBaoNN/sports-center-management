import React, { createContext, useContext, useState, useEffect } from 'react';

// Định nghĩa 4 vai trò chuẩn theo tài liệu SCMS (Use Case & Swimlane)
export const ROLES = {
  MEMBER: 'MEMBER',
  COACH: 'COACH',
  RECEPTIONIST: 'RECEPTIONIST',
  CENTER_MANAGER: 'CENTER_MANAGER',
};

export const ROLE_CONFIG = {
  [ROLES.MEMBER]: {
    label: 'Hội Viên',
    shortLabel: 'Hội Viên',
    color: 'primary',
    badgeColor: '#1976D2',
    dashboardPath: '/member/dashboard',
    description: 'Tra cứu thông tin gói tập, lịch cá nhân và đăng ký lớp học.',
  },
  [ROLES.COACH]: {
    label: 'Huấn Luyện Viên',
    shortLabel: 'HLV',
    color: 'secondary',
    badgeColor: '#FF6B35',
    dashboardPath: '/coach/dashboard',
    description: 'Theo dõi lịch dạy, quản lý học viên và điểm danh ca học.',
  },
  [ROLES.RECEPTIONIST]: {
    label: 'Lễ Tân',
    shortLabel: 'Lễ Tân',
    color: 'warning',
    badgeColor: '#ED6C02',
    dashboardPath: '/receptionist/dashboard',
    description: 'Tiếp đón khách, đăng ký tại quầy, thu tiền và in hóa đơn.',
  },
  [ROLES.CENTER_MANAGER]: {
    label: 'Quản Lý Trung Tâm',
    shortLabel: 'Quản Lý',
    color: 'error',
    badgeColor: '#9C27B0',
    dashboardPath: '/manager/dashboard',
    description: 'Quản trị nhân sự, lớp học, cấu hình gói tập và xem báo cáo.',
  },
};

// Tài khoản mẫu đại diện cho 4 Actor chính trong hệ thống
export const MOCK_ACCOUNTS = [
  {
    phone: '0912345678',
    password: 'password123',
    id: 'USR-MEM-8899',
    fullName: 'Nguyễn Văn A',
    email: 'member@aurasport.vn',
    role: ROLES.MEMBER,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    membership: {
      packageId: 'gold',
      packageName: 'Gói Gold (Hội Viên Chính Thức)',
      status: 'ACTIVE',
      expireDate: '2026-12-31',
      allowedSports: ['Gym', 'Bơi lội', 'Yoga', 'GroupX'],
    },
  },
  {
    phone: '0987654321',
    password: 'password123',
    id: 'USR-COACH-102',
    fullName: 'Maya Sharma',
    email: 'trainer@aurasport.vn',
    role: ROLES.COACH,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
    specialty: 'Yoga & Pilates Master',
    classesCount: 6,
  },
  {
    phone: '0934567890',
    password: 'password123',
    id: 'USR-REC-201',
    fullName: 'Trần Thị Thu Thảo',
    email: 'reception@aurasport.vn',
    role: ROLES.RECEPTIONIST,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
    desk: 'Quầy Lễ Tân Cầu Giấy - Ca Sáng',
  },
  {
    phone: '0901234567',
    password: 'password123',
    id: 'USR-MGR-001',
    fullName: 'Lê Hoàng Nam',
    email: 'manager@aurasport.vn',
    role: ROLES.CENTER_MANAGER,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    department: 'Ban Điều Hành & Quản Trị Hệ Thống AURA SPORT',
  },
];

const STORAGE_USER_KEY = 'aura_auth_user';
const STORAGE_TOKEN_KEY = 'aura_auth_token';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem(STORAGE_TOKEN_KEY) || null;
  });

  const [loading, setLoading] = useState(false);

  // Lưu trữ phiên đăng nhập vào LocalStorage
  useEffect(() => {
    if (user && token) {
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
      localStorage.setItem(STORAGE_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(STORAGE_USER_KEY);
      localStorage.removeItem(STORAGE_TOKEN_KEY);
    }
  }, [user, token]);

  /**
   * Đăng nhập với Số điện thoại & Mật khẩu
   * Kiểm tra trong danh sách tài khoản mẫu hoặc tạo phiên hội viên mới
   */
  const login = async (phone, password) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 400));

    const cleanPhone = phone.trim().replace(/\s+/g, '');

    // Tìm trong danh sách tài khoản mẫu
    let matched = MOCK_ACCOUNTS.find(
      (acc) => acc.phone === cleanPhone || acc.phone === `0${cleanPhone.replace(/^\+84/, '')}`
    );

    // Nếu không khớp tài khoản mẫu nhưng SĐT hợp lệ, mặc định coi là Hội viên
    if (!matched) {
      matched = {
        phone: cleanPhone,
        password: password,
        id: `USR-${Date.now().toString().slice(-4)}`,
        fullName: `Hội Viên ${cleanPhone.slice(-4)}`,
        email: `member.${cleanPhone}@aurasport.vn`,
        role: ROLES.MEMBER,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
        membership: {
          packageId: 'silver',
          packageName: 'Gói Silver',
          status: 'ACTIVE',
          expireDate: '2026-11-30',
          allowedSports: ['Gym'],
        },
      };
    }

    const mockJwt = `mock_token_jwt_${matched.role.toLowerCase()}_${Date.now()}`;
    setUser(matched);
    setToken(mockJwt);
    setLoading(false);

    return {
      success: true,
      user: matched,
      roleConfig: ROLE_CONFIG[matched.role],
    };
  };

  /**
   * Đăng xuất phiên làm việc
   */
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_USER_KEY);
    localStorage.removeItem(STORAGE_TOKEN_KEY);
  };

  /**
   * Chuyển đổi nhanh giữa 4 vai trò (Dành cho việc kiểm thử & demo trực tiếp)
   */
  const switchRole = (role) => {
    const target = MOCK_ACCOUNTS.find((acc) => acc.role === role) || MOCK_ACCOUNTS[0];
    const mockJwt = `mock_token_jwt_${target.role.toLowerCase()}_${Date.now()}`;
    setUser(target);
    setToken(mockJwt);
  };

  const value = {
    user,
    token,
    isAuthenticated: Boolean(user && token),
    role: user?.role || null,
    roleConfig: user?.role ? ROLE_CONFIG[user.role] : null,
    loading,
    login,
    logout,
    switchRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được sử dụng bên trong AuthProvider');
  }
  return context;
};
