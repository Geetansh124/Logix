import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Compass,
  Ship,
  Boxes,
  Users,
  AlertTriangle,
  Wrench,
  LogOut,
  Radio,
  ShieldAlert,
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Mission Control', icon: LayoutDashboard },
  { path: '/expeditions', label: 'Expeditions', icon: Compass, badge: '44th' },
  { path: '/cargo', label: 'Cargo Tracking', icon: Ship, badge: 'Active' },
  { path: '/inventory', label: 'Inventory & Supplies', icon: Boxes },
  { path: '/personnel', label: 'Personnel & Roster', icon: Users, badge: '43' },
  { path: '/emergency', label: 'Emergency Center', icon: AlertTriangle, alert: true },
  { path: '/assets', label: 'Assets & Equipment', icon: Wrench },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-slate-950 text-slate-300 border-r border-slate-800 flex flex-col z-50 select-none shadow-xl">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 bg-slate-900/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-700 flex items-center justify-center text-white shadow-lg shadow-sky-900/40 ring-1 ring-white/20">
            <Radio className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-bold text-white tracking-tight truncate">Polar Operations</h1>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <p className="text-[10px] text-sky-400 font-semibold uppercase tracking-wider">NCPOR • MoES India</p>
          </div>
        </div>

        {/* Station link telemetry status */}
        <div className="mt-3.5 px-2.5 py-1.5 rounded-md bg-slate-900 border border-slate-800/80 flex items-center justify-between text-[11px]">
          <span className="text-slate-400 font-medium">Bases Telemetry</span>
          <span className="text-emerald-400 font-mono font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            2/2 Online
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Command Modules
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-950 font-semibold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-white' : item.alert ? 'text-amber-400' : 'text-slate-400 group-hover:text-sky-400'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded uppercase tracking-wider ${
                        isActive
                          ? 'bg-blue-700/80 text-white'
                          : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-slate-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {item.alert && !isActive && (
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/60">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-slate-700 to-slate-600 text-sky-200 flex items-center justify-center text-xs font-bold ring-1 ring-slate-600">
            {user?.name?.charAt(0) || 'O'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{user?.name || 'Station Commander'}</p>
            <p className="text-[10px] text-slate-400 truncate capitalize">
              {user?.role?.replace(/_/g, ' ').toLowerCase() || 'Duty Officer'}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 text-xs text-slate-400 hover:text-red-400 hover:bg-red-950/20 border border-slate-800 hover:border-red-900/40 transition-colors px-2.5 py-1.5 rounded-md font-medium cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Disconnect Session</span>
        </button>
      </div>
    </aside>
  );
}
