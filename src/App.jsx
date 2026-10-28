import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import About from './pages/About';
import Packages from './pages/Packages';
import Classes from './pages/Classes';
import DashboardShell from './pages/DashboardShell';
import ProtectedRoute from './components/common/ProtectedRoute';
import { ROLES } from './context/AuthContext';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public Pages */}
        <Route index element={<Home />} />
        <Route path="packages" element={<Packages />} />
        <Route path="classes" element={<Classes />} />
        <Route path="about" element={<About />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />

        {/* Role-Based Protected Routes */}
        <Route
          path="member/dashboard"
          element={
            <ProtectedRoute allowedRoles={[ROLES.MEMBER]}>
              <DashboardShell roleKey={ROLES.MEMBER} />
            </ProtectedRoute>
          }
        />
        <Route
          path="coach/dashboard"
          element={
            <ProtectedRoute allowedRoles={[ROLES.COACH]}>
              <DashboardShell roleKey={ROLES.COACH} />
            </ProtectedRoute>
          }
        />
        <Route
          path="receptionist/dashboard"
          element={
            <ProtectedRoute allowedRoles={[ROLES.RECEPTIONIST]}>
              <DashboardShell roleKey={ROLES.RECEPTIONIST} />
            </ProtectedRoute>
          }
        />
        <Route
          path="manager/dashboard"
          element={
            <ProtectedRoute allowedRoles={[ROLES.CENTER_MANAGER]}>
              <DashboardShell roleKey={ROLES.CENTER_MANAGER} />
            </ProtectedRoute>
          }
        />

        {/* Catch-all redirect to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
