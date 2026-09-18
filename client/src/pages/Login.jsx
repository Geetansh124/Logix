import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Radio, Lock, Mail, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

export default function Login() {
  const [email, setEmail] = useState('admin@ncpor.gov.in');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Invalid credentials or connection failed');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (demoRole) => {
    if (demoRole === 'admin') {
      setEmail('admin@ncpor.gov.in');
      setPassword('admin123');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-slate-100 selection:bg-sky-500 selection:text-white relative overflow-hidden">
      {/* Background Decorative Polar Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-sky-500/10 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-blue-600/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10 space-y-3">
        {/* Crest / Emblem */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-700 flex items-center justify-center text-white shadow-xl shadow-sky-900/40 ring-1 ring-white/20 mb-2">
          <Radio className="w-8 h-8 text-white animate-pulse" />
        </div>
        <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
          Polar Expedition Operations
        </h1>
        <div className="flex items-center justify-center gap-2">
          <Badge variant="cyan" className="text-[10px] uppercase font-mono">
            SECURE SAT-COM GATEWAY
          </Badge>
        </div>
        <p className="text-xs text-sky-200/80 font-medium">
          National Centre for Polar and Ocean Research (NCPOR)
        </p>
        <p className="text-[11px] text-slate-400">
          Ministry of Earth Sciences • Government of India
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Card className="bg-white/95 backdrop-blur-md border-slate-700/60 shadow-2xl">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold text-slate-900">Operator Sign In</CardTitle>
              <ShieldCheck className="w-5 h-5 text-sky-600" />
            </div>
            <CardDescription>Enter authorized credentials to access station command console</CardDescription>
          </CardHeader>

          <CardContent className="p-6 pt-2">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Official Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9 text-slate-900"
                    placeholder="name@ncpor.gov.in"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Security Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 text-slate-900"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="polar"
                  size="lg"
                  disabled={loading}
                  className="w-full gap-2 font-bold"
                >
                  <span>{loading ? 'Verifying Satellite Authorization...' : 'Access Command Console'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Demo Credentials Quick-Fill */}
              <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col items-center gap-2">
                <p className="text-[11px] text-slate-500 font-medium">Testing with Demo Station Account?</p>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => handleFillDemo('admin')}
                  className="w-full text-xs font-mono gap-2 text-slate-700 hover:text-blue-700"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Use: admin@ncpor.gov.in / admin123</span>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
