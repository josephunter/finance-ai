import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { UserSettingsProvider } from '@/contexts/UserSettingsContext';
import { Toaster } from '@/components/ui/toaster';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import Assets from '@/pages/Assets';
import Analytics from '@/pages/Analytics';
import Settings from '@/pages/Settings';
import Subscription from '@/pages/Subscription';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <UserSettingsProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardLayout />
                </PrivateRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="assets" element={<Assets />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="settings" element={<Settings />} />
              <Route path="subscription" element={<Subscription />} />
            </Route>
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
          <Toaster />
        </UserSettingsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;