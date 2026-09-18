import { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import api from '../services/api';
import {
  Boxes,
  RefreshCw,
  AlertTriangle,
  Search,
  Building2,
  TrendingDown,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';

export default function Inventory() {
  const [projections, setProjections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStation, setSelectedStation] = useState('11111111-1111-1111-1111-111111111111');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchProjections = (stationId) => {
    setLoading(true);
    api.get(`/inventory/station/${stationId}/depletion-projections`)
      .then((res) => setProjections(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProjections(selectedStation);
  }, [selectedStation]);

  const alertBadgeVariants = {
    CRITICAL: 'destructive',
    WARNING: 'warning',
    CAUTION: 'warning',
    INFO: 'info',
    NORMAL: 'success',
  };

  const filteredProjections = projections.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      (item.itemName || '').toLowerCase().includes(q) ||
      (item.category || '').toLowerCase().includes(q)
    );
  });

  const criticalCount = projections.filter((p) => p.alertLevel === 'CRITICAL').length;
  const warningCount = projections.filter((p) => p.alertLevel === 'WARNING' || p.alertLevel === 'CAUTION').length;

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Header
        title="Inventory & Depletion Forecasts"
        subtitle="Consumables tracking, consumption rate modeling, and automated resupply trigger thresholds"
      />
      <div className="p-8 space-y-6 max-w-7xl mx-auto">
        {/* Metrics Overview Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Station Stock Items</p>
                <p className="text-2xl font-extrabold text-slate-900 mt-1">{projections.length} Monitored</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Boxes className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Critical Depletions</p>
                <p className="text-2xl font-extrabold text-red-600 mt-1">{criticalCount} Critical</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Resupply Alerts</p>
                <p className="text-2xl font-extrabold text-amber-600 mt-1">{warningCount} Approaching Trigger</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <TrendingDown className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Station Tabs and Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Tabs value={selectedStation} onValueChange={(val) => setSelectedStation(val)}>
            <TabsList>
              <TabsTrigger value="11111111-1111-1111-1111-111111111111" className="gap-2">
                <Building2 className="w-3.5 h-3.5" />
                <span>Maitri Station (Queen Maud Land)</span>
              </TabsTrigger>
              <TabsTrigger value="22222222-2222-2222-2222-222222222222" className="gap-2">
                <Building2 className="w-3.5 h-3.5" />
                <span>Bharati Station (Larsemann Hills)</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search stock consumables..."
                className="pl-8 text-xs h-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchProjections(selectedStation)}
              className="gap-1.5 shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Recalculate Runway</span>
            </Button>
          </div>
        </div>

        {/* Depletion Projections Table */}
        <Card className="overflow-hidden">
          <CardHeader className="p-5 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Stock Depletion & Runway Telemetry
              </CardTitle>
              <CardDescription>
                Rolling 30-day linear burn rate model cross-referenced against minimum winter threshold
              </CardDescription>
            </div>
            <Badge variant="cyan" className="text-[10px]">
              MODEL: POLAR-BURN V3
            </Badge>
          </CardHeader>

          {loading ? (
            <div className="p-16 text-center text-xs text-slate-500">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
              Calculating inventory runway from station sensors...
            </div>
          ) : filteredProjections.length === 0 ? (
            <div className="p-16 text-center text-xs text-slate-500 space-y-1">
              <Boxes className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="font-semibold text-slate-800">No inventory stock records found</p>
              <p className="text-slate-400">Try switching stations or clearing your search filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50/80 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3.5 text-[11px] font-bold text-slate-600 uppercase tracking-wider">Item Description</th>
                    <th className="px-6 py-3.5 text-[11px] font-bold text-slate-600 uppercase tracking-wider">Classification</th>
                    <th className="px-6 py-3.5 text-[11px] font-bold text-slate-600 uppercase tracking-wider text-right">Available Stock</th>
                    <th className="px-6 py-3.5 text-[11px] font-bold text-slate-600 uppercase tracking-wider text-right">Burn Rate</th>
                    <th className="px-6 py-3.5 text-[11px] font-bold text-slate-600 uppercase tracking-wider text-right">Days of Runway</th>
                    <th className="px-6 py-3.5 text-[11px] font-bold text-slate-600 uppercase tracking-wider text-center">Alert Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white text-xs">
                  {filteredProjections.map((item) => {
                    const isLow = item.daysRemaining < 30;
                    return (
                      <tr key={item.itemId} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4 font-semibold text-slate-900">
                          <div className="flex items-center gap-2">
                            <span>{item.itemName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-500">
                          <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px]">
                            {item.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-mono font-medium text-slate-800">
                          {item.currentStock.toLocaleString()} <span className="text-slate-400 text-[11px]">{item.unit}</span>
                        </td>
                        <td className="px-6 py-4 text-right font-mono text-slate-600">
                          {item.dailyConsumption} <span className="text-slate-400 text-[11px]">{item.unit}/day</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span
                            className={`font-mono font-bold text-sm ${
                              isLow ? 'text-red-600 bg-red-50 px-2 py-0.5 rounded' : 'text-slate-800'
                            }`}
                          >
                            {item.daysRemaining} days
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <Badge
                            variant={alertBadgeVariants[item.alertLevel] || 'secondary'}
                            className="text-[10px] py-0.5 px-2 font-mono"
                          >
                            {item.alertLevel}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
