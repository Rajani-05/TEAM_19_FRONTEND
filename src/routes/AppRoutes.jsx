import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Public pages
import LandingPage from '../pages/public/LandingPage';
import LoginPage from '../pages/public/LoginPage';
import RegisterPage from '../pages/public/RegisterPage';
import NotFoundPage from '../pages/public/NotFoundPage';
import UnauthorizedPage from '../pages/public/UnauthorizedPage';

// Client portals (unprotected public tokens)
import ClientPackageViewPage from '../pages/client/ClientPackageViewPage';
import ClientApprovePayPage from '../pages/client/ClientApprovePayPage';

// Layout & Guards
import Layout from '../components/layout/Layout';
import ProtectedRoute from '../components/layout/ProtectedRoute';
import RoleRoute from '../components/layout/RoleRoute';

// Planner pages
import PlannerDashboard from '../pages/planner/PlannerDashboard';
import VendorDirectoryPage from '../pages/planner/VendorDirectoryPage';
import VendorProfilePage from '../pages/planner/VendorProfilePage';
import CreateEventPage from '../pages/planner/CreateEventPage';
import EventBuilderPage from '../pages/planner/EventBuilderPage';
import ChatPage from '../pages/planner/ChatPage';
import PaymentHistoryPage from '../pages/planner/PaymentHistoryPage';
import ReviewPage from '../pages/planner/ReviewPage';

// Vendor pages
import VendorDashboard from '../pages/vendor/VendorDashboard';
import EditVendorProfilePage from '../pages/vendor/EditVendorProfilePage';
import VendorChatPage from '../pages/vendor/VendorChatPage';
import VendorPaymentsPage from '../pages/vendor/VendorPaymentsPage';

// Admin pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import UserManagementPage from '../pages/admin/UserManagementPage';
import VendorModerationPage from '../pages/admin/VendorModerationPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* 1. Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* 2. Client Portal Routes (Public, no auth headers required) */}
      <Route path="/client-view/:clientLinkToken" element={<ClientPackageViewPage />} />
      <Route path="/client-view/:clientLinkToken/pay" element={<ClientApprovePayPage />} />

      {/* 3. Protected Dashboard Routes */}
      <Route element={<ProtectedRoute />}>
        {/* Core Layout wrapper */}
        <Route element={<Layout />}>
          
          {/* Planner Sub-tree */}
          <Route element={<RoleRoute allowedRoles={['PLANNER']} />}>
            <Route path="/planner/dashboard" element={<PlannerDashboard />} />
            <Route path="/planner/vendors" element={<VendorDirectoryPage />} />
            <Route path="/planner/vendors/:id" element={<VendorProfilePage />} />
            <Route path="/planner/create-event" element={<CreateEventPage />} />
            <Route path="/planner/event-builder/:id" element={<EventBuilderPage />} />
            <Route path="/planner/chat/:eventId" element={<ChatPage />} />
            <Route path="/planner/payments" element={<PaymentHistoryPage />} />
            <Route path="/planner/reviews/:eventId" element={<ReviewPage />} />
          </Route>

          {/* Vendor Sub-tree */}
          <Route element={<RoleRoute allowedRoles={['VENDOR']} />}>
            <Route path="/vendor/dashboard" element={<VendorDashboard />} />
            <Route path="/vendor/profile" element={<EditVendorProfilePage />} />
            <Route path="/vendor/chat/:eventId" element={<VendorChatPage />} />
            <Route path="/vendor/payments" element={<VendorPaymentsPage />} />
          </Route>

          {/* Admin Sub-tree */}
          <Route element={<RoleRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagementPage />} />
            <Route path="/admin/vendors" element={<VendorModerationPage />} />
          </Route>

        </Route>
      </Route>

      {/* 4. Fallback Page */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
