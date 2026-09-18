import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Expeditions from './pages/Expeditions';
import CargoTracking from './pages/CargoTracking';
import Inventory from './pages/Inventory';
import Personnel from './pages/Personnel';
import Emergency from './pages/Emergency';
import Assets from './pages/Assets';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading...</div>;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="expeditions" element={<Expeditions />} />
        <Route path="cargo" element={<CargoTracking />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="personnel" element={<Personnel />} />
        <Route path="emergency" element={<Emergency />} />
        <Route path="assets" element={<Assets />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
