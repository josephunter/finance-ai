import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Assets from './pages/Assets';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Subscription from './pages/Subscription';
import About from './pages/legal/About';
import Contact from './pages/legal/Contact';
import Terms from './pages/legal/Terms';
import Privacy from './pages/legal/Privacy';
import { useAuth } from './contexts/AuthContext';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return user ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <CurrencyProvider>
            <SubscriptionProvider>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/assets"
                  element={
                    <PrivateRoute>
                      <Assets />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/analytics"
                  element={
                    <PrivateRoute>
                      <Analytics />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/subscription"
                  element={
                    <PrivateRoute>
                      <Subscription />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <PrivateRoute>
                      <Settings />
                    </PrivateRoute>
                  }
                />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
              </Routes>
            </SubscriptionProvider>
          </CurrencyProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;