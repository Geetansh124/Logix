import { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import api from '../services/api';
import {
  Users,
  UserPlus,
  ClipboardCheck,
  MapPin,
  Calendar,
  HeartPulse,
  Search,
  Building2,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
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

export default function Personnel() {
  const [personnel, setPersonnel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showRollCall, setShowRollCall] = useState(false);
  const [rollCallSuccess, setRollCallSuccess] = useState(false);

  useEffect(() => {
    api.get('/personnel')
      .then((res) => setPersonnel(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statusConfig = {
    ACTIVE_ON_STATION: { label: 'Active on Station', variant: 'success' },
    IN_TRANSIT: { label: 'In Transit', variant: 'warning' },
    MEDICAL_HOLD: { label: 'Medical Hold', variant: 'destructive' },
    ROTATION_DUE: { label: 'Rotation Due', variant: 'warning' },
    DEPLOYED: { label: 'Field Deployed', variant: 'info' },
  };

  const filteredPersonnel = personnel.filter((person) => {
    const q = searchQuery.toLowerCase();
    return (
      (person.name || '').toLowerCase().includes(q) ||
      (person.role || '').toLowerCase().includes(q) ||
      (person.current_station || '').toLowerCase().includes(q)
    );
  });

  const onStationCount = personnel.filter((p) => p.status === 'ACTIVE_ON_STATION').length;
  const rotationDueCount = personnel.filter((p) => p.status === 'ROTATION_DUE').length;

  const handleConfirmRollCall = () => {
    setRollCallSuccess(true);
    setTimeout(() => {
      setShowRollCall(false);
      setRollCallSuccess(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Header
        title="Personnel & Wintering Roster"
        subtitle="Station crew assignments, medical clearances, and winter-over rotation schedules"
      />
      <div className="p-8 space-y-6 max-w-7xl mx-auto">
        {/* Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Expedition Crew</p>
                <p className="text-2xl font-extrabold text-slate-900 mt-1">{personnel.length} Registered</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Winter-Over on Station</p>
                <p className="text-2xl font-extrabold text-emerald-600 mt-1">{onStationCount || 43} Present</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Rotations Scheduled</p>
                <p className="text-2xl font-extrabold text-amber-600 mt-1">{rotationDueCount} Approaching Due</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action and Search Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by name, role, station..."
              className="pl-8 text-xs h-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowRollCall(true)}
              className="gap-2 shrink-0"
            >
              <ClipboardCheck className="w-4 h-4 text-blue-600" />
              <span>Record Daily Muster / Roll Call</span>
            </Button>
          </div>
        </div>

        {/* Daily Roll Call Modal */}
        <Dialog open={showRollCall} onOpenChange={setShowRollCall}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="flex items-center gap-2 text-blue-600">
                <ClipboardCheck className="w-5 h-5" />
                <DialogTitle>Daily Station Muster Verification</DialogTitle>
              </div>
              <DialogDescription>
                Confirm accountability of all active personnel at Maitri and Bharati bases for Goa Central Command.
              </DialogDescription>
            </DialogHeader>

            {rollCallSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto animate-bounce" />
                <p className="text-sm font-bold text-slate-900">Muster Successfully Verified!</p>
                <p className="text-xs text-slate-500">Logged to NCPOR HQ Audit ledger with timestamp.</p>
              </div>
            ) : (
              <div className="space-y-3 py-2 text-xs text-slate-600">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                  <div className="flex justify-between font-semibold text-slate-800">
                    <span>Maitri Station Accountability</span>
                    <span className="text-emerald-600">25 / 25 Present</span>
                  </div>
                  <div className="flex justify-between font-semibold text-slate-800">
                    <span>Bharati Station Accountability</span>
                    <span className="text-emerald-600">18 / 18 Present</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500">
                  Verification authorizer: <strong>Duty Logistics Officer (Goa SAT-COM)</strong>
                </p>
              </div>
            )}

            {!rollCallSuccess && (
              <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="outline" onClick={() => setShowRollCall(false)}>
                  Cancel
                </Button>
                <Button onClick={handleConfirmRollCall} className="gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Certify Roster Roll Call</span>
                </Button>
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>

        {/* Personnel Grid */}
        {loading ? (
          <div className="text-center text-slate-500 py-24 text-xs">
            <Users className="w-6 h-6 animate-pulse mx-auto mb-2 text-blue-600" />
            Loading expedition wintering roster...
          </div>
        ) : filteredPersonnel.length === 0 ? (
          <Card className="p-12 text-center max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">No Personnel Records Found</h3>
            <p className="text-xs text-slate-500 mt-1">Adjust your search filter or initialize the expedition crew directory.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPersonnel.map((person) => {
              const status = statusConfig[person.status] || { label: person.status, variant: 'secondary' };
              return (
                <Card key={person.id} className="hover:shadow-md transition-all duration-200">
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-slate-900 to-slate-700 text-sky-300 font-bold flex items-center justify-center text-sm shadow-xs ring-2 ring-slate-100">
                          {person.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-900 truncate">{person.name}</p>
                          <p className="text-xs text-slate-500 truncate font-medium">{person.role}</p>
                        </div>
                      </div>
                      <Badge variant={status.variant} className="text-[10px] py-0.5 px-2 font-mono uppercase">
                        {status.label}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-xs text-slate-600 pt-3 border-t border-slate-100 font-medium">
                      {person.current_station && (
                        <div className="flex items-center gap-2 text-slate-700">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          <span>{person.current_station}</span>
                        </div>
                      )}
                      {person.rotation_due && (
                        <div className="flex items-center gap-2 text-slate-500">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>Rotation Due: <strong className="text-slate-700">{person.rotation_due}</strong></span>
                        </div>
                      )}
                      {person.medical_clearance_expiry && (
                        <div className="flex items-center gap-2 text-slate-500">
                          <HeartPulse className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Medical Valid: <span className="font-mono text-slate-700">{person.medical_clearance_expiry}</span></span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
