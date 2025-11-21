import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { StaffDashboard } from './pages/staff/StaffDashboard';
import { StaffRequests } from './pages/staff/StaffRequests';
import { RequestDetails } from './pages/staff/RequestDetails';
import { ApproverDashboard } from './pages/approver/ApproverDashboard';
import { ApproverRequestDetails } from './pages/approver/ApproverRequestDetails';
import { FinanceDashboard } from './pages/finance/FinanceDashboard';
import { FinanceRequestDetails } from './pages/finance/FinanceRequestDetails';
import { PurchaseOrderDetails } from './pages/finance/PurchaseOrderDetails';
import { Profile } from './pages/profile/Profile';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';
export function AppRouter() {
  const {
    isAuthenticated,
    userRole
  } = useAuth();
  return <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {/* Protected Routes - Profile accessible to all authenticated users */}
        <Route element={<ProtectedRoute allowedRoles={['staff', 'approver', 'finance']} />}>
          <Route path="/profile" element={<Profile />} />
        </Route>
        {/* Staff Routes */}
        <Route element={<ProtectedRoute allowedRoles={['staff']} />}>
          <Route path="/dashboard/staff" element={<StaffDashboard />} />
          <Route path="/dashboard/staff/requests" element={<StaffRequests />} />
          <Route path="/dashboard/staff/requests/:id" element={<RequestDetails />} />
        </Route>
        {/* Approver Routes */}
        <Route element={<ProtectedRoute allowedRoles={['approver']} />}>
          <Route path="/dashboard/approver" element={<ApproverDashboard />} />
          <Route path="/dashboard/approver/requests/:id" element={<ApproverRequestDetails />} />
        </Route>
        {/* Finance Routes */}
        <Route element={<ProtectedRoute allowedRoles={['finance']} />}>
          <Route path="/dashboard/finance" element={<FinanceDashboard />} />
          <Route path="/dashboard/finance/requests/:id" element={<FinanceRequestDetails />} />
          <Route path="/dashboard/finance/po/:id" element={<PurchaseOrderDetails />} />
        </Route>
        {/* Default Routes */}
        <Route path="/" element={isAuthenticated ? userRole === 'staff' ? <Navigate to="/dashboard/staff" /> : userRole === 'approver' ? <Navigate to="/dashboard/approver" /> : userRole === 'finance' ? <Navigate to="/dashboard/finance" /> : <Navigate to="/login" /> : <Navigate to="/login" />} />
        {/* Catch All */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>;
}