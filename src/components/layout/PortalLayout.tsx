import { ReactNode, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, LayoutDashboard, Calculator, ShoppingBag, Key, Eye, EyeOff, ShieldAlert, CheckCircle2 } from 'lucide-react';
import logoImg from '@/assets/wcpl-logo.png';
import { supabase } from '@/lib/supabaseClient';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface PortalLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export const PortalLayout = ({ children, title, subtitle }: PortalLayoutProps) => {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  // Change Password States
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLogout = async () => {
    await signOut();
    navigate('/portal/login');
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('New passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
        current_password: currentPassword
      });

      if (error) {
        setErrorMsg(error.message);
        return;
      }

      setSuccessMsg('Your password has been changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      setTimeout(() => {
        setIsChangePasswordOpen(false);
        setSuccessMsg('');
      }, 2000);
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="light min-h-screen bg-slate-50 text-foreground flex flex-col font-sans">
      {/* Premium Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <NavLink to="/" className="flex items-center">
                <img
                  src={logoImg}
                  alt="Western Consolidated"
                  className="h-14 w-auto transition-opacity duration-300"
                />
              </NavLink>
              <div className="hidden sm:block h-8 w-px bg-zinc-200"></div>
              <span className="hidden sm:inline font-display text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
                Portals
              </span>
              <div className="hidden sm:block h-8 w-px bg-zinc-200"></div>
              <NavLink to="/" className="text-[11px] font-bold text-foreground-muted hover:text-primary uppercase tracking-wider transition-colors flex items-center gap-1">
                ← Back to Main Site
              </NavLink>
            </div>

            {/* Navigation links based on role */}
            <nav className="hidden md:flex items-center gap-1">
              {profile?.role === 'admin' ? (
                <NavLink
                  to="/portal/admin"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 text-[13px] font-display font-bold uppercase tracking-wider rounded-md transition-colors ${isActive
                      ? 'text-primary bg-primary/5 border-b-2 border-primary'
                      : 'text-foreground-muted hover:text-primary hover:bg-slate-100/50'
                    }`
                  }
                >
                  <LayoutDashboard size={14} />
                  Admin Dashboard
                </NavLink>
              ) : (
                <>
                  <NavLink
                    to="/portal/price-support"
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-4 py-2 text-[13px] font-display font-bold uppercase tracking-wider rounded-md transition-colors ${isActive
                        ? 'text-primary bg-primary/5 border-b-2 border-primary'
                        : 'text-foreground-muted hover:text-primary hover:bg-slate-100/50'
                      }`
                    }
                  >
                    <Calculator size={14} />
                    Price Support
                  </NavLink>
                  <NavLink
                    to="/portal/order-support"
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-4 py-2 text-[13px] font-display font-bold uppercase tracking-wider rounded-md transition-colors ${isActive
                        ? 'text-primary bg-primary/5 border-b-2 border-primary'
                        : 'text-foreground-muted hover:text-primary hover:bg-slate-100/50'
                      }`
                    }
                  >
                    <ShoppingBag size={14} />
                    Order Booking
                  </NavLink>
                </>
              )}
            </nav>

            {/* Profile & Logout Action */}
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden sm:block text-right">
                <div className="text-[13px] font-bold text-foreground">
                  {profile?.firm_name || profile?.email}
                </div>
                <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest font-display">
                  {profile?.role}
                </div>
              </div>
              <button
                onClick={() => setIsChangePasswordOpen(true)}
                className="p-2.5 text-zinc-400 hover:text-primary hover:bg-slate-100 rounded-lg transition-all"
                title="Change Password"
              >
                <Key size={16} />
              </button>
              <button
                onClick={handleLogout}
                className="p-2.5 text-zinc-400 hover:text-primary hover:bg-slate-100 rounded-lg transition-all"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden border-t border-border bg-white flex justify-around py-2.5 px-4 text-[10px] font-display font-bold uppercase tracking-wider shadow-sm">
          {profile?.role === 'admin' ? (
            <NavLink
              to="/portal/admin"
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-primary' : 'text-zinc-400'
                }`
              }
            >
              <LayoutDashboard size={14} />
              Admin
            </NavLink>
          ) : (
            <>
              <NavLink
                to="/portal/price-support"
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-primary' : 'text-zinc-400'
                  }`
                }
              >
                <Calculator size={14} />
                Price
              </NavLink>
              <NavLink
                to="/portal/order-support"
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-primary' : 'text-zinc-400'
                  }`
                }
              >
                <ShoppingBag size={14} />
                Order
              </NavLink>
            </>
          )}
        </div>
      </header>

      {/* Hero Banner Area */}
      <section className="bg-white border-b border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight text-foreground uppercase">
            {title}
          </h1>
          {subtitle && <p className="text-foreground-muted text-xs sm:text-sm mt-1">{subtitle}</p>}
        </div>
      </section>

      {/* Main Body Wrap */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-white py-6 text-center text-xs text-zinc-400 font-display">
        &copy; {new Date().getFullYear()} Western Consolidated Private Limited. All rights reserved.
      </footer>

      {/* Change Password Dialog Modal */}
      <Dialog open={isChangePasswordOpen} onOpenChange={setIsChangePasswordOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white border border-border shadow-lg rounded-lg p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground font-display uppercase tracking-wide">
              Change Password
            </DialogTitle>
            <DialogDescription className="text-zinc-500 text-xs mt-1">
              Update your account credentials. Secure password updates require verifying your current password.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handlePasswordUpdate} className="space-y-4 mt-4">
            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg flex gap-2.5 items-start text-xs leading-relaxed">
                <ShieldAlert className="w-4 h-4 shrink-0 text-primary mt-0.5" />
                <div>
                  <span className="font-bold">Error</span>
                  <p className="mt-0.5">{errorMsg}</p>
                </div>
              </div>
            )}

            {successMsg && (
              <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg flex gap-2.5 items-start text-xs leading-relaxed">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-green-600 mt-0.5" />
                <div>
                  <span className="font-bold">Success</span>
                  <p className="mt-0.5">{successMsg}</p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground-muted uppercase tracking-wider block">
                Current Password
              </label>
              <div className="relative">
                <Input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-600"
                >
                  {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground-muted uppercase tracking-wider block">
                New Password
              </label>
              <div className="relative">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-600"
                >
                  {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground-muted uppercase tracking-wider block">
                Confirm New Password
              </label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-600"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsChangePasswordOpen(false);
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Updating...' : 'Save Password'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
