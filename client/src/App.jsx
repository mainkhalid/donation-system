import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";
import LoadingSpinner from "./components/ui/LoadingSpinner";

// Pages
import Dashboard from "./pages/AdminDashboard";
import Donors from "./pages/admin/Donors";
import Donations from "./pages/admin/Donations";
import Campaigns from "./pages/admin/Campaigns";
import Reports from "./pages/admin/Reports";
import Settings from "./pages/admin/Settings";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Unauthorized from "./pages/errors/Unauthorized";
import NotFound from "./pages/errors/NotFound";
import NewCampaign from "./pages/admin/NewCampaign";

// Layout
import AdminLayout from "./layouts/AdminLayout";

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = ["admin", "manager"] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: window.location.pathname }}
        replace
      />
    );
  }

  if (!allowedRoles.includes(user.role)) {
    return (
      <Navigate
        to="/unauthorized"
        state={{ attemptedRoute: window.location.pathname }}
        replace
      />
    );
  }

  return children;
};

// Role-Specific Route Wrapper
const AdminOnlyRoute = ({ children }) => (
  <ProtectedRoute allowedRoles={["admin"]}>{children}</ProtectedRoute>
);

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="donors" element={<Donors />} />
            <Route path="donations" element={<Donations />} />
            <Route path="campaigns" element={<Campaigns />} />

            {/* Admin-only routes */}
            <Route
              path="reports"
              element={
                <AdminOnlyRoute>
                  <Reports />
                </AdminOnlyRoute>
              }
            />
            <Route
              path="settings"
              element={
                <AdminOnlyRoute>
                  <Settings />
                </AdminOnlyRoute>
              }
            />
            <Route
              path="campaigns/new"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <NewCampaign />
                </ProtectedRoute>
              }
            />

            {/* Default route under /admin */}
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>

          {/* Redirect root to dashboard */}
          <Route
            path="/"
            element={<Navigate to="/admin/dashboard" replace />}
          />

          {/* Optional legacy/alias route (remove if not needed) */}
          <Route
            path="/admin-dashboard"
            element={<Navigate to="/admin/dashboard" replace />}
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
