import { useState, useEffect } from 'react';
import { Activity, Clock, ShieldCheck, Wifi } from 'lucide-react';
import { Badge } from '../ui/badge';

export default function Header({ title, subtitle }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between px-8 py-4 border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-40 gap-3">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
          <Badge variant="cyan" className="text-[10px] py-0 px-2">LIVE FEED</Badge>
        </div>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5 font-medium">{subtitle}</p>}
      </div>

      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        {/* Satellite Link Status */}
        <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-medium text-slate-600">
          <Wifi className="w-3.5 h-3.5 text-emerald-500" />
          <span className="font-mono text-[11px]">SAT-COM: NOMINAL</span>
        </div>

        {/* Dual Timezone Clocks */}
        <div className="flex items-center gap-3 text-xs font-mono bg-slate-900 text-slate-100 px-3 py-1.5 rounded-lg shadow-xs border border-slate-800">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-[10px] text-slate-400 font-sans font-bold">IST:</span>
            <span className="font-semibold text-white tracking-wider">
              {currentTime.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
          <div className="h-3 w-px bg-slate-700" />
          <div>
            <span className="text-[10px] text-sky-400 font-sans font-bold mr-1">MAWT:</span>
            <span className="font-semibold text-sky-200 tracking-wider">
              {currentTime.toLocaleTimeString('en-US', { timeZone: 'Antarctica/Mawson', hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
