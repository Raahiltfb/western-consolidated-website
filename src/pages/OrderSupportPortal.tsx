import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth';
import { PortalLayout } from '@/components/layout/PortalLayout';
import { ShoppingBag, CheckCircle, HelpCircle, AlertTriangle, History, RefreshCcw } from 'lucide-react';
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

interface OrderItem {
  id: string;
  created_at: string;
  dealer_name: string;
  sales_rep: string;
  kva: string;
  sets_count: number;
  customer_name: string;
  customer_phone: string | null;
  price_per_set: number;
  dispatch_date: string;
  status: 'open' | 'dispatched';
}

export default function OrderSupportPortal() {
  const { user, profile } = useAuth();
  const [ratings, setRatings] = useState<RatingOption[]>([]);
  const [loadingRatings, setLoadingRatings] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form fields
  const [dealer, setDealer] = useState('');
  const [kva, setKva] = useState('');
  const [setsCount, setSetsCount] = useState(1);
  const [customer, setCustomer] = useState('');
  const [phone, setPhone] = useState('');
  const [price, setPrice] = useState('');
  const [dispatchDate, setDispatchDate] = useState('');

  // Sales Rep is locked and derived from the authenticated profile/account identity
  const salesRep = cleanSalesRepName(profile?.firm_name || profile?.email || '');

  // History state
  const [history, setHistory] = useState<OrderItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Confirmation view (after submit succeeds)
  const [confirmed, setConfirmed] = useState(false);
  const [refId, setRefId] = useState('');

  // Pre-submit verification modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Load session storage state on mount
  useEffect(() => {
    const storedDealer = sessionStorage.getItem('wcpl_order_dealer');
    const storedKva = sessionStorage.getItem('wcpl_order_kva');
    const storedSets = sessionStorage.getItem('wcpl_order_sets');
    const storedCustomer = sessionStorage.getItem('wcpl_order_customer');
    const storedPhone = sessionStorage.getItem('wcpl_order_phone');
    const storedPrice = sessionStorage.getItem('wcpl_order_price');
    const storedDate = sessionStorage.getItem('wcpl_order_date');
    if (storedDealer) setDealer(storedDealer);
    if (storedKva) setKva(storedKva);
    if (storedSets) setSetsCount(Number(storedSets));
    if (storedCustomer) setCustomer(storedCustomer);
    if (storedPhone) setPhone(storedPhone);
    if (storedPrice) setPrice(storedPrice);
    if (storedDate) setDispatchDate(storedDate);
  }, []);

  // Sync to sessionStorage
  useEffect(() => {
    if (dealer) {
      sessionStorage.setItem('wcpl_order_dealer', dealer);
    } else {
      sessionStorage.removeItem('wcpl_order_dealer');
    }
  }, [dealer]);

  useEffect(() => {
    if (kva) {
      sessionStorage.setItem('wcpl_order_kva', kva);
    } else {
      sessionStorage.removeItem('wcpl_order_kva');
    }
  }, [kva]);

  useEffect(() => {
    sessionStorage.setItem('wcpl_order_sets', setsCount.toString());
  }, [setsCount]);

  useEffect(() => {
    if (customer) {
      sessionStorage.setItem('wcpl_order_customer', customer);
    } else {
      sessionStorage.removeItem('wcpl_order_customer');
    }
  }, [customer]);

  useEffect(() => {
    sessionStorage.setItem('wcpl_order_phone', phone);
  }, [phone]);

  useEffect(() => {
    if (price) {
      sessionStorage.setItem('wcpl_order_price', price);
    } else {
      sessionStorage.removeItem('wcpl_order_price');
    }
  }, [price]);

  useEffect(() => {
    if (dispatchDate) {
      sessionStorage.setItem('wcpl_order_date', dispatchDate);
    } else {
      sessionStorage.removeItem('wcpl_order_date');
    }
  }, [dispatchDate]);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setHistory(data || []);
    } catch (err) {
      console.error('Failed to load order history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

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
    if (!kva || !customer.trim() || !price || !dispatchDate || setsCount < 1) return;
    setShowConfirmModal(true);
  };

  const clearSessionStorage = () => {
    sessionStorage.removeItem('wcpl_order_dealer');
    sessionStorage.removeItem('wcpl_order_kva');
    sessionStorage.removeItem('wcpl_order_sets');
    sessionStorage.removeItem('wcpl_order_customer');
    sessionStorage.removeItem('wcpl_order_phone');
    sessionStorage.removeItem('wcpl_order_price');
    sessionStorage.removeItem('wcpl_order_date');
  };

  const executeSubmit = async () => {
    setSubmitting(true);
    const bookingRef = 'OB-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 4).toUpperCase();
    
    try {
      const { error } = await supabase
        .from('orders')
        .insert({
          id: bookingRef,
          user_id: user?.id,
          dealer_name: dealer.trim(),
          kva,
          sets_count: Number(setsCount),
          customer_name: customer.trim(),
          customer_phone: phone.trim() || null,
          price_per_set: Number(price),
          dispatch_date: dispatchDate,
          status: 'open',
        });

      if (error) throw error;

      setRefId(bookingRef);
      setConfirmed(true);
      clearSessionStorage();
      fetchHistory();
    } catch (err) {
      console.error('Error submitting order:', err);
      alert('Failed to submit order booking. Verify database schema trigger status.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setConfirmed(false);
    setKva('');
    setSetsCount(1);
    setCustomer('');
    setPhone('');
    setPrice('');
    setDispatchDate('');
    setRefId('');
    clearSessionStorage();
  };

  return (
    <PortalLayout title="Order Booking Portal">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="max-w-xl mx-auto">
          {confirmed ? (
            <Card className="bg-white border-border overflow-hidden shadow-md relative">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-primary"></div>
              <CardHeader className="text-center pt-8">
                <div className="flex justify-center mb-4">
                  <CheckCircle className="w-16 h-16 text-emerald-600 bg-emerald-50 rounded-full p-2 border border-emerald-200" />
                </div>
                <CardTitle className="font-display font-extrabold text-2xl uppercase tracking-wider text-foreground">
                  Booking Recorded
                </CardTitle>
                <CardDescription className="text-foreground-muted text-sm mt-2">
                  The order details have been successfully written to the system database.
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 py-4">
                <div className="bg-slate-50 border border-border rounded-xl p-6 text-center space-y-4">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block">
                      Order Reference
                    </span>
                    <span className="font-mono text-xl font-bold tracking-wider text-foreground">
                      {refId}
                    </span>
                  </div>
                  <div className="h-px bg-zinc-200"></div>
                  <div className="grid grid-cols-2 gap-4 text-left text-xs sm:text-sm">
                    <div>
                      <span className="text-zinc-400 block text-[10px] uppercase font-mono tracking-wider">Dealer</span>
                      <span className="font-semibold text-foreground truncate block">{dealer || '-'}</span>
                    </div>
                    <div>
                      <span className="text-zinc-400 block text-[10px] uppercase font-mono tracking-wider">Customer</span>
                      <span className="font-semibold text-foreground truncate block">{customer}</span>
                    </div>
                    <div>
                      <span className="text-zinc-400 block text-[10px] uppercase font-mono tracking-wider">Item (Qty × Rating)</span>
                      <span className="font-semibold text-foreground">{setsCount} × {kva} kVA</span>
                    </div>
                    <div>
                      <span className="text-zinc-400 block text-[10px] uppercase font-mono tracking-wider">Total Value (Excluding-GST)</span>
                      <span className="font-mono font-bold text-primary">{formatINR(setsCount * Number(price))}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-slate-50/50 border-t border-border p-6">
                <Button
                  onClick={handleReset}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold tracking-wider uppercase text-xs h-11"
                >
                  Book Another Order
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <Card className="bg-white border-border shadow-sm">
              <CardHeader>
                <CardTitle className="font-display font-extrabold text-lg uppercase tracking-wider text-foreground flex items-center gap-2">
                  <ShoppingBag className="text-primary w-5 h-5" /> Book an Order
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePreSubmit} className="space-y-4">
                  {/* Permanently visible & locked Sales Rep field */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground-muted uppercase tracking-wider block">
                      Sales Rep:
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
                      value={dealer}
                      onChange={(e) => setDealer(e.target.value)}
                      className="bg-white border-border text-foreground focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary"
                    />
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-foreground-muted uppercase tracking-wider block">
                        Genset Rating:
                      </label>
                      <Select value={kva} onValueChange={setKva} required>
                        <SelectTrigger className="bg-white border-border text-foreground focus:ring-primary focus:ring-offset-0">
                          <SelectValue placeholder="Select rating" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-border text-foreground">
                          {loadingRatings ? (
                            <SelectItem value="loading" disabled>Loading...</SelectItem>
                          ) : ratings.length === 0 ? (
                            <SelectItem value="empty" disabled>No active ratings</SelectItem>
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
                        No. of Sets
                      </label>
                      <Input
                        type="number"
                        min="1"
                        step="1"
                        value={setsCount}
                        onChange={(e) => setSetsCount(Math.max(1, Number(e.target.value)))}
                        className="bg-white border-border text-foreground focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground-muted uppercase tracking-wider block">
                      Customer ph no: <span className="text-zinc-400 font-normal font-sans">(Optional)</span>
                    </label>
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="bg-white border-border text-foreground focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-foreground-muted uppercase tracking-wider block">
                        Price per set
                      </label>
                      <Input
                        type="text"
                        inputMode="numeric"
                        value={price}
                        onChange={(e) => setPrice(e.target.value.replace(/[^0-9]/g, ''))}
                        className="bg-white border-border text-foreground font-mono focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-foreground-muted uppercase tracking-wider block">
                        Projected Dispatch Date
                      </label>
                      <Input
                        type="date"
                        value={dispatchDate}
                        onChange={(e) => setDispatchDate(e.target.value)}
                        className="bg-white border-border text-foreground focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary"
                        required
                      />
                    </div>
                  </div>

                  {price && setsCount && (
                    <div className="bg-slate-50 border border-border p-3 rounded-lg text-xs flex justify-between items-center font-mono">
                      <span className="text-foreground-muted uppercase tracking-wider flex items-center gap-1.5">
                        <HelpCircle size={14} className="text-primary" /> Estimated Value:
                      </span>
                      <span className="text-emerald-600 font-bold text-sm">
                        {formatINR(setsCount * Number(price))}
                      </span>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold tracking-wider uppercase transition-all duration-200 mt-2"
                    disabled={submitting || loadingRatings || !kva || !customer.trim() || !price || !dispatchDate}
                  >
                    {submitting ? 'Recording order...' : 'Submit Booking'}
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
              <History className="text-primary w-4 h-4" /> My Order History
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
                    <th className="py-2.5 px-3 font-semibold">Ref</th>
                    <th className="py-2.5 px-3 font-semibold">Booked</th>
                    <th className="py-2.5 px-3 font-semibold">Dealer</th>
                    <th className="py-2.5 px-3 font-semibold">kVA</th>
                    <th className="py-2.5 px-3 font-semibold">Sets</th>
                    <th className="py-2.5 px-3 font-semibold">Customer</th>
                    <th className="py-2.5 px-3 font-semibold">Value</th>
                    <th className="py-2.5 px-3 font-semibold">Dispatch Date</th>
                    <th className="py-2.5 px-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingHistory ? (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-zinc-400 font-mono">Loading your order history...</td>
                    </tr>
                  ) : history.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-zinc-400 font-mono">No order bookings recorded for your account yet.</td>
                    </tr>
                  ) : (
                    history.map((o) => (
                      <tr key={o.id} className="border-b border-border hover:bg-slate-50/50 transition-all font-mono text-foreground">
                        <td className="py-2.5 px-3 font-bold text-foreground">{o.id}</td>
                        <td className="py-2.5 px-3 text-zinc-400 text-[10px]">{new Date(o.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</td>
                        <td className="py-2.5 px-3 text-foreground-muted font-sans">{o.dealer_name || '-'}</td>
                        <td className="py-2.5 px-3 text-foreground">{o.kva}</td>
                        <td className="py-2.5 px-3 font-bold text-foreground">{o.sets_count}</td>
                        <td className="py-2.5 px-3 font-sans text-foreground">
                          <div>{o.customer_name}</div>
                          {o.customer_phone && <span className="text-[10px] text-zinc-400 font-mono block mt-0.5">{o.customer_phone}</span>}
                        </td>
                        <td className="py-2.5 px-3 text-primary font-bold">{formatINR(o.sets_count * o.price_per_set)}</td>
                        <td className="py-2.5 px-3 text-foreground">
                          {new Date(o.dispatch_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase font-sans tracking-wide ${
                            o.status === 'open' ? 'bg-amber-50 text-amber-800 border border-amber-200/50' :
                            'bg-emerald-50 text-emerald-800 border border-emerald-200/50'
                          }`}>
                            {o.status === 'open' ? 'Open' : 'Dispatched'}
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
                Verify Order Booking Details
              </CardTitle>
              <CardDescription className="text-foreground-muted text-sm mt-1">
                Please verify that the details below are correct before submitting the order.
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
                  <span className="font-semibold text-foreground truncate max-w-[200px]">{dealer || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400 text-xs uppercase tracking-wide">Customer</span>
                  <span className="font-semibold text-foreground truncate max-w-[200px]">{customer}</span>
                </div>
                {phone && (
                  <div className="flex justify-between">
                    <span className="text-zinc-400 text-xs uppercase tracking-wide">Phone</span>
                    <span className="font-semibold text-foreground">{phone}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-zinc-400 text-xs uppercase tracking-wide">Genset</span>
                  <span className="font-semibold text-foreground">{setsCount} × {kva} kVA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400 text-xs uppercase tracking-wide">Dispatch Date</span>
                  <span className="font-semibold text-foreground">{new Date(dispatchDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                </div>
                <div className="h-px bg-zinc-200 my-1"></div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400 text-xs uppercase tracking-wide">Total Value</span>
                  <span className="font-mono font-bold text-emerald-600 text-base">{formatINR(setsCount * Number(price))}</span>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-lg p-3 text-xs leading-relaxed flex gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                <div>
                  <span className="font-bold">Important Security Notice</span>
                  <p className="mt-0.5">
                    Dealers cannot modify or delete order bookings after final submission. If anything is incorrect, please select "Go Back & Edit".
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
