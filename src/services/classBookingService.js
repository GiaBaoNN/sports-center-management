import { centerClasses } from '../data/sportsData';

const STORAGE_KEY_CLASSES = 'aura_classes_data';
const STORAGE_KEY_BOOKINGS = 'aura_user_bookings';

// Mock hội viên đăng nhập mẫu (theo chuẩn SCMS)
export const mockCurrentUser = {
  id: 'M-8899',
  fullName: 'Nguyễn Văn A',
  phone: '0912345678',
  email: 'member@aurasport.vn',
  role: 'MEMBER',
  membership: {
    packageId: 'gold',
    packageName: 'Gói Gold (Hội Viên Chính Thức)',
    tier: 'PHỔ BIẾN NHẤT',
    status: 'ACTIVE', // 'ACTIVE' | 'PENDING' | 'EXPIRED'
    startDate: '2026-01-01',
    expireDate: '2026-12-31',
    // Gói Gold hỗ trợ: Gym, Bơi lội, Yoga, GroupX (Chưa gồm Boxing/Pilates chuyên sâu)
    allowedSports: ['Gym', 'Bơi lội', 'Yoga', 'GroupX'],
  },
};

// Khởi tạo dữ liệu lớp học trong LocalStorage
const getInitialClasses = () => {
  const cached = localStorage.getItem(STORAGE_KEY_CLASSES);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      // fallback
    }
  }
  localStorage.setItem(STORAGE_KEY_CLASSES, JSON.stringify(centerClasses));
  return centerClasses;
};

// Khởi tạo danh sách đăng ký
const getInitialBookings = () => {
  const cached = localStorage.getItem(STORAGE_KEY_BOOKINGS);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      // fallback
    }
  }
  // Mẫu ban đầu: Hội viên đã đăng ký trước lớp 101 (Morning Flow Vinyasa Yoga)
  const defaultBookings = [
    {
      id: 'REG-1001',
      classId: 101,
      classTitle: 'Morning Flow Vinyasa Yoga',
      sport: 'Yoga',
      trainer: 'Maya Sharma',
      time: '06:30 - 07:30',
      daysShort: 'T2 - T4 - T6',
      room: 'Studio Zen Garden - Tầng 3',
      memberId: 'M-8899',
      memberName: 'Nguyễn Văn A',
      memberPhone: '0912345678',
      bookedAt: '2026-10-25T08:00:00.000Z',
      status: 'BOOKED', // BOOKED | CANCELLED
    },
  ];
  localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(defaultBookings));
  return defaultBookings;
};

let currentClasses = getInitialClasses();
let currentBookings = getInitialBookings();

const saveState = () => {
  localStorage.setItem(STORAGE_KEY_CLASSES, JSON.stringify(currentClasses));
  localStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(currentBookings));
};

const calculateClassStatus = (booked, capacity) => {
  if (booked >= capacity) return 'Đã đủ chỗ';
  if (capacity - booked <= 2) return 'Sắp hết';
  return 'Còn chỗ';
};

/**
 * Service quản lý Lớp học & Đặt lịch (Class Booking Service)
 * Tách biệt hoàn toàn khỏi Component, dễ dàng chuyển sang gọi API Backend thật qua REST/Axios.
 */
