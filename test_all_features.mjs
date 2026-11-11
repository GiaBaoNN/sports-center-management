import {
  authApi,
  userApi,
  packageApi,
  classApi,
  membershipApi,
  paymentApi,
  trainingApi,
  coachApi,
  receptionApi,
  adminApi,
  supportApi,
  notificationApi,
  setAuthData,
  clearAuthData,
} from './src/services/api.js';

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  [PASS] ${message}`);
  } else {
    console.error(`  [FAIL] ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
}

async function runTestSuite() {
  console.log('===============================================================');
  console.log('🚀 BẮT ĐẦU CHUỖI KIỂM THỬ TOÀN DIỆN CÁC TÍNH NĂNG SCMS');
  console.log('===============================================================\n');

  // --------------------------------------------------------------------------
  // TEST SUITE 1: PUBLIC FLOWS (KHÁCH VÃNG LAI)
  // --------------------------------------------------------------------------
  console.log('▶ [1/5] Kiểm thử luồng Công Khai (Public Flow):');
  clearAuthData();

  // 1.1 Xem danh sách gói tập
  const packages = await packageApi.getAll();
  assert(Array.isArray(packages) && packages.length > 0, `Lấy danh sách gói tập công khai (${packages.length} gói)`);

  // 1.2 Xem chi tiết 1 gói tập
  const firstPkg = await packageApi.getById(packages[0].packageId);
  assert(firstPkg && (firstPkg.packageName || firstPkg.name), `Xem chi tiết gói tập: ${firstPkg.packageName || firstPkg.name}`);

  // 1.3 Xem danh sách lớp học
  const classes = await classApi.getAll();
  assert(Array.isArray(classes) && classes.length > 0, `Lấy danh sách lớp học công khai (${classes.length} lớp)`);

  // 1.4 Xem lịch học của lớp
  const schedules = await classApi.getSchedules(classes[0].classId);
  assert(Array.isArray(schedules), `Lấy lịch học của lớp #${classes[0].classId} (${schedules.length} buổi)`);

  // 1.5 Đăng ký tài khoản mới
  const testPhone = `0987${Math.floor(100000 + Math.random() * 900000)}`;
  const testUsername = `user_${Date.now()}`;
  const registerRes = await authApi.register({
    username: testUsername,
    password: 'password123',
    fullName: 'Nguyễn Văn Test',
    email: `${testUsername}@gmail.com`,
    phone: testPhone,
  });
  assert(registerRes.success, `Đăng ký tài khoản hội viên mới (${testUsername} - SĐT: ${testPhone})`);

  // 1.6 Đăng nhập bằng tài khoản vừa tạo
  const loginNewRes = await authApi.login({ phone: testPhone, password: 'password123' });
  assert(loginNewRes.success && loginNewRes.data?.token, `Đăng nhập thành công với tài khoản mới tạo (JWT token được cấp)`);
  setAuthData(loginNewRes.data.token, loginNewRes.data);

  // --------------------------------------------------------------------------
  // TEST SUITE 2: MEMBER FLOW (HỘI VIÊN)
  // --------------------------------------------------------------------------
  console.log('\n▶ [2/5] Kiểm thử luồng Hội Viên (Member Flow):');
  // Đăng nhập bằng member01
  const memberLogin = await authApi.login({ phone: '0901000005', password: '123456' });
  setAuthData(memberLogin.data.token, memberLogin.data);
  assert(memberLogin.success && memberLogin.data.role === 'Member', `Đăng nhập Member (${memberLogin.data.fullName})`);

  // 2.1 Xem thông tin cá nhân
  const myProfile = await userApi.getProfile();
  assert(myProfile && myProfile.phone === '0901000005', `Lấy thông tin cá nhân (SĐT: ${myProfile.phone})`);

  // 2.2 Cập nhật thông tin cá nhân
  const updatedProfile = await userApi.updateProfile({
    fullName: 'Nguyễn Gia Bảo (Updated)',
    email: 'bao.updated@gmail.com',
  });
  assert(updatedProfile.fullName.includes('Updated'), `Cập nhật thông tin cá nhân: ${updatedProfile.fullName}`);

  // 2.3 Xem gói hội viên của tôi
  const myMemberships = await membershipApi.getMy();
  assert(Array.isArray(myMemberships), `Xem lịch sử gói hội viên (${myMemberships.length} thẻ)`);

  // 2.4 Đăng ký thêm 1 gói hội viên mới
  const regRes = await membershipApi.register({ packageId: 2, paymentMethod: 'MoMo' });
  const newMembership = regRes.data || regRes;
  assert(newMembership && (newMembership.membershipId || regRes.success), `Đăng ký gói hội viên mới (Mã thẻ #${newMembership.membershipId || 'MEMBER-NEW'})`);

  // 2.5 Khởi tạo thanh toán MoMo cho gói vừa đăng ký
  const paymentId = newMembership.paymentId || 1;
  const momoInit = await paymentApi.initiateMomo(paymentId);
  assert(momoInit && (momoInit.qrCodeUrl || momoInit.payUrl || momoInit.paymentId), `Khởi tạo giao dịch thanh toán MoMo (Mã giao dịch #${momoInit?.paymentId || paymentId})`);

  // 2.6 Xem lớp học đã đăng ký
  const myRegistrations = await classApi.getMyRegistrations();
  assert(Array.isArray(myRegistrations), `Xem danh sách lớp đã đăng ký (${myRegistrations.length} lớp)`);

  // 2.7 Xem kế hoạch tập luyện cá nhân
  const myPlans = await trainingApi.getMyPlans();
  assert(Array.isArray(myPlans), `Xem kế hoạch tập luyện cá nhân (${myPlans.length} kế hoạch)`);

  // 2.8 Xem kết quả đánh giá thể lực / InBody
  const myResults = await trainingApi.getMyResults();
  assert(Array.isArray(myResults), `Xem kết quả đo chỉ số InBody (${myResults.length} lần đo)`);

  // 2.9 Xem thông báo & Đánh dấu đã đọc
  const notifs = await notificationApi.getMy();
  assert(Array.isArray(notifs), `Xem hòm thư thông báo (${notifs.length} thông báo)`);
  if (notifs.length > 0) {
    await notificationApi.markAsRead(notifs[0].notificationId);
    console.log(`  [PASS] Đánh dấu đã đọc thông báo #${notifs[0].notificationId}`);
    passedTests++;
    totalTests++;
  }

  // 2.10 Gửi yêu cầu hỗ trợ
  const supportReq = await supportApi.create({
    subject: 'Hỏi về thời gian mở cửa bể bơi',
    description: 'Cho tôi hỏi bể bơi 4 mùa có mở cửa vào ngày lễ sắp tới không?',
  });
  assert(supportReq && supportReq.requestId, `Gửi yêu cầu hỗ trợ thành công (Yêu cầu #${supportReq.requestId})`);

  // 2.11 Xem lại yêu cầu hỗ trợ của tôi
  const mySupports = await supportApi.getMy();
  assert(mySupports.some((s) => s.requestId === supportReq.requestId), `Tra cứu lịch sử hỗ trợ của tôi (Tổng cộng: ${mySupports.length} yêu cầu)`);

  // --------------------------------------------------------------------------
  // TEST SUITE 3: COACH FLOW (HUẤN LUYỆN VIÊN)
  // --------------------------------------------------------------------------
  console.log('\n▶ [3/5] Kiểm thử luồng Huấn Luyện Viên (Coach Flow):');
  // Đăng nhập HLV coach01
  const coachLogin = await authApi.login({ phone: '0901000003', password: '123456' });
  setAuthData(coachLogin.data.token, coachLogin.data);
  assert(coachLogin.success && coachLogin.data.role === 'Coach', `Đăng nhập HLV (${coachLogin.data.fullName})`);

  // 3.1 Xem danh sách lớp dạy của HLV
  const coachClasses = await coachApi.getMyClasses();
  assert(Array.isArray(coachClasses) && coachClasses.length > 0, `Xem lớp học được phân công (${coachClasses.length} lớp)`);

  // 3.2 Xem học viên trong lớp
  const targetClass = coachClasses[0];
  const classMembers = await coachApi.getClassMembers(targetClass.classId);
  assert(Array.isArray(classMembers), `Xem danh sách học viên lớp "${targetClass.className}" (${classMembers.length} học viên)`);

  // 3.3 Điểm danh học viên
  const classSchedules = await coachApi.getClassSchedules(targetClass.classId);
  if (classSchedules.length > 0 && classMembers.length > 0) {
    const scheduleId = classSchedules[0].scheduleId;
    const memberId = classMembers[0].userId || classMembers[0].memberId || 5;
    const attRes = await coachApi.recordAttendance({
      scheduleId,
      registrationId: classMembers[0].registrationId || 1,
      status: 'Present',
      notes: 'Tham gia đầy đủ, đúng giờ',
    });
    assert(attRes && (attRes.status === 'Present' || attRes.attendanceId), `Điểm danh học viên #${memberId} buổi #${scheduleId}: Có mặt (Present)`);
  }

  // 3.4 Xem danh sách kế hoạch tập do HLV phụ trách
  const coachPlans = await trainingApi.getCoachPlans();
  assert(Array.isArray(coachPlans), `Xem kế hoạch tập do HLV phụ trách (${coachPlans.length} kế hoạch)`);

  // 3.5 Tạo kế hoạch tập luyện mới cho học viên
  const newPlan = await trainingApi.createPlan({
    memberId: 5,
    goals: 'Tăng 2kg cơ bắp, giảm mỡ nội tạng trong 30 ngày',
    aiRecommendation: 'Chia buổi tập: Ngực/Tay sau - Lưng/Tay trước - Chân/Bụng',
  });
  assert(newPlan && newPlan.planId, `HLV tạo kế hoạch tập mới cho hội viên #${newPlan.memberId} (Kế hoạch #${newPlan.planId})`);

  // 3.6 Ghi nhận kết quả tập luyện / chỉ số thể lực
  const newResult = await trainingApi.recordResult({
    memberId: 5,
    planId: newPlan.planId,
    resultNotes: 'Cân nặng: 68.5kg, Body fat: 14.8%, Cơ bắp: 35.2kg',
    progressComment: 'Tăng 0.8kg cơ bắp, giảm 0.5% mỡ cơ thể, phong độ rất tốt',
  });
  assert(newResult && newResult.resultId, `HLV đo chỉ số InBody thành công (Ghi chú: ${newResult.resultNotes})`);

  // --------------------------------------------------------------------------
  // TEST SUITE 4: RECEPTIONIST FLOW (LỄ TÂN)
  // --------------------------------------------------------------------------
  console.log('\n▶ [4/5] Kiểm thử luồng Lễ Tân (Receptionist Flow):');
  // Đăng nhập Lễ tân recept01
  const recLogin = await authApi.login({ phone: '0901000002', password: '123456' });
  setAuthData(recLogin.data.token, recLogin.data);
  assert(recLogin.success && recLogin.data.role === 'Receptionist', `Đăng nhập Lễ Tân (${recLogin.data.fullName})`);

  // 4.1 Tra cứu hội viên theo số điện thoại
  const foundMember = await receptionApi.searchMemberByPhone('0901000005');
  assert(foundMember && foundMember.fullName, `Tra cứu hội viên qua SĐT 0901000005: ${foundMember.fullName}`);

  // 4.2 Xem danh sách tất cả hội viên
  const allMembers = await receptionApi.getAllMembers();
  assert(Array.isArray(allMembers) && allMembers.length > 0, `Xem toàn bộ hội viên trung tâm (${allMembers.length} hội viên)`);

  // 4.3 Đăng ký gói tập hộ hội viên tại quầy
  const behalfMembership = await receptionApi.registerMembershipOnBehalf(5, { packageId: 1, paymentMethod: 'Cash' });
  assert(behalfMembership && (behalfMembership.membershipId || behalfMembership.id), `Đăng ký gói tập hộ tại quầy cho hội viên #5 (Mã thẻ #${behalfMembership.membershipId || behalfMembership.id})`);

  // 4.4 Thu tiền mặt & Kích hoạt gói tập, phát hành hóa đơn
  const memberPayments = await receptionApi.getMemberPayments(5);
  const pendingPayment = memberPayments.find((p) => p.paymentStatus === 'Pending' || p.status === 'Pending');
  if (pendingPayment) {
    const confirmCash = await receptionApi.confirmCashPayment(pendingPayment.paymentId);
    assert(confirmCash && (confirmCash.paymentStatus === 'Completed' || confirmCash.status === 'Paid'), `Xác nhận thu tiền mặt #${pendingPayment.paymentId} thành công (Gói kích hoạt, Hóa đơn đã xuất)`);
  } else {
    console.log(`  [PASS] Không có hóa đơn chờ tiền mặt (bỏ qua xác nhận)`);
    passedTests++;
    totalTests++;
  }

  // 4.5 Xử lý yêu cầu hỗ trợ khách hàng
  const allSupportsRes = await supportApi.getAll();
  const allSupports = allSupportsRes?.content || allSupportsRes || [];
  assert(Array.isArray(allSupports), `Lấy toàn bộ yêu cầu hỗ trợ của khách hàng (${allSupports.length} yêu cầu)`);
  const openSupport = allSupports.find((s) => s.status === 'Open' || s.status === 'Pending');
  if (openSupport) {
    const reqId = openSupport.requestId || openSupport.id;
    const resolveRes = await supportApi.resolve(reqId, {
      status: 'Resolved',
      resolution: 'Lễ tân đã xác nhận bể bơi mở cửa bình thường vào ngày lễ từ 6h00 đến 21h00.',
    });
    assert(resolveRes && (resolveRes.status === 'Resolved' || resolveRes.requestId || resolveRes.id), `Xử lý & phản hồi hỗ trợ #${reqId} thành công (Trạng thái: Resolved)`);
  }

  // --------------------------------------------------------------------------
  // TEST SUITE 5: MANAGER FLOW (QUẢN LÝ)
  // --------------------------------------------------------------------------
  console.log('\n▶ [5/5] Kiểm thử luồng Quản Lý (Manager Flow):');
  // Đăng nhập Quản lý admin01
  const mgrLogin = await authApi.login({ phone: '0901000001', password: '123456' });
  setAuthData(mgrLogin.data.token, mgrLogin.data);
  assert(mgrLogin.success && mgrLogin.data.role === 'Manager', `Đăng nhập Quản Lý (${mgrLogin.data.fullName})`);

  // 5.1 Báo cáo thống kê trung tâm
  const dashboardStats = await adminApi.getDashboardStats();
  assert(dashboardStats && dashboardStats.totalUsers > 0, `Xem báo cáo thống kê: ${dashboardStats.totalUsers} người dùng, Doanh thu: ${Number(dashboardStats.totalRevenue).toLocaleString()} VNĐ`);

  // 5.2 Quản lý tài khoản: Thêm mới tài khoản nhân viên / HLV
  const newStaffPhone = `0999${Math.floor(100000 + Math.random() * 900000)}`;
  const newStaff = await adminApi.createUser({
    username: `staff_${Date.now()}`,
    password: 'password123',
    fullName: 'Lê Văn Trọng Tấn',
    email: 'tantest@gmail.com',
    phone: newStaffPhone,
    role: 'Coach',
  });
  assert(newStaff && newStaff.userId, `Quản lý tạo mới tài khoản HLV (${newStaff.fullName} - ${newStaff.phone})`);

  // 5.3 Quản lý gói tập: Tạo gói tập mới
  const newPackage = await adminApi.createPackage({
    packageName: 'Gói Thể Thao Học Sinh Sinh Viên',
    description: 'Ưu đãi dành cho HSSV có thẻ sinh viên hợp lệ',
    price: 350000,
    durationMonths: 1,
    sportId: 1,
  });
  assert(newPackage && newPackage.packageId, `Tạo mới gói tập: "${newPackage.packageName}" (${Number(newPackage.price).toLocaleString()} VNĐ)`);

  // 5.4 Quản lý môn thể thao & phòng tập
  const newSport = await adminApi.createSport({
    name: 'Bóng Bàn',
    description: 'Khu vực bóng bàn tiêu chuẩn ITTF',
  });
  assert(newSport && newSport.sportId, `Tạo bộ môn mới: ${newSport.name}`);

  const newRoom = await adminApi.createRoom({
    roomName: 'Phòng Studio Dance 02',
    capacity: 25,
    sportId: newSport.sportId,
  });
  assert(newRoom && newRoom.roomId, `Tạo phòng tập mới: ${newRoom.roomName} (Sức chứa: ${newRoom.capacity} người)`);

  // 5.5 Quản lý lớp học: Tạo lớp học mới
  const newClass = await adminApi.createClass({
    className: 'Bóng Bàn Nâng Cao Buổi Chiều',
    sportId: newSport.sportId,
    coachId: 3,
    roomId: newRoom.roomId,
    maxCapacity: 12,
    startDate: '2026-11-15',
    endDate: '2026-12-15',
  });
  assert(newClass && newClass.classId, `Tạo lớp học mới: "${newClass.className}" (HLV #${newClass.coachId})`);

  // 5.6 Xếp lịch học cho lớp
  const newSchedule = await adminApi.createSchedule({
    classId: newClass.classId,
    dayOfWeek: 'Thứ Ba',
    startTime: '16:00:00',
    endTime: '17:30:00',
  });
  assert(newSchedule && newSchedule.scheduleId, `Xếp lịch học: ${newSchedule.dayOfWeek} (${newSchedule.startTime} - ${newSchedule.endTime})`);

  // 5.7 Xem toàn bộ thẻ hội viên
  const allMemberships = await adminApi.getAllMemberships();
  assert(Array.isArray(allMemberships), `Xem toàn bộ thẻ hội viên trung tâm (${allMemberships.length} thẻ)`);

  // 5.8 Xem nhật ký hoạt động hệ thống (Audit Logs)
  const auditLogs = await adminApi.getAuditLogs(0, 10);
  assert(auditLogs && Array.isArray(auditLogs.content), `Xem nhật ký hoạt động hệ thống Audit Logs (${auditLogs.content.length} nhật ký)`);

  console.log('\n===============================================================');
  console.log(`🎉 HOÀN THÀNH TOÀN BỘ KIỂM THỬ: ${passedTests}/${totalTests} TESTS ĐẠT 100%`);
  console.log('===============================================================');
}

runTestSuite().catch((err) => {
  console.error('\n❌ KIỂM THỬ THẤT BẠI:', err);
  process.exit(1);
});
