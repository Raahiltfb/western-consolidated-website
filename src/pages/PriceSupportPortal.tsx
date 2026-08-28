import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { Calculator, CheckCircle2, AlertTriangle, XCircle, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { sortRatings } from '@/lib/utils';

let cachedRatings: RatingOption[] | null = null;

const formatINR = (n: number | string) => {
  const num = Number(n);
  return isNaN(num) ? '' : '₹' + num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

interface RatingOption {
  kva: string;
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

  // Fetch ratings from the secure view
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
    // Default the dealer name to their profile firm_name if no stored value exists
    const storedDealer = sessionStorage.getItem('wcpl_price_dealer');
    if (!storedDealer && profile?.firm_name) {
      setDealerName(profile.firm_name);
    }
  }, [profile]);

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
        p_dealer_name: dealerName.trim() || profile?.email || 'Dealer',
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
    <PortalLayout
      title="Pricing Support Portal"
    >
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
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground-muted uppercase tracking-wider block">
                    Genset Rating (kVA)
                  </label>
                  <Select value={kva} onValueChange={setKva} required>
                    <SelectTrigger className="bg-white border-border text-foreground focus:ring-primary focus:ring-offset-0">
                      <SelectValue placeholder="Select kVA rating" />
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
                    Customer Name
                  </label>
                  <Input
                    placeholder="e.g. KOEL."
                    value={customer}
                    onChange={(e) => setCustomer(e.target.value)}
                    className="bg-white border-border text-foreground focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground-muted uppercase tracking-wider block">
                    Dealer / Sales Agent
                  </label>
                  <Input
                    placeholder="Your firm or representative name"
                    value={dealerName}
                    onChange={(e) => setDealerName(e.target.value)}
                    className="bg-white border-border text-foreground focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground-muted uppercase tracking-wider block">
                    Offered Price (Excluding-GST, INR)
                  </label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    placeholder="e.g. 550000"
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
                  <span className="text-zinc-400 text-xs uppercase tracking-wide">Genset Rating</span>
                  <span className="font-semibold text-foreground">{kva} kVA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400 text-xs uppercase tracking-wide">Customer</span>
                  <span className="font-semibold text-foreground truncate max-w-[200px]">{customer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400 text-xs uppercase tracking-wide">Dealer/Agent</span>
                  <span className="font-semibold text-foreground truncate max-w-[200px]">{dealerName}</span>
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
