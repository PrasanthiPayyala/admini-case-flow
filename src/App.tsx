import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import CaseList from "./pages/cases/CaseList";
import CaseDetails from "./pages/cases/CaseDetails";
import AddCase from "./pages/cases/AddCase";
import AppealList from "./pages/appeals/AppealList";
import AddAppeal from "./pages/appeals/AddAppeal";
import HearingList from "./pages/hearings/HearingList";
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/cases" element={<CaseList />} />
          <Route path="/cases/new" element={<AddCase />} />
          <Route path="/cases/:id" element={<CaseDetails />} />
          <Route path="/appeals" element={<AppealList />} />
          <Route path="/appeals/new" element={<AddAppeal />} />
          <Route path="/hearings" element={<HearingList />} />
          <Route path="/alerts" element={<AlertCenter />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/roles" element={<RolesPermissions />} />
          <Route path="/documents" element={<DocumentManagement />} />
          <Route path="/audit-logs" element={<AuditLogs />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
