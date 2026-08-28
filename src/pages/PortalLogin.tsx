import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth';
import { Mail, Lock, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import logoImg from '@/assets/wcpl-logo.png';

export default function PortalLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect accordingly
  useEffect(() => {
    if (!authLoading && user) {
      if (profile) {
        if (profile.role === 'admin') {
          navigate('/portal/admin');
        } else {
          navigate('/portal/price-support');
        }
      } else {
        setErrorMsg('Authentication succeeded, but no database profile was found for this user. Please verify user creation metadata or run the setup SQL trigger.');
        setLoading(false);
      }
    }
  }, [user, profile, authLoading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during login');
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="light min-h-screen bg-slate-50 flex flex-col items-center justify-center text-foreground">
        <div className="w-10 h-10 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-display font-bold text-xs text-zinc-400 uppercase tracking-widest">
          Loading portal session...
        </p>
      </div>
    );
  }

  return (
    <div className="light min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 relative overflow-hidden font-sans">
      <div className="max-w-md w-full relative z-10">
        <div className="flex justify-center mb-8">
          <img src={logoImg} alt="Western Consolidated" className="h-20 w-auto" />
        </div>

        <Card className="bg-white border-border shadow-md">
          <CardHeader className="space-y-1">
            <CardTitle className="font-display text-lg font-bold text-foreground uppercase tracking-wide">
              Sign In
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {errorMsg && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg flex gap-2.5 items-start text-xs leading-relaxed">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-primary mt-0.5" />
                  <div>
                    <span className="font-bold">Authentication failed</span>
                    <p className="mt-0.5">{errorMsg}</p>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground-muted uppercase tracking-wider block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4.5 w-4.5 text-zinc-400" />
                  <Input
                    type="email"
                    placeholder="e.g. sales@westernconsolidated.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-white border-border text-foreground placeholder-zinc-400 focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground-muted uppercase tracking-wider block">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4.5 w-4.5 text-zinc-400" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-white border-border text-foreground placeholder-zinc-400 focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold tracking-wider uppercase transition-all duration-200 mt-2"
                disabled={loading}
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6 space-y-4">
          <a href="/" className="inline-flex items-center gap-1.5 text-xs text-foreground-muted hover:text-primary font-bold uppercase tracking-wider transition-colors">
            ← Back to Main Website
          </a>
          <p className="text-center text-xs text-zinc-400 font-sans">
            Authorized users only.
          </p>
        </div>
      </div>
    </div>
  );
}
