import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Sidebar } from '@/components/ui/sidebar';
import Login from '@/pages/login';
import { Dashboard } from '@/pages/dashboard';
import { Creators } from '@/pages/creators';
import Supporters from '@/pages/supporters';
import { Transactions } from '@/pages/transactions';
import { Settings } from '@/pages/settings';
import { Toaster } from 'sonner';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppLayout = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <>
      {!isLoginPage && <Sidebar />}
      <div className={!isLoginPage ? "ml-80 p-8" : ""}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Navigate to="/dashboard" />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/creators"
            element={
              <PrivateRoute>
                <Creators />
              </PrivateRoute>
            }
          />
          <Route
            path="/supporters"
            element={
              <PrivateRoute>
                <Supporters />
              </PrivateRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <PrivateRoute>
                <Transactions />
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
        </Routes>
      </div>
      <Toaster position="top-right" richColors />
    </>
  );
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <AppLayout />
      </div>
    </Router>
  );
}

export default App;