# 🏋️ AURA SPORT — Sports Center Management System (Frontend)

Hệ thống giao diện Frontend hiện đại cho Trung tâm Thể thao & Thể hình cao cấp **AURA SPORT**, được xây dựng bằng **React.js** và thư viện **Material UI (MUI)**.

---

## 🚀 Tech Stack

- **Framework**: React.js 19 + Vite (HMR siêu tốc)
- **UI Library**: Material UI (MUI v6)
- **Icons**: MUI Icons Material (`@mui/icons-material`)
- **Routing**: React Router DOM v7
- **Styling**: Emotion Styled + Custom Sports Center Theme
- **Fonts**: Plus Jakarta Sans & Oswald (Google Fonts)

---

## 🎨 Design System & Color Palette

Theo đúng yêu cầu của Design Brief:
- `primary`: `#1976D2` — Xanh dương năng động & chuyên nghiệp
- `secondary`: `#FF6B35` — Cam thể thao nhiệt huyết
- `success`: `#2E7D32` — Xanh lá (ACTIVE, PAID, Còn chỗ)
- `warning`: `#ED6C02` — Cam cảnh báo (PENDING, EXPIRING, Sắp hết chỗ)
- `error`: `#D32F2F` — Đỏ (FAILED, EXPIRED, Đã đủ chỗ)
- `info`: `#0288D1` — Xanh thông tin
- `background`: `#F5F7FA` — Nền xám nhạt tinh tế

---

## 🌐 Danh Sách 7 Trang Công Khai (Public Pages)

| STT | Trang | Đường dẫn | Mô tả chức năng |
|:---:|:---|:---|:---|
| 1 | **Trang Chủ** | `/` | Hero section với slogan bứt phá & CTA, Giới thiệu tiện ích Technogym/Hồ bơi/Yoga, Grid 6 môn thể thao, Gói hội viên nổi bật, Carousel HLV quốc tế, Đánh giá hội viên (Testimonials), Banner CTA. |
| 2 | **Đăng Nhập** | `/login` | Giao diện Split-screen (Ảnh gym truyền cảm hứng bên trái, Form bên phải), Nhớ mật khẩu, Quên mật khẩu, Social login (Google, Facebook, Apple), Tài khoản demo nhanh. |
| 3 | **Đăng Ký** | `/register` | Form họ tên, email, SĐT VN, mật khẩu & xác nhận mật khẩu, Checkbox đồng ý điều khoản, Realtime validation kiểm tra lỗi tức thì, Redirect về đăng nhập sau khi submit. |
| 4 | **Quên Mật Khẩu** | `/forgot-password` | Nhập email khôi phục, Màn hình xác nhận "Email đã gửi", Bộ đếm ngược 60 giây gửi lại email và nút trở về đăng nhập. |
| 5 | **Về Chúng Tôi** | `/about` | Câu chuyện thương hiệu, Sứ mệnh 2030 & Tầm nhìn, 4 Giá trị cốt lõi, Timeline phát triển (2019 - 2026), Ban lãnh đạo & Giám đốc chuyên môn, Infographics số liệu. |
| 6 | **Gói Hội Viên** | `/packages` | Bộ chọn chu kỳ Tháng / Quý / Năm (-20%), Grid 4 gói (Silver, Gold - Best Seller, Platinum, Diamond VIP), Bảng so sánh chi tiết 11 dịch vụ, FAQs accordion, Modal đăng ký nhanh. |
| 7 | **Lịch Lớp Học** | `/classes` | Bộ lọc đa chiều (Môn thể thao, HLV, Ngày trong tuần, Khung giờ, Tìm kiếm tên lớp), Grid card lớp học với tiến độ slot chỗ còn trống, Modal xem chi tiết & Form đăng ký tập thử 1 buổi miễn phí. |

---

## 📂 Cấu Trúc Thư Mục Dự Án

```
d:/TS4/AI Project/
├── index.html                 # Cấu hình Google Fonts & tiêu đề hệ thống
├── package.json               # Danh sách thư viện & scripts
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.jsx            # Header điều hướng desktop & mobile drawer
│   │   │   ├── Footer.jsx            # Footer liên hệ, bản đồ mockup, mạng xã hội, newsletter
│   │   │   ├── SectionHeader.jsx     # Tiêu đề section đồng bộ kèm highlight gradient
│   │   │   ├── ClassDetailModal.jsx  # Modal xem chi tiết lớp học & đặt chỗ tập thử
│   │   │   └── PackageModal.jsx      # Modal đăng ký nhanh gói hội viên
│   │   └── layout/
│   │       └── Layout.jsx            # Layout bọc Navbar, Footer & nút cuộn lên đầu trang
│   ├── data/
│   │   └── sportsData.js             # Dữ liệu mock: Môn thể thao, Gói tập, HLV, Lớp học, Lịch sử...
│   ├── pages/
│   │   ├── Home.jsx                  # Trang chủ Landing Page
│   │   ├── Login.jsx                 # Trang đăng nhập
│   │   ├── Register.jsx              # Trang đăng ký
│   │   ├── ForgotPassword.jsx        # Trang quên mật khẩu
│   │   ├── About.jsx                 # Trang giới thiệu
│   │   ├── Packages.jsx              # Trang gói hội viên & so sánh
│   │   └── Classes.jsx               # Trang danh mục & lịch lớp học
│   ├── theme/
│   │   └── index.js                  # Theme Material UI tùy biến theo Design System
│   ├── App.jsx                       # Cấu hình định tuyến React Router
│   ├── index.css                     # Reset CSS, font chữ & thanh cuộn hiện đại
│   └── main.jsx                      # Điểm khởi chạy ứng dụng (ThemeProvider, BrowserRouter)
```

---

## 🏃 Hướng Dẫn Cài Đặt & Chạy Dự Án

### 1. Cài đặt dependencies (nếu chưa có):
```bash
npm install
```

### 2. Chạy môi trường Development:
```bash
npm run dev
```
Truy cập trên trình duyệt tại: `http://localhost:5173/`

### 3. Build Production:
```bash
npm run build
```
Thư mục sản phẩm tối ưu sẽ được xuất ra tại `dist/`.
