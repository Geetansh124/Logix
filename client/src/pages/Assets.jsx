import { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import api from '../services/api';
import {
  Wrench,
  Search,
  MapPin,
  CheckCircle,
  Layers,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';

export default function Assets() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    api.get('/assets')
      .then((res) => setAssets(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statusVariants = {
    ACTIVE: 'success',
    IN_MAINTENANCE: 'warning',
    DECOMMISSIONED: 'destructive',
    IN_TRANSIT: 'info',
  };

  const filteredAssets = assets.filter((asset) => {
    const q = searchQuery.toLowerCase();
    return (
      (asset.name || '').toLowerCase().includes(q) ||
      (asset.asset_id || '').toLowerCase().includes(q) ||
      (asset.type || '').toLowerCase().includes(q) ||
      (asset.category || '').toLowerCase().includes(q) ||
      (asset.station?.name || '').toLowerCase().includes(q)
    );
  });

  const activeCount = assets.filter((a) => a.status === 'ACTIVE').length;
  const maintenanceCount = assets.filter((a) => a.status === 'IN_MAINTENANCE').length;

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Header
        title="Assets & Field Equipment"
        subtitle="Heavy tracked machinery, scientific instrumentation, life-support generators, and lifecycle audits"
      />
      <div className="p-8 space-y-6 max-w-7xl mx-auto">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Deployed Assets</p>
                <p className="text-2xl font-extrabold text-slate-900 mt-1">{assets.length} Units</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Fully Operational</p>
                <p className="text-2xl font-extrabold text-emerald-600 mt-1">{activeCount} Ready</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Under Maintenance</p>
                <p className="text-2xl font-extrabold text-amber-600 mt-1">{maintenanceCount} Servicing</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Wrench className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search & Actions Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search machinery, asset ID, station..."
              className="pl-8 text-xs h-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Badge variant="cyan" className="text-xs py-1 px-2.5 font-mono">
            FLEET STATUS: MONITORED
          </Badge>
        </div>

        {/* Asset Table */}
        <Card className="overflow-hidden">
          <CardHeader className="p-5 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Heavy Machinery & Instrument Registry
              </CardTitle>
              <CardDescription>
                Movable polar transport vehicles, ice-core drills, and fixed station life-support generators
              </CardDescription>
            </div>
            <span className="text-xs font-mono text-slate-400">{filteredAssets.length} Records</span>
          </CardHeader>

          {loading ? (
            <div className="text-center text-slate-500 py-24 text-xs">
              <Wrench className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
              Querying asset database...
            </div>
          ) : filteredAssets.length === 0 ? (
            <div className="p-16 text-center text-xs text-slate-500 space-y-1">
              <Wrench className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="font-semibold text-slate-800">No equipment matching query</p>
              <p className="text-slate-400">Try adjusting search terms or register new field equipment.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3.5 text-[11px] font-bold text-slate-600 uppercase tracking-wider">Asset Code</th>
                    <th className="px-6 py-3.5 text-[11px] font-bold text-slate-600 uppercase tracking-wider">Equipment Name</th>
                    <th className="px-6 py-3.5 text-[11px] font-bold text-slate-600 uppercase tracking-wider">Classification</th>
                    <th className="px-6 py-3.5 text-[11px] font-bold text-slate-600 uppercase tracking-wider">Station Deployment</th>
                    <th className="px-6 py-3.5 text-[11px] font-bold text-slate-600 uppercase tracking-wider text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredAssets.map((asset) => (
                    <tr key={asset.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-blue-700">{asset.asset_id}</td>
                      <td className="px-6 py-4 font-bold text-slate-900">{asset.name}</td>
                      <td className="px-6 py-4 text-slate-500">
                        <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px] font-medium">
                          {asset.type} • {asset.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-700">
                        <span className="flex items-center gap-1.5 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {asset.station?.name || 'In Transit'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Badge
                          variant={statusVariants[asset.status] || 'info'}
                          className="text-[10px] py-0.5 px-2 font-mono uppercase"
                        >
                          {asset.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
