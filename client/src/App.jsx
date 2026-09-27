import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { PendingApproval } from './pages/PendingApproval';
import { Dashboard } from './pages/Dashboard';
import { LedgerPage } from './pages/LedgerPage';
import { CommunityPage } from './pages/CommunityPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminApprovalsPage } from './pages/AdminApprovalsPage';
import { AdminMembersPage } from './pages/AdminMembersPage';
import { ApplyMembershipPage } from './pages/ApplyMembershipPage';
import { FundPage } from './pages/FundPage';
import { MembersPage } from './pages/MembersPage';
import { MonthlyReportPage } from './pages/MonthlyReportPage';
import { MyDepositsPage } from './pages/MyDepositsPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { NoticesPage } from './pages/NoticesPage';
import { ShariahPolicyPage } from './pages/ShariahPolicyPage';
import { ReceiptsPage } from './pages/ReceiptsPage';
import { AddDepositPage } from './pages/AddDepositPage';

function App() {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/pending-approval" element={<PendingApproval />} />

      {/* Protected Member & Admin App Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="apply-membership" element={<ApplyMembershipPage />} />
        <Route path="fund" element={<FundPage />} />
        <Route path="members" element={<MembersPage />} />
        <Route path="monthly-report" element={<MonthlyReportPage />} />
        <Route path="my-deposits" element={<MyDepositsPage />} />
        <Route path="leaderboard" element={<LeaderboardPage />} />
        <Route path="notices" element={<NoticesPage />} />
        <Route path="shariah-policy" element={<ShariahPolicyPage />} />
        <Route path="receipts" element={<ReceiptsPage />} />
        <Route
          path="add-deposit"
          element={
            <ProtectedRoute adminOnly={true}>
              <AddDepositPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="ledger"
          element={
            <ProtectedRoute memberOnly={true}>
              <LedgerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="community"
          element={
            <ProtectedRoute memberOnly={true}>
              <CommunityPage />
            </ProtectedRoute>
          }
        />
        <Route path="profile" element={<ProfilePage />} />

        {/* Admin Only Protected Routes */}
        <Route
          path="admin/approvals"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminApprovalsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/members"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminMembersPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
