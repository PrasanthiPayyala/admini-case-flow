import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";

import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import CaseList from "./pages/cases/CaseList";
import CaseDetails from "./pages/cases/CaseDetails";
import AddCase from "./pages/cases/AddCase";
import EditCase from "./pages/cases/EditCase";
import BulkUpload from "./pages/cases/BulkUpload";
import FreshCases from "./pages/cases/FreshCases";
import OngoingCases from "./pages/cases/OngoingCases";
import ClosedCases from "./pages/cases/ClosedCases";
import AppealList from "./pages/appeals/AppealList";
import AddAppeal from "./pages/appeals/AddAppeal";
import HearingList from "./pages/hearings/HearingList";
import CourtLiaisonUpdates from "./pages/hearings/CourtLiaisonUpdates";
import ComplianceTracker from "./pages/compliance/ComplianceTracker";
import AlertCenter from "./pages/alerts/AlertCenter";
import ReportsPage from "./pages/reports/ReportsPage";
import UserList from "./pages/admin/UserList";
import RolesPermissions from "./pages/admin/RolesPermissions";
import DocumentManagement from "./pages/admin/DocumentManagement";
import AuditLogs from "./pages/admin/AuditLogs";
import SettingsPage from "./pages/admin/SettingsPage";
import Profile from "./pages/profile/Profile";
import ChangePassword from "./pages/profile/ChangePassword";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/cases" element={<ProtectedRoute><CaseList /></ProtectedRoute>} />
      <Route path="/cases/new" element={<ProtectedRoute><AddCase /></ProtectedRoute>} />
      <Route path="/cases/bulk-upload" element={<ProtectedRoute><BulkUpload /></ProtectedRoute>} />
      <Route path="/cases/fresh" element={<ProtectedRoute><FreshCases /></ProtectedRoute>} />
      <Route path="/cases/ongoing" element={<ProtectedRoute><OngoingCases /></ProtectedRoute>} />
      <Route path="/cases/closed" element={<ProtectedRoute><ClosedCases /></ProtectedRoute>} />
      <Route path="/cases/:id" element={<ProtectedRoute><CaseDetails /></ProtectedRoute>} />
      <Route path="/cases/:id/edit" element={<ProtectedRoute><EditCase /></ProtectedRoute>} />
      <Route path="/appeals" element={<ProtectedRoute><AppealList /></ProtectedRoute>} />
      <Route path="/appeals/new" element={<ProtectedRoute><AddAppeal /></ProtectedRoute>} />
      <Route path="/hearings" element={<ProtectedRoute><HearingList /></ProtectedRoute>} />
      <Route path="/court-liaison" element={<ProtectedRoute><CourtLiaisonUpdates /></ProtectedRoute>} />
      <Route path="/compliance" element={<ProtectedRoute><ComplianceTracker /></ProtectedRoute>} />
      <Route path="/alerts" element={<ProtectedRoute><AlertCenter /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
      <Route path="/users" element={<ProtectedRoute><UserList /></ProtectedRoute>} />
      <Route path="/roles" element={<ProtectedRoute><RolesPermissions /></ProtectedRoute>} />
      <Route path="/documents" element={<ProtectedRoute><DocumentManagement /></ProtectedRoute>} />
      <Route path="/audit-logs" element={<ProtectedRoute><AuditLogs /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <DataProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
