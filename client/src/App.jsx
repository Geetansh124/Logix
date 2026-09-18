import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Expeditions from './pages/Expeditions';
import CargoTracking from './pages/CargoTracking';
import Inventory from './pages/Inventory';
import Personnel from './pages/Personnel';
import Emergency from './pages/Emergency';
import Assets from './pages/Assets';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
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
