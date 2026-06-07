import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import './index.css';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import UpdatePasswordPage from './pages/auth/UpdatePasswordPage';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminStoresPage from './pages/admin/AdminStoresPage';

// User pages
import UserStorePage from './pages/user/UserStorePage';

// Store owner pages
import OwnerDashboard from './pages/storeOwner/OwnerDashboard';

const RootRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
  if (user.role === 'STORE_OWNER') return <Navigate to="/owner" replace />;
  return <Navigate to="/stores" replace />;
};

const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="app-layout">
    <Navbar />
    <div className="page-content">{children}</div>
  </div>
);

const UnauthorizedPage = () => (
  <AppLayout>
    <div className="error-page">
      <h1>403</h1>
      <p>You don't have permission to access this page.</p>
      <Link to="/" className="btn btn-primary">Go Home</Link>
    </div>
  </AppLayout>
);

const NotFoundPage = () => (
  <AppLayout>
    <div className="error-page">
      <h1>404</h1>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn btn-primary">Go Home</Link>
    </div>
  </AppLayout>
);

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Admin routes */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <AppLayout><AdminDashboard /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <AppLayout><AdminUsersPage /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/admin/stores" element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <AppLayout><AdminStoresPage /></AppLayout>
        </ProtectedRoute>
      } />

      {/* Normal user routes */}
      <Route path="/stores" element={
        <ProtectedRoute allowedRoles={['NORMAL_USER']}>
          <AppLayout><UserStorePage /></AppLayout>
        </ProtectedRoute>
      } />

      {/* Store owner routes */}
      <Route path="/owner" element={
        <ProtectedRoute allowedRoles={['STORE_OWNER']}>
          <AppLayout><OwnerDashboard /></AppLayout>
        </ProtectedRoute>
      } />

      {/* Shared authenticated routes */}
      <Route path="/update-password" element={
        <ProtectedRoute allowedRoles={['NORMAL_USER', 'STORE_OWNER']}>
          <AppLayout><UpdatePasswordPage /></AppLayout>
        </ProtectedRoute>
      } />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
