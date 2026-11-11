import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DashboardLayout from './components/dashboard/DashboardLayout';

// Public Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import About from './pages/About';
import Packages from './pages/Packages';
import Classes from './pages/Classes';

// Member Portal Pages
import MemberDashboard from './pages/member/MemberDashboard';
import MemberProfile from './pages/member/MemberProfile';
import MemberMemberships from './pages/member/MemberMemberships';
import MemberClasses from './pages/member/MemberClasses';
import MemberTraining from './pages/member/MemberTraining';
import MemberNotifications from './pages/member/MemberNotifications';
import MemberSupport from './pages/member/MemberSupport';

// Coach Portal Pages
import CoachDashboard from './pages/coach/CoachDashboard';
import CoachClasses from './pages/coach/CoachClasses';
import CoachAttendance from './pages/coach/CoachAttendance';
import CoachTraining from './pages/coach/CoachTraining';

// Receptionist Portal Pages
import ReceptionDashboard from './pages/reception/ReceptionDashboard';
import ReceptionMembers from './pages/reception/ReceptionMembers';
import ReceptionCashier from './pages/reception/ReceptionCashier';
import ReceptionOnBehalf from './pages/reception/ReceptionOnBehalf';
import ReceptionSupport from './pages/reception/ReceptionSupport';

// Manager Portal Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminPackages from './pages/admin/AdminPackages';
import AdminClasses from './pages/admin/AdminClasses';
import AdminFacilities from './pages/admin/AdminFacilities';
import AdminMemberships from './pages/admin/AdminMemberships';
import AdminAuditLogs from './pages/admin/AdminAuditLogs';

// Helper component: Smart redirect based on authenticated user's role
const DashboardRedirect = () => {
  const { user } = useAuth();
  switch (user?.role) {
    case 'Manager':
      return <Navigate to="/admin" replace />;
    case 'Receptionist':
      return <Navigate to="/reception" replace />;
    case 'Coach':
      return <Navigate to="/coach" replace />;
    case 'Member':
    default:
      return <Navigate to="/member" replace />;
  }
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes with Navbar and Footer */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="packages" element={<Packages />} />
          <Route path="classes" element={<Classes />} />
          <Route path="about" element={<About />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* Smart Redirect to Role Portal */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardRedirect />
            </ProtectedRoute>
          }
        />

        {/* Member Portal */}
        <Route
          path="/member"
          element={
            <ProtectedRoute allowedRoles={['Member', 'Manager']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<MemberDashboard />} />
          <Route path="profile" element={<MemberProfile />} />
          <Route path="memberships" element={<MemberMemberships />} />
          <Route path="classes" element={<MemberClasses />} />
          <Route path="training" element={<MemberTraining />} />
          <Route path="notifications" element={<MemberNotifications />} />
          <Route path="support" element={<MemberSupport />} />
        </Route>

        {/* Coach Portal */}
        <Route
          path="/coach"
          element={
            <ProtectedRoute allowedRoles={['Coach', 'Manager']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<CoachDashboard />} />
          <Route path="classes" element={<CoachClasses />} />
          <Route path="attendance" element={<CoachAttendance />} />
          <Route path="training" element={<CoachTraining />} />
        </Route>

        {/* Receptionist Portal */}
        <Route
          path="/reception"
          element={
            <ProtectedRoute allowedRoles={['Receptionist', 'Manager']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ReceptionDashboard />} />
          <Route path="members" element={<ReceptionMembers />} />
          <Route path="cashier" element={<ReceptionCashier />} />
          <Route path="on-behalf" element={<ReceptionOnBehalf />} />
          <Route path="support" element={<ReceptionSupport />} />
        </Route>

        {/* Manager Portal */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['Manager']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="packages" element={<AdminPackages />} />
          <Route path="classes" element={<AdminClasses />} />
          <Route path="facilities" element={<AdminFacilities />} />
          <Route path="memberships" element={<AdminMemberships />} />
          <Route path="support" element={<ReceptionSupport />} />
          <Route path="audit-logs" element={<AdminAuditLogs />} />
        </Route>

        {/* Catch-all redirect to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