export const classBookingService = {
  /**
   * Lấy danh sách toàn bộ lớp học (FE-09)
   */
  async getClasses() {
    // Giả lập độ trễ mạng async 200ms
    await new Promise((resolve) => setTimeout(resolve, 200));
    return [...currentClasses];
  },

  /**
   * Lấy chi tiết một lớp học
   */
  async getClassById(classId) {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const target = currentClasses.find((c) => c.id === Number(classId));
    if (!target) throw new Error('Không tìm thấy lớp học.');
    return { ...target };
  },

  /**
   * Lấy danh sách các lớp hội viên đã đăng ký (FE-14)
   */
  async getUserBookings(memberId = mockCurrentUser.id) {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return currentBookings.filter(
      (b) => b.memberId === memberId && b.status === 'BOOKED'
    );
  },

  /**
   * Kiểm tra hội viên đã đăng ký lớp này chưa
   */
  async isClassBookedByUser(classId, memberId = mockCurrentUser.id) {
    const activeBooking = currentBookings.find(
      (b) => b.classId === Number(classId) && b.memberId === memberId && b.status === 'BOOKED'
    );
    return Boolean(activeBooking);
  },

  /**
   * Đăng ký lớp học chính thức cho hội viên (FE-10)
   * Nghiệp vụ theo Swimlane SCMS:
   * ① Slot available?
   * ② Membership ACTIVE?
   * ③ Package covers sport?
   * ④ No duplicate booking?
   */
  async bookOfficialClass(classId, member = mockCurrentUser) {
    await new Promise((resolve) => setTimeout(resolve, 350));

    const clsIndex = currentClasses.findIndex((c) => c.id === Number(classId));
    if (clsIndex === -1) {
      throw new Error('Lớp học không tồn tại.');
    }
    const cls = currentClasses[clsIndex];

    // 1. Kiểm tra trạng thái thẻ hội viên
    if (member.membership.status !== 'ACTIVE') {
      throw new Error(
        'Gói hội viên của bạn chưa được kích hoạt hoặc đã hết hạn. Vui lòng gia hạn trước khi đăng ký lớp.'
      );
    }

    // 2. Kiểm tra bộ môn có thuộc quyền lợi gói tập không
    const isCovered = member.membership.allowedSports.includes(cls.sport);
    if (!isCovered) {
      throw new Error(
        `Bộ môn "${cls.sport}" không nằm trong quyền lợi của ${member.membership.packageName}. Vui lòng nâng cấp gói Platinum hoặc Diamond VIP để tham gia lớp này.`
      );
    }

    // 3. Kiểm tra số slot còn trống
    if (cls.booked >= cls.capacity) {
      throw new Error('Lớp học đã đủ số lượng học viên, không thể đăng ký thêm.');
    }

    // 4. Kiểm tra đã đăng ký trùng lịch/trùng lớp chưa
    const existing = currentBookings.find(
      (b) => b.classId === cls.id && b.memberId === member.id && b.status === 'BOOKED'
    );
    if (existing) {
      throw new Error('Bạn đã đăng ký tham gia lớp học này rồi.');
    }

    // Cập nhật số lượng chỗ của lớp
    const newBooked = cls.booked + 1;
    const newStatus = calculateClassStatus(newBooked, cls.capacity);
    currentClasses[clsIndex] = {
      ...cls,
      booked: newBooked,
      status: newStatus,
    };

    // Tạo bản ghi đăng ký chính thức (Status = BOOKED)
    const newRegistration = {
      id: `REG-${Date.now().toString().slice(-5)}`,
      classId: cls.id,
      classTitle: cls.title,
      sport: cls.sport,
      trainer: cls.trainer,
      time: cls.time,
      daysShort: cls.daysShort,
      room: cls.room,
      memberId: member.id,
      memberName: member.fullName,
      memberPhone: member.phone,
      bookedAt: new Date().toISOString(),
      status: 'BOOKED',
    };

    currentBookings.unshift(newRegistration);
    saveState();

    return {
      success: true,
      message: `Đăng ký lớp "${cls.title}" thành công! Hệ thống đã ghi nhận lịch tập của bạn.`,
      registration: newRegistration,
      updatedClass: currentClasses[clsIndex],
    };
  },

  /**
   * Hủy đăng ký lớp học & Hoàn trả slot khả dụng (FE-11)
   * Nghiệp vụ theo Swimlane SCMS:
   * ① Tìm Class_Registration hiện tại
   * ② Cập nhật Status = CANCELLED
   * ③ Khôi phục slot capacity: capacity + 1 (giảm booked đi 1)
   */
  async cancelClassRegistration(classId, memberId = mockCurrentUser.id) {
    await new Promise((resolve) => setTimeout(resolve, 350));

    const bookingIndex = currentBookings.findIndex(
      (b) => b.classId === Number(classId) && b.memberId === memberId && b.status === 'BOOKED'
    );

    if (bookingIndex === -1) {
      throw new Error('Không tìm thấy thông tin đăng ký hợp lệ cho lớp học này.');
    }

    const clsIndex = currentClasses.findIndex((c) => c.id === Number(classId));
    if (clsIndex === -1) {
      throw new Error('Lớp học không tồn tại.');
    }

    const cls = currentClasses[clsIndex];

    // Cập nhật trạng thái bản ghi đăng ký thành CANCELLED
    currentBookings[bookingIndex] = {
      ...currentBookings[bookingIndex],
      status: 'CANCELLED',
      cancelledAt: new Date().toISOString(),
    };

    // Hoàn trả slot khả dụng
    const newBooked = Math.max(0, cls.booked - 1);
    const newStatus = calculateClassStatus(newBooked, cls.capacity);
    currentClasses[clsIndex] = {
      ...cls,
      booked: newBooked,
      status: newStatus,
    };

    saveState();

    return {
      success: true,
      message: `Đã hủy đăng ký lớp "${cls.title}". Slot chỗ đã được hoàn trả thành công!`,
      cancelledRegistrationId: currentBookings[bookingIndex].id,
      updatedClass: currentClasses[clsIndex],
    };
  },

  /**
   * Đăng ký học thử 01 buổi miễn phí dành cho khách mới (Guest Trial Booking)
   * Phân biệt rõ ràng với đăng ký lớp chính thức của hội viên
   */
  async bookTrialClass(classId, trialData) {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const cls = currentClasses.find((c) => c.id === Number(classId));
    if (!cls) throw new Error('Lớp học không tồn tại.');

    const trialRecord = {
      id: `TRIAL-${Date.now().toString().slice(-5)}`,
      classId: cls.id,
      classTitle: cls.title,
      fullName: trialData.fullName,
      phone: trialData.phone,
      email: trialData.email,
      date: trialData.date,
      note: trialData.note,
      status: 'PENDING_CONFIRMATION',
      createdAt: new Date().toISOString(),
    };

    return {
      success: true,
      message: `Đăng ký học thử 01 buổi lớp "${cls.title}" thành công! Bộ phận lễ tân AURA SPORT sẽ liên hệ với bạn trong vòng 30 phút để xác nhận lịch tập.`,
      trialRecord,
    };
  },

  /**
   * Khôi phục dữ liệu ban đầu nếu cần test lại từ đầu
   */
  resetData() {
    localStorage.removeItem(STORAGE_KEY_CLASSES);
    localStorage.removeItem(STORAGE_KEY_BOOKINGS);
    currentClasses = [...centerClasses];
    currentBookings = [];
    saveState();
  },
};
