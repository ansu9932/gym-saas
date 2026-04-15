import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

const AppShell = lazy(() => import("./components/layout/AppShell"));
const AttendancePage = lazy(() => import("./pages/AttendancePage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const MembersPage = lazy(() => import("./pages/MembersPage"));
const NotificationsPage = lazy(() => import("./pages/NotificationsPage"));
const PlansPage = lazy(() => import("./pages/PlansPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));

const FullscreenLoader = () => (
  <div className="flex min-h-screen items-center justify-center px-4">
    <div className="glass-panel rounded-[32px] border border-white/10 px-8 py-6 text-center">
      <p className="text-xs uppercase tracking-[0.24em] text-[#ff9b84]">FlexBoard</p>
      <p className="mt-3 font-display text-3xl text-[color:var(--text)]">Loading workspace...</p>
    </div>
  </div>
);

const ProtectedRoutes = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <FullscreenLoader />;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <AppShell />;
};

const GuestRoutes = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <FullscreenLoader />;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

const AppRoutes = () => (
  <Suspense fallback={<FullscreenLoader />}>
    <Routes>
      <Route element={<GuestRoutes />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoutes />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/members" element={<MembersPage />} />
        <Route path="/plans" element={<PlansPage />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  </Suspense>
);

const App = () => (
  <ThemeProvider>
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  </ThemeProvider>
);

export default App;
