import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { Calculator, CheckCircle2, AlertTriangle, XCircle, ArrowRight, History, RefreshCcw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { sortRatings, cleanSalesRepName } from '@/lib/utils';

let cachedRatings: RatingOption[] | null = null;
const formatINR = (n: number | string) => {
  const num = Number(n);
  return isNaN(num) ? '' : '₹' + num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

interface RatingOption {
  kva: string;
}

interface PriceSubmission {
  id: string;
  created_at: string;
  kva: string;
  customer_name: string;
  dealer_name: string;
  sales_rep: string;
  offered_price: number;
  verdict: 'APPROVED' | 'REFER' | 'NOT_POSSIBLE';
}

export default function PriceSupportPortal() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [ratings, setRatings] = useState<RatingOption[]>([]);
  const [kva, setKva] = useState('');
  const [customer, setCustomer] = useState('');
  const [dealerName, setDealerName] = useState('');
  const [price, setPrice] = useState('');
  const [loadingRatings, setLoadingRatings] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // History state
  const [history, setHistory] = useState<PriceSubmission[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Sales Rep is locked and auto-populated from authenticated profile/account identity
  const salesRep = cleanSalesRepName(profile?.firm_name || profile?.email || '');

  // Verdict state
  const [verdict, setVerdict] = useState<'APPROVED' | 'REFER' | 'NOT_POSSIBLE' | null>(null);
  const [refId, setRefId] = useState('');

  // Confirmation step/modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Load session storage state on mount
  useEffect(() => {
    const storedKva = sessionStorage.getItem('wcpl_price_kva');
    const storedCustomer = sessionStorage.getItem('wcpl_price_customer');
    const storedDealer = sessionStorage.getItem('wcpl_price_dealer');
    const storedPrice = sessionStorage.getItem('wcpl_price_price');
    if (storedKva) setKva(storedKva);
    if (storedCustomer) setCustomer(storedCustomer);
    if (storedDealer) setDealerName(storedDealer);
    if (storedPrice) setPrice(storedPrice);
  }, []);

  // Sync to sessionStorage
  useEffect(() => {
    if (kva) {
      sessionStorage.setItem('wcpl_price_kva', kva);
    } else {
      sessionStorage.removeItem('wcpl_price_kva');
    }
  }, [kva]);

  useEffect(() => {
    if (customer) {
      sessionStorage.setItem('wcpl_price_customer', customer);
    } else {
      sessionStorage.removeItem('wcpl_price_customer');
    }
  }, [customer]);

  useEffect(() => {
    if (dealerName) {
      sessionStorage.setItem('wcpl_price_dealer', dealerName);
    } else {
      sessionStorage.removeItem('wcpl_price_dealer');
    }
  }, [dealerName]);

  useEffect(() => {
    if (price) {
      sessionStorage.setItem('wcpl_price_price', price);
    } else {
      sessionStorage.removeItem('wcpl_price_price');
    }
  }, [price]);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const { data, error } = await supabase
        .from('price_submissions')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setHistory(data || []);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Fetch ratings from the secure view & dealer history
  useEffect(() => {
    async function fetchRatings() {
      if (cachedRatings) {
        setRatings(cachedRatings);
        setLoadingRatings(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('active_ratings')
          .select('kva')
          .order('kva');

        if (error) throw error;
        const sorted = sortRatings(data || []);
        cachedRatings = sorted;
        setRatings(sorted);
      } catch (err) {
        console.error('Failed to load ratings:', err);
      } finally {
        setLoadingRatings(false);
      }
    }

    fetchRatings();
    fetchHistory();
  }, []);

  const handlePreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kva || !customer.trim() || !price || Number(price) <= 0) return;
    setShowConfirmModal(true);
  };

  const executeSubmit = async () => {
    setSubmitting(true);
    try {
      const { data, error } = await supabase.rpc('submit_price_support', {
        p_kva: kva,
        p_customer_name: customer.trim(),
        p_dealer_name: dealerName.trim(),
        p_offered_price: Number(price),
      });

      if (error) throw error;

      if (data) {
        setVerdict(data.verdict);
        setRefId(data.ref);
        // Clear persistence upon successful submission
        sessionStorage.removeItem('wcpl_price_kva');
        sessionStorage.removeItem('wcpl_price_customer');
        sessionStorage.removeItem('wcpl_price_price');
        fetchHistory();
      }
    } catch (err) {
      console.error('Error submitting price support:', err);
      alert('Failed to submit price support. Please verify database connection.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setVerdict(null);
    setKva('');
    setCustomer('');
    setPrice('');
    setRefId('');
    sessionStorage.removeItem('wcpl_price_kva');
    sessionStorage.removeItem('wcpl_price_customer');
    sessionStorage.removeItem('wcpl_price_price');
  };

  return (
    <PortalLayout title="Pricing Support Portal">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="max-w-xl mx-auto">
          {verdict ? (
            <Card className="bg-white border-border overflow-hidden shadow-md relative">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-primary"></div>
              <CardHeader className="text-center pt-8">
                <div className="flex justify-center mb-4">
                  {verdict === 'APPROVED' && (
                    <CheckCircle2 className="w-16 h-16 text-emerald-600 bg-emerald-50 rounded-full p-2 border border-emerald-200" />
                  )}
                  {verdict === 'REFER' && (
                    <AlertTriangle className="w-16 h-16 text-amber-600 bg-amber-50 rounded-full p-2 border border-amber-200" />
                  )}
                  {verdict === 'NOT_POSSIBLE' && (
                    <XCircle className="w-16 h-16 text-red-600 bg-red-50 rounded-full p-2 border border-red-200" />
                  )}
                </div>
                <CardTitle className="font-display font-extrabold text-2xl uppercase tracking-wider text-foreground">
                  {verdict === 'APPROVED' && 'Quotation Approved'}
                  {verdict === 'REFER' && 'Refer to Management'}
                  {verdict === 'NOT_POSSIBLE' && 'Quotation Rejected'}
                </CardTitle>
                <CardDescription className="text-foreground-muted text-sm mt-2 max-w-sm mx-auto leading-relaxed">
                  {verdict === 'APPROVED' && 'This price is within auto-approval limits. You may proceed with order booking.'}
                  {verdict === 'REFER' && 'This price requires management sign-off. Please contact the office before committing.'}
                  {verdict === 'NOT_POSSIBLE' && 'This price cannot be offered at any level. Please revise the quote.'}
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 py-4">
                <div className="bg-slate-50 border border-border rounded-xl p-6 text-center space-y-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block">
                      Submission Reference
                    </span>
                    <span className="font-mono text-xl font-bold tracking-wider text-foreground">
                      {refId}
                    </span>
                  </div>
                  <div className="h-px bg-zinc-200"></div>
                  <div className="grid grid-cols-2 gap-4 text-left text-xs sm:text-sm">
                    <div>
                      <span className="text-zinc-400 block text-[10px] uppercase font-mono tracking-wider">Genset Rating</span>
                      <span className="font-semibold text-foreground">{kva} kVA</span>
                    </div>
                    <div>
                      <span className="text-zinc-400 block text-[10px] uppercase font-mono tracking-wider">Customer</span>
                      <span className="font-semibold text-foreground truncate block">{customer}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-zinc-400 block text-[10px] uppercase font-mono tracking-wider">Offered Price (Excluding-GST)</span>
                      <span className="font-mono font-bold text-lg text-primary">{formatINR(price)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-slate-50/50 border-t border-border p-6 flex flex-col gap-3">
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="w-full border-border hover:bg-slate-100 text-foreground font-bold tracking-wider uppercase text-xs h-11"
                >
                  Evaluate Another Price
                </Button>
                {verdict === 'APPROVED' && (
                  <Button
                    onClick={() => navigate('/portal/order-support')}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold tracking-wider uppercase text-xs h-11 flex items-center justify-center gap-2"
                  >
                    Book This Order <ArrowRight size={14} />
                  </Button>
                )}
              </CardFooter>
            </Card>
          ) : (
            <Card className="bg-white border-border shadow-sm">
              <CardHeader>
                <CardTitle className="font-display font-extrabold text-lg uppercase tracking-wider text-foreground flex items-center gap-2">
                  <Calculator className="text-primary w-5 h-5" /> Evaluate Price
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePreSubmit} className="space-y-5">
                  {/* Permanently visible & locked Sales Rep field */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground-muted uppercase tracking-wider block">
                      Sales Rep
                    </label>
                    <Input
                      value={salesRep}
                      readOnly
                      disabled
                      className="bg-slate-100 border-border text-slate-700 font-medium cursor-not-allowed"
                    />
                  </div>

                  {/* Dealer field: editable & completely blank by default */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground-muted uppercase tracking-wider block">
                      Dealer:
                    </label>
                    <Input
                      value={dealerName}
                      onChange={(e) => setDealerName(e.target.value)}
                      className="bg-white border-border text-foreground focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground-muted uppercase tracking-wider block">
                      Genset Rating
                    </label>
                    <Select value={kva} onValueChange={setKva} required>
                      <SelectTrigger className="bg-white border-border text-foreground focus:ring-primary focus:ring-offset-0">
                        <SelectValue placeholder="Select rating" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-border text-foreground">
                        {loadingRatings ? (
                          <SelectItem value="loading" disabled>Loading ratings...</SelectItem>
                        ) : ratings.length === 0 ? (
                          <SelectItem value="empty" disabled>No active ratings found</SelectItem>
                        ) : (
                          ratings.map((r) => (
                            <SelectItem key={r.kva} value={r.kva} className="focus:bg-primary focus:text-white">
                              {r.kva} kVA
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground-muted uppercase tracking-wider block">
                      Customer Name:
                    </label>
                    <Input
                      value={customer}
                      onChange={(e) => setCustomer(e.target.value)}
                      className="bg-white border-border text-foreground focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground-muted uppercase tracking-wider block">
                      Offered Price:
                    </label>
                    <Input
                      type="text"
                      inputMode="numeric"
                      value={price}
                      onChange={(e) => setPrice(e.target.value.replace(/[^0-9]/g, ''))}
                      className="bg-white border-border text-foreground font-mono focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary"
                      required
                    />
                    {price && (
                      <div className="text-xs text-foreground-muted font-mono mt-1">
                        Evaluated value: <span className="text-primary font-semibold">{formatINR(price)}</span>
                      </div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold tracking-wider uppercase transition-all duration-200 mt-2"
                    disabled={submitting || loadingRatings || !kva || !customer.trim() || !price}
                  >
                    {submitting ? 'Checking limits...' : 'Submit for Evaluation'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Dealer History Section */}
        <Card className="bg-white border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="font-display font-extrabold text-base uppercase tracking-wider text-foreground flex items-center gap-2">
              <History className="text-primary w-4 h-4" /> My Submission History
            </CardTitle>
            <Button onClick={fetchHistory} size="xs" variant="outline" className="border-border hover:bg-slate-100 text-foreground">
              <RefreshCcw size={12} className="mr-1" /> Refresh
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-border text-foreground-muted font-bold uppercase tracking-wider bg-slate-50/50">
                    <th className="py-2.5 px-3 font-semibold">Date</th>
                    <th className="py-2.5 px-3 font-semibold">Reference</th>
                    <th className="py-2.5 px-3 font-semibold">Dealer</th>
                    <th className="py-2.5 px-3 font-semibold">kVA</th>
                    <th className="py-2.5 px-3 font-semibold">Customer</th>
                    <th className="py-2.5 px-3 font-semibold">Offered Price</th>
                    <th className="py-2.5 px-3 font-semibold">Verdict</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingHistory ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-zinc-400 font-mono">Loading your submission history...</td>
                    </tr>
                  ) : history.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-zinc-400 font-mono">No submissions recorded for your account yet.</td>
                    </tr>
                  ) : (
                    history.map((s) => (
                      <tr key={s.id} className="border-b border-border hover:bg-slate-50/50 transition-all font-mono text-foreground">
                        <td className="py-2.5 px-3 text-zinc-400 text-[10px]">{new Date(s.created_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</td>
                        <td className="py-2.5 px-3 font-bold text-foreground">{s.id}</td>
                        <td className="py-2.5 px-3 text-foreground-muted font-sans">{s.dealer_name || '-'}</td>
                        <td className="py-2.5 px-3 text-foreground">{s.kva}</td>
                        <td className="py-2.5 px-3 font-sans font-medium text-foreground">{s.customer_name}</td>
                        <td className="py-2.5 px-3 text-primary font-bold">{formatINR(s.offered_price)}</td>
                        <td className="py-2.5 px-3">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase font-sans tracking-wide ${
                            s.verdict === 'APPROVED' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/50' :
                            s.verdict === 'REFER' ? 'bg-amber-50 text-amber-800 border border-amber-200/50' :
                            'bg-red-50 text-red-850 border border-red-200/50'
                          }`}>
                            {s.verdict === 'APPROVED' ? 'Approved' : s.verdict === 'REFER' ? 'Refer' : 'No'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Step Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="bg-white border-border shadow-xl w-full max-w-md relative animate-in zoom-in-95 duration-200">
            <CardHeader className="pb-4">
              <CardTitle className="font-display font-bold text-lg uppercase tracking-wider text-foreground">
                Verify Evaluation Parameters
              </CardTitle>
              <CardDescription className="text-foreground-muted text-sm mt-1">
                Please verify that the details below are correct before submitting for evaluation.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-slate-50 border border-border rounded-xl p-4 space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-400 text-xs uppercase tracking-wide">Sales Rep</span>
                  <span className="font-semibold text-foreground truncate max-w-[200px]">{salesRep}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400 text-xs uppercase tracking-wide">Dealer</span>
                  <span className="font-semibold text-foreground truncate max-w-[200px]">{dealerName || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400 text-xs uppercase tracking-wide">Genset Rating</span>
                  <span className="font-semibold text-foreground">{kva} kVA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400 text-xs uppercase tracking-wide">Customer</span>
                  <span className="font-semibold text-foreground truncate max-w-[200px]">{customer}</span>
                </div>
                <div className="h-px bg-zinc-200 my-1"></div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400 text-xs uppercase tracking-wide">Offered Price</span>
                  <span className="font-mono font-bold text-primary text-base">{formatINR(price)}</span>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-lg p-3 text-xs leading-relaxed flex gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                <div>
                  <span className="font-bold">Important Security Notice</span>
                  <p className="mt-0.5">
                    Dealers cannot modify or delete evaluation requests after final submission. If anything is incorrect, please select "Go Back & Edit".
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-3 justify-end border-t border-border pt-4 bg-slate-50/50 p-6">
              <Button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 bg-white hover:bg-slate-100 text-foreground hover:text-foreground border border-border text-xs uppercase font-bold tracking-wider h-10"
              >
                Go Back & Edit
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setShowConfirmModal(false);
                  executeSubmit();
                }}
                className="flex-1 bg-primary hover:bg-primary/90 text-white text-xs uppercase font-bold tracking-wider h-10"
              >
                Confirm & Submit
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </PortalLayout>
  );
}
