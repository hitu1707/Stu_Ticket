import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import ThemeProvider from '@/components/layout/ThemeProvider.jsx';
import ProtectedRoute from '@/components/layout/ProtectedRoute.jsx';
import AuthPage from '@/components/auth/AuthPage.jsx';
import Dashboard from '@/components/admin/Dashboard.jsx';
import TicketPage from '@/components/ticket/TicketPage.jsx';
import TicketsPage from '@/components/admin/TicketsPage.jsx';
import ProfilePage from '@/components/admin/ProfilePage.jsx';
import ForgotPassword from '@/components/auth/ForgotPassword.jsx';
import NotFound from '@/components/layout/NotFound.jsx';
import useAuthStore from './store/authStore';  // ← Fixed (removed .jsx)

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/" 
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <AuthPage />
            } 
          />

          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tickets/new"
            element={
              <ProtectedRoute>
                <TicketPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tickets"
            element={
              <ProtectedRoute>
                <TicketsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* 404 - Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* Toast Notifications */}
        <Toaster position="top-right" richColors />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;