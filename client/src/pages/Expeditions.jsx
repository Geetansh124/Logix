import { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import api from '../services/api';
import {
  Compass,
  Calendar,
  User,
  MapPin,
  Plus,
  FileText,
  Activity,
  Globe2,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';

export default function Expeditions() {
  const [expeditions, setExpeditions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/expeditions')
      .then((res) => setExpeditions(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statusVariants = {
    PLANNING: 'info',
    ACTIVE: 'success',
    COMPLETED: 'secondary',
    CANCELLED: 'destructive',
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Header
        title="Scientific Expeditions"
        subtitle="Planning, staging, and active polar mission rosters under the Indian Antarctic Programme"
      />
      <div className="p-8 space-y-6 max-w-7xl mx-auto">
        {/* Mission Directory Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Compass className="w-4 h-4 text-blue-600" />
              <span>Official Mission Directory</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              National Centre for Polar and Ocean Research (NCPOR) Scientific Expeditions
            </p>
          </div>
          <Badge variant="cyan" className="font-mono text-xs py-1 px-2.5">
            CYCLE: 2026-2027
          </Badge>
        </div>

        {/* Expeditions List */}
        {loading ? (
          <div className="text-center text-slate-500 py-24 text-xs">
            <Compass className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
            Loading expedition registry...
          </div>
        ) : expeditions.length === 0 ? (
          <Card className="p-12 text-center max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">No Expeditions Recorded</h3>
            <p className="text-xs text-slate-500 mt-1">
              Initialize the expedition database or register a new expedition plan.
            </p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {expeditions.map((exp) => (
              <Card key={exp.id} className="hover:shadow-md transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                          <Globe2 className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2.5">
                            <h3 className="text-base font-extrabold text-slate-900">{exp.name}</h3>
                            <Badge variant={statusVariants[exp.status] || 'info'} className="text-[10px] py-0 px-2 font-mono uppercase">
                              {exp.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-500">Ministry of Earth Sciences • Official Scientific Mission</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 font-medium pt-1">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-mono">{exp.start_date}</span> → <span className="font-mono">{exp.end_date}</span>
                        </span>
                        {exp.leader_name && (
                          <span className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            Expedition Leader: <strong className="text-slate-800">{exp.leader_name}</strong>
                          </span>
                        )}
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          Deployment Target: <span className="text-blue-700 font-semibold">Maitri & Bharati Stations</span>
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                        <FileText className="w-3.5 h-3.5" />
                        <span>Logistics Manifest</span>
                      </Button>
                    </div>
                  </div>

                  {exp.description && (
                    <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-600 leading-relaxed bg-slate-50/50 p-3 rounded-lg">
                      {exp.description}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
