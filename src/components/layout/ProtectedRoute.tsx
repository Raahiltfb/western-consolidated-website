import { ReactNode } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRole?: 'admin' | 'dealer';
}

export const ProtectedRoute = ({ children, allowedRole }: ProtectedRouteProps) => {
  const { user, profile, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="light min-h-screen bg-slate-50 flex flex-col items-center justify-center text-foreground">
        <div className="w-10 h-10 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-display font-medium text-sm text-zinc-400 uppercase tracking-widest">
          Verifying Credentials...
        </p>
      </div>
    );
  }

  // If not logged in, redirect to login
  if (!user) {
    return <Navigate to="/portal/login" replace />;
  }

  // If authenticated but no profile record was found
  if (!profile) {
    return (
      <div className="light min-h-screen bg-slate-50 flex flex-col items-center justify-center text-foreground p-6">
        <div className="max-w-md w-full bg-white border border-border rounded-xl p-8 text-center shadow-md">
          <div className="text-primary font-bold text-5xl mb-4">⚠</div>
          <h1 className="font-display text-xl font-bold uppercase tracking-wider text-foreground mb-2">
            Profile Not Found
          </h1>
          <p className="text-foreground-muted text-sm mb-6 text-left leading-relaxed">
            Successfully authenticated via Supabase, but no database record was found in the `public.profiles` table.
            <br /><br />
            Please verify that:
            <ul className="list-disc pl-5 mt-2 space-y-1 text-zinc-400">
              <li>The user account was created with metadata containing user role (`admin` or `dealer`).</li>
              <li>The signup trigger from `supabase_setup.sql` has been executed on this database.</li>
            </ul>
          </p>
          <div className="flex justify-center mt-6">
            <button
              onClick={signOut}
              className="px-4 py-2 bg-primary hover:bg-primary/90 text-white font-semibold text-sm rounded-lg transition-colors"
            >
              Sign Out & Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If role is specified and does not match
  if (allowedRole && profile.role !== allowedRole) {
    if (profile.role === 'admin') {
      return <Navigate to="/portal/admin" replace />;
    } else {
      return (
        <div className="light min-h-screen bg-slate-50 flex flex-col items-center justify-center text-foreground p-6">
          <div className="max-w-md w-full bg-white border border-border rounded-xl p-8 text-center shadow-md">
            <div className="text-primary font-bold text-5xl mb-4">⚠</div>
            <h1 className="font-display text-xl font-bold uppercase tracking-wider text-foreground mb-2">
              Access Denied
            </h1>
            <p className="text-foreground-muted text-sm mb-6">
              You are signed in as a Dealer. You do not have permission to access the administrative dashboard.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                to="/portal/price-support"
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-white font-semibold text-sm rounded-lg transition-colors"
              >
                Price Support
              </Link>
              <Link
                to="/portal/order-support"
                className="px-4 py-2 bg-white hover:bg-slate-50 text-foreground font-semibold text-sm rounded-lg transition-colors border border-border"
              >
                Order Booking
              </Link>
            </div>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};
