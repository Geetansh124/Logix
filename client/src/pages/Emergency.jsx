import { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import api from '../services/api';
import { getSocket } from '../services/socket';
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Clock,
  User,
  Radio,
  Zap,
  Flame,
  Wind,
} from 'lucide-react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../components/ui/dialog';

export default function Emergency() {
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTrigger, setShowTrigger] = useState(false);
  const [triggerForm, setTriggerForm] = useState({
    stationId: '11111111-1111-1111-1111-111111111111',
    level: 'LEVEL_3_ADVISORY',
    type: '',
    description: '',
  });

  useEffect(() => {
    api.get('/emergencies/station/11111111-1111-1111-1111-111111111111')
      .then((res) => setEmergencies(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));

    // Listen for real-time emergency broadcasts
    const socket = getSocket();
    if (socket) {
      socket.emit('subscribe:emergency', { stationId: '11111111-1111-1111-1111-111111111111' });
      socket.on('emergency:broadcast', (data) => {
        setEmergencies((prev) => [data, ...prev]);
      });
    }

    return () => {
      if (socket) {
        socket.off('emergency:broadcast');
      }
    };
  }, []);

  const triggerEmergency = async () => {
    try {
      const res = await api.post(`/emergencies/station/${triggerForm.stationId}`, {
        level: triggerForm.level,
        type: triggerForm.type,
        description: triggerForm.description,
      });
      if (res.data?.data) {
        setEmergencies((prev) => [res.data.data, ...prev]);
      }
      setShowTrigger(false);
      setTriggerForm({ ...triggerForm, type: '', description: '' });
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Failed to trigger emergency');
    }
  };

  const levelStyles = {
    LEVEL_1_CRITICAL: {
      label: 'Level 1 — Critical Disaster / Evacuation',
      badge: 'destructive',
      card: 'border-l-4 border-l-red-600 bg-red-50/30',
      icon: Flame,
    },
    LEVEL_2_SERIOUS: {
      label: 'Level 2 — Serious Operational Hazard',
      badge: 'warning',
      card: 'border-l-4 border-l-amber-500 bg-amber-50/30',
      icon: AlertTriangle,
    },
    LEVEL_3_ADVISORY: {
      label: 'Level 3 — Advisory / Weather Warning',
      badge: 'info',
      card: 'border-l-4 border-l-blue-600 bg-blue-50/30',
      icon: Wind,
    },
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Header
        title="Emergency Response & Incident Command"
        subtitle="High-priority incident dispatch, automated personnel muster, and critical supply preservation"
      />
      <div className="p-8 space-y-6 max-w-7xl mx-auto">
        {/* Incident Command Banner */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-5 rounded-xl bg-slate-900 text-white border border-slate-800 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/30 border border-red-500/40 text-red-400 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                  Active Incident Dispatch Console
                </h2>
                <Badge variant="destructive" className="text-[10px] uppercase font-mono">
                  PRIORITY 0 LINK
                </Badge>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time emergency broadcast pipeline synced between Maitri, Bharati, and Goa Central HQ
              </p>
            </div>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowTrigger(true)}
            className="gap-2 shrink-0 font-bold"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Broadcast Emergency Protocol</span>
          </Button>
        </div>

        {/* Emergency Trigger Radix Modal Dialog */}
        <Dialog open={showTrigger} onOpenChange={setShowTrigger}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <div className="flex items-center gap-2 text-red-600">
                <ShieldAlert className="w-5 h-5" />
                <DialogTitle className="text-base text-red-950">Initiate Emergency Incident Alert</DialogTitle>
              </div>
              <DialogDescription>
                Broadcasting this alert triggers immediate station-wide alarms, locks non-essential fuel lines, and captures crew roll-call snapshots.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Target Polar Station
                </label>
                <select
                  value={triggerForm.stationId}
                  onChange={(e) => setTriggerForm({ ...triggerForm, stationId: e.target.value })}
                  className="flex h-9 w-full rounded-md border border-slate-300 bg-white px-3 py-1 text-sm shadow-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                >
                  <option value="11111111-1111-1111-1111-111111111111">Maitri Station (Queen Maud Land)</option>
                  <option value="22222222-2222-2222-2222-222222222222">Bharati Station (Larsemann Hills)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Severity Tier
                </label>
                <select
                  value={triggerForm.level}
                  onChange={(e) => setTriggerForm({ ...triggerForm, level: e.target.value })}
                  className="flex h-9 w-full rounded-md border border-slate-300 bg-white px-3 py-1 text-sm shadow-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                >
                  <option value="LEVEL_3_ADVISORY">Level 3 — Advisory (Severe Blizzard / Communications Lag)</option>
                  <option value="LEVEL_2_SERIOUS">Level 2 — Serious (Main Generator Failure / Cold Exposure)</option>
                  <option value="LEVEL_1_CRITICAL">Level 1 — Critical (Habitation Threat / Medical Evacuation)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Incident Classification
                </label>
                <Input
                  value={triggerForm.type}
                  onChange={(e) => setTriggerForm({ ...triggerForm, type: e.target.value })}
                  placeholder="e.g., Extreme Katabatic Storm, Generator Outage, Frostbite Trauma"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Situation Synopsis & Immediate Action
                </label>
                <Input
                  value={triggerForm.description}
                  onChange={(e) => setTriggerForm({ ...triggerForm, description: e.target.value })}
                  placeholder="Brief synopsis for Goa Central Mission Control..."
                  required
                />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setShowTrigger(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={triggerEmergency}>
                Broadcast Alert Now
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Emergency List */}
        {loading ? (
          <div className="text-center text-slate-500 py-24 text-xs space-y-2">
            <Radio className="w-6 h-6 animate-pulse mx-auto text-blue-600" />
            <p>Connecting to secure emergency satellite telemetry...</p>
          </div>
        ) : emergencies.length === 0 ? (
          <Card className="p-12 text-center max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">All Stations Operational & Nominal</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              No active emergency dispatches or high-priority environmental alarms registered. Both Maitri and Bharati report nominal status.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {emergencies.map((em, i) => {
              const style = levelStyles[em.level] || levelStyles.LEVEL_3_ADVISORY;
              const Icon = style.icon;
              return (
                <Card key={em.id || i} className={`p-6 ${style.card} shadow-xs`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <Badge variant={style.badge} className="text-xs py-0.5 px-2 font-bold uppercase">
                        {style.label}
                      </Badge>
                    </div>
                    <span className="text-xs text-slate-500 font-mono flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {em.triggered_at ? new Date(em.triggered_at).toLocaleString('en-IN') : 'Active Now'}
                    </span>
                  </div>

                  <div className="flex items-start gap-3 mt-2">
                    <div className="w-8 h-8 rounded-lg bg-white/80 border border-slate-200 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-slate-700" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-bold text-slate-900">{em.type}</h3>
                      <p className="text-xs text-slate-700 mt-1 leading-relaxed">{em.description}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 mt-4 pt-3 border-t border-slate-200/60 font-medium">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      Authorizing Officer: <strong className="text-slate-700">{em.triggered_by || em.triggeredBy || 'Station Leader'}</strong>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-500" />
                      Dispatch Relay: <span className="font-mono text-slate-700">Goa Satellite Ground Station</span>
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
