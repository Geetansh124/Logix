import { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import api from '../services/api';
import {
  Ship,
  Package,
  ArrowRight,
  Search,
  Anchor,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';

export default function CargoTracking() {
  const [cargo, setCargo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Attempt to load cargo for the demo expedition
    api.get('/cargo/expedition/33333333-3333-3333-3333-333333333333')
      .then((res) => setCargo(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statusVariants = {
    CONSOLIDATED: 'info',
    IN_TRANSIT: 'warning',
    AT_TRANSSHIPMENT: 'warning',
    DELIVERED: 'success',
    RECEIVED: 'success',
    DAMAGED: 'destructive',
  };

  const filteredCargo = cargo.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      (item.container?.container_id || '').toLowerCase().includes(query) ||
      (item.description || '').toLowerCase().includes(query) ||
      (item.origin_hub || '').toLowerCase().includes(query) ||
      (item.destination_hub || '').toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Header
        title="Cargo & Stowage Logistics"
        subtitle="End-to-end multi-modal tracking: Goa HQ → Cape Town Hub → Antarctic Shelf"
      />
      <div className="p-8 space-y-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tracking Map / Hub Pipeline */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="min-h-[520px] flex flex-col justify-between">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                      <Ship className="w-4 h-4" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-900">
                        Polar Maritime Supply Corridor
                      </CardTitle>
                      <CardDescription>Multi-modal transshipment & polar ice-shelf navigation</CardDescription>
                    </div>
                  </div>
                  <Badge variant="cyan" className="text-[10px]">CORRIDOR ACTIVE</Badge>
                </div>
              </CardHeader>

              {/* Schematic Corridor Flow */}
              <CardContent className="py-8 px-6 my-auto">
                <div className="relative">
                  <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-amber-400 to-sky-600 -translate-y-1/2 rounded-full hidden sm:block opacity-30" />
                  <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    {/* Step 1 */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-2 hover:shadow-md transition-all">
                      <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center mx-auto text-xs shadow-2xs">
                        1
                      </div>
                      <p className="text-sm font-bold text-slate-900">NCPOR Goa Depot</p>
                      <p className="text-xs text-slate-500">Origin Logistics Port (India)</p>
                      <Badge variant="success" className="text-[10px] mt-1">
                        Consolidated
                      </Badge>
                      <p className="text-[11px] text-slate-400 font-mono">15°24′N 73°49′E</p>
                    </div>

                    {/* Step 2 */}
                    <div className="bg-white p-5 rounded-xl border-2 border-sky-400 shadow-md space-y-2 ring-4 ring-sky-50 transition-all">
                      <div className="w-9 h-9 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center mx-auto text-xs shadow-xs">
                        2
                      </div>
                      <p className="text-sm font-bold text-slate-900">Cape Town Port</p>
                      <p className="text-xs text-slate-500">Primary Transshipment Hub</p>
                      <Badge variant="warning" className="text-[10px] mt-1">
                        Vessel Loading
                      </Badge>
                      <p className="text-[11px] text-slate-400 font-mono">33°55′S 18°25′E</p>
                    </div>

                    {/* Step 3 */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-2 hover:shadow-md transition-all">
                      <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center mx-auto text-xs shadow-2xs">
                        3
                      </div>
                      <p className="text-sm font-bold text-slate-900">Priboy / Maitri Shelf</p>
                      <p className="text-xs text-slate-500">Antarctic Fast-Ice Delivery</p>
                      <Badge variant="outline" className="text-[10px] mt-1">
                        ETA: Day 18
                      </Badge>
                      <p className="text-[11px] text-slate-400 font-mono">70°45′S 11°44′E</p>
                    </div>
                  </div>
                </div>
              </CardContent>

              {/* Active Vessel Telemetry Banner */}
              <div className="p-4 m-5 rounded-xl bg-slate-900 text-slate-200 border border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-sky-900/60 text-sky-400 flex items-center justify-center">
                      <Anchor className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Vessel MV Vasiliy Golovnin</p>
                      <p className="text-[11px] text-slate-400">Chartered Ice-Class ARC7 Expedition Vessel</p>
                    </div>
                  </div>
                  <Badge variant="cyan" className="text-[10px] w-fit font-mono">
                    COURSE: 174° SSE • 12.8 KTS
                  </Badge>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800 text-[11px]">
                  <div>
                    <span className="text-slate-500 block">Current Leg:</span>
                    <span className="text-white font-medium">Cape Town → Prydz Bay</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Stowage Load:</span>
                    <span className="text-white font-mono">82% Capacity (42 Containers)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Reefer Temp:</span>
                    <span className="text-emerald-400 font-mono">-22°C Monitored</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Sea State:</span>
                    <span className="text-sky-300 font-medium">Roaring Forties (Moderate)</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Cargo Manifest List */}
          <Card className="flex flex-col max-h-[620px]">
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-blue-600" />
                  <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    Cargo Manifest
                  </CardTitle>
                </div>
                <Badge variant="secondary" className="font-mono text-xs">
                  {filteredCargo.length} Items
                </Badge>
              </div>
              <div className="pt-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Search containers or items..."
                    className="pl-8 text-xs h-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-4 space-y-3 overflow-y-auto flex-1">
              {loading ? (
                <p className="text-xs text-slate-500 text-center py-12">Loading container manifest...</p>
              ) : filteredCargo.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 space-y-1">
                  <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="font-medium text-slate-700">No cargo records found</p>
                  <p className="text-[11px] text-slate-400">Try adjusting your search filter.</p>
                </div>
              ) : (
                filteredCargo.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-lg border border-slate-200 bg-white hover:border-blue-300 hover:shadow-xs transition-all space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-extrabold text-blue-700">
                        {item.container?.container_id || 'CONT-UNASSIGNED'}
                      </span>
                      <Badge variant={statusVariants[item.status] || 'info'} className="text-[10px] py-0 px-1.5">
                        {item.status}
                      </Badge>
                    </div>

                    <p className="text-xs font-semibold text-slate-800 leading-snug">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
                      <Badge
                        variant={item.priority === 'P0' ? 'destructive' : item.priority === 'P1' ? 'warning' : 'secondary'}
                        className="text-[10px] py-0 px-1.5 font-mono"
                      >
                        Priority {item.priority}
                      </Badge>
                      <span className="text-slate-500 font-mono text-[11px]">
                        Bay #{item.stowage_order || '1'}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 flex items-center justify-between font-mono bg-slate-50 px-2 py-1 rounded">
                      <span className="truncate">{item.origin_hub}</span>
                      <ArrowRight className="w-3 h-3 text-slate-400 mx-1 shrink-0" />
                      <span className="truncate text-slate-700 font-semibold">{item.destination_hub}</span>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
