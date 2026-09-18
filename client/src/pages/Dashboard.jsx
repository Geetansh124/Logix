import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import api from '../services/api';
import {
  Globe,
  Truck,
  Users,
  ShieldCheck,
  ClipboardCheck,
  Boxes,
  AlertTriangle,
  MapPin,
  ArrowUpRight,
  Wind,
  ThermometerSnowflake,
  Fuel,
  Activity,
  Compass,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';

const statCards = [
  {
    label: 'Active Expeditions',
    value: '1 Active',
    detail: '44th ISEA Expedition in operational phase',
    icon: Compass,
    iconBg: 'bg-blue-50 text-blue-600 border border-blue-200',
    trend: 'In Progress',
  },
  {
    label: 'Cargo Corridor',
    value: '3 Hubs',
    detail: 'Goa Port → Cape Town → Maitri Shelf',
    icon: Truck,
    iconBg: 'bg-amber-50 text-amber-600 border border-amber-200',
    trend: 'Vessel Steaming',
  },
  {
    label: 'Wintering Personnel',
    value: '43 Souls',
    detail: '25 at Maitri • 18 at Bharati Station',
    icon: Users,
    iconBg: 'bg-indigo-50 text-indigo-600 border border-indigo-200',
    trend: '100% Accounted',
  },
  {
    label: 'Station Health & Alerts',
    value: 'Nominal',
    detail: '0 Critical • All environmental sensors live',
    icon: ShieldCheck,
    iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
    trend: 'Level 0 Normal',
  },
];

function SupplyStatus({ name, percentage, days, level }) {
  const getLevelStyle = (lvl) => {
    switch (lvl) {
      case 'CRITICAL':
        return { badge: 'destructive', color: 'bg-red-600' };
      case 'WARNING':
        return { badge: 'warning', color: 'bg-amber-500' };
      case 'CAUTION':
        return { badge: 'warning', color: 'bg-yellow-500' };
      default:
        return { badge: 'info', color: 'bg-blue-600' };
    }
  };

  const style = getLevelStyle(level);

  return (
    <div className="space-y-2 p-3 rounded-lg bg-slate-50 border border-slate-100">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Fuel className="w-3.5 h-3.5 text-slate-500" />
          <span className="font-semibold text-slate-800">{name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-slate-500 text-[11px]">{days}d remaining</span>
          <Badge variant={style.badge} className="text-[10px] py-0 px-1.5 font-mono">
            {percentage}%
          </Badge>
        </div>
      </div>
      <Progress value={percentage} indicatorClassName={style.color} />
    </div>
  );
}

export default function Dashboard() {
  const [_stations, setStations] = useState([]);

  useEffect(() => {
    api.get('/stations').then((res) => setStations(res.data.data || [])).catch(() => {});
  }, []);

  const supplies = [
    { name: 'Diesel Fuel — Maitri Station', percentage: 75, days: 184, level: 'NORMAL' },
    { name: 'Medical Oxygen — Maitri Station', percentage: 40, days: 32, level: 'WARNING' },
    { name: 'Food Stores — Bharati Station', percentage: 85, days: 240, level: 'NORMAL' },
    { name: 'Diesel Fuel — Bharati Station', percentage: 60, days: 110, level: 'CAUTION' },
  ];

  const recentLogs = [
    { time: '14:32 IST', text: 'Cargo container NCPOR-C001 departed Goa Transshipment Hub', badge: 'info' },
    { time: '12:00 IST', text: 'Daily muster verified at Maitri Station — 25/25 present', badge: 'success' },
    { time: '09:15 IST', text: 'Generator diesel burn-rate anomaly flagged for review at Bharati', badge: 'warning' },
    { time: '08:00 IST', text: 'Morning station status sync completed with Goa Central HQ', badge: 'success' },
    { time: 'Yesterday', text: 'Medical oxygen supply reorder submitted to Cape Town logistics depot', badge: 'secondary' },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Header
        title="Mission Control Console"
        subtitle="National Centre for Polar and Ocean Research • Ministry of Earth Sciences"
      />

      <div className="p-8 space-y-6 max-w-7xl mx-auto">
        {/* KPI Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <Card key={card.label} className="hover:shadow-md transition-all duration-200">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{card.label}</p>
                      <p className="text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">{card.value}</p>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">{card.detail}</p>
                    </div>
                    <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center shrink-0 shadow-xs`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Telemetry</span>
                    <Badge variant="secondary" className="text-[10px] py-0 px-1.5">
                      {card.trend}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Operational Modules Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Operations Links */}
          <Card className="flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center justify-between">
                <span>Tactical Quick Links</span>
                <Activity className="w-4 h-4 text-slate-400" />
              </CardTitle>
              <CardDescription>Direct access to active operational pipelines</CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-3 space-y-2.5 flex-1">
              <Link
                to="/cargo"
                className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 transition-all group"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Truck className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 group-hover:text-blue-700">Cargo Vessel Tracking</p>
                  <p className="text-[11px] text-slate-500 truncate">Containers in transit across Antarctic corridor</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
              </Link>

              <Link
                to="/personnel"
                className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all group"
              >
                <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <ClipboardCheck className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 group-hover:text-indigo-700">Station Roll Call</p>
                  <p className="text-[11px] text-slate-500 truncate">Verify wintering personnel & medical readiness</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
              </Link>

              <Link
                to="/inventory"
                className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all group"
              >
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Boxes className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 group-hover:text-emerald-700">Inventory & Depletion</p>
                  <p className="text-[11px] text-slate-500 truncate">Station consumable runways & stockout forecasts</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
              </Link>

              <Link
                to="/emergency"
                className="flex items-center gap-3 p-3 rounded-lg border border-red-200 bg-red-50/30 hover:bg-red-50/80 transition-all group"
              >
                <div className="w-9 h-9 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shrink-0 group-hover:bg-red-600 group-hover:text-white transition-colors">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-red-950">Emergency Protocol Center</p>
                  <p className="text-[11px] text-red-600 truncate">Broadcast high-severity station alarm</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-red-500" />
              </Link>
            </CardContent>
          </Card>

          {/* Critical Supply Runway */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    Consumable Depletion Runways
                  </CardTitle>
                  <CardDescription>Live fuel & life-support reserves</CardDescription>
                </div>
                <Badge variant="cyan" className="text-[10px]">Real-Time</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-5 pt-3 space-y-3">
              {supplies.map((s) => (
                <SupplyStatus key={s.name} {...s} />
              ))}
            </CardContent>
          </Card>

          {/* Operational Audit Log */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Operational Audit Stream
              </CardTitle>
              <CardDescription>Real-time expedition log from Goa HQ</CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-3 space-y-3">
              {recentLogs.map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-xs p-2 rounded-md hover:bg-slate-50 transition-colors">
                  <span className="font-mono text-slate-400 shrink-0 w-16 text-[11px] pt-0.5">{item.time}</span>
                  <div className="flex-1">
                    <p className="text-slate-800 font-medium leading-relaxed">{item.text}</p>
                  </div>
                  <Badge variant={item.badge} className="text-[9px] py-0 px-1 font-mono uppercase shrink-0">
                    {item.badge}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Antarctic Research Stations Telemetry Cards */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-600" />
                  Antarctic Research Stations Telemetry
                </CardTitle>
                <CardDescription>
                  Direct satellite link to Indian Antarctic Programme Permanent Bases
                </CardDescription>
              </div>
              <Badge variant="success" className="text-[10px]">2 BASES LINKED</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-5 pt-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  name: 'Maitri Station',
                  region: 'Schirmacher Oasis, Queen Maud Land',
                  lat: '70°45′57″ S',
                  lng: '11°44′09″ E',
                  personnel: 25,
                  capacity: 65,
                  temp: '-24°C',
                  wind: '32 knots SSE',
                  status: 'Nominal',
                  power: '100% (Gen 2 & Solar)',
                },
                {
                  name: 'Bharati Station',
                  region: 'Larsemann Hills, East Antarctica',
                  lat: '69°24′28″ S',
                  lng: '76°11′14″ E',
                  personnel: 18,
                  capacity: 47,
                  temp: '-18°C',
                  wind: '19 knots E',
                  status: 'Nominal',
                  power: '100% (Gen 1 & Wind)',
                },
              ].map((station) => (
                <div
                  key={station.name}
                  className="p-5 rounded-xl border border-slate-200/80 bg-gradient-to-b from-white to-slate-50/60 shadow-xs space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-extrabold text-slate-900">{station.name}</h3>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      </div>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {station.region}
                      </p>
                    </div>
                    <Badge variant="success" className="text-xs">
                      {station.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-4 gap-2.5 pt-2 border-t border-slate-200/70 text-center">
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-2xs">
                      <p className="text-base font-bold text-slate-900">{station.personnel}</p>
                      <p className="text-[10px] uppercase font-semibold text-slate-400">Personnel</p>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-2xs">
                      <div className="flex items-center justify-center gap-1 text-sky-600">
                        <ThermometerSnowflake className="w-3.5 h-3.5" />
                        <span className="text-base font-bold">{station.temp}</span>
                      </div>
                      <p className="text-[10px] uppercase font-semibold text-slate-400">Ambient</p>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-2xs">
                      <div className="flex items-center justify-center gap-1 text-slate-800">
                        <Wind className="w-3 h-3 text-slate-400" />
                        <span className="text-xs font-bold font-mono">{station.wind}</span>
                      </div>
                      <p className="text-[10px] uppercase font-semibold text-slate-400 mt-0.5">Wind Speed</p>
                    </div>
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-2xs">
                      <p className="text-xs font-bold text-slate-800 font-mono mt-0.5">{station.lat}</p>
                      <p className="text-[10px] uppercase font-semibold text-slate-400 mt-0.5">Coordinates</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
