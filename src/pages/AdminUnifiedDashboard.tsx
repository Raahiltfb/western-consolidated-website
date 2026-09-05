import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { PortalLayout } from '@/components/layout/PortalLayout';
import {
  Calculator,
  ShoppingBag,
  Sliders,
  History,
  Search,
  FileDown,
  Plus,
  Trash2,
  Check,
  RefreshCcw,
  AlertTriangle,
  Edit
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { sortRatings, cleanSalesRepName } from '@/lib/utils';

const formatINR = (n: number | string) => {
  const num = Number(n);
  return isNaN(num) ? '' : '₹' + num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

interface Rating {
  kva: string;
  min_price: number;
  refer_floor: number;
}

interface PriceSubmission {
  id: string;
  created_at: string;
  kva: string;
  customer_name: string;
  dealer_name: string;
  sales_rep?: string;
  offered_price: number;
  verdict: 'APPROVED' | 'REFER' | 'NOT_POSSIBLE';
  profiles?: { email: string; firm_name: string } | null;
}

interface Order {
  id: string;
  created_at: string;
  dealer_name: string;
  sales_rep?: string;
  kva: string;
  sets_count: number;
  customer_name: string;
  customer_phone: string | null;
  price_per_set: number;
  dispatch_date: string;
  status: 'open' | 'dispatched';
  profiles?: { email: string; firm_name: string } | null;
}

export default function AdminUnifiedDashboard() {
  const [activeModule, setActiveModule] = useState<'pricing' | 'orders'>(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    return tab === 'orders' ? 'orders' : 'pricing';
  });

  const handleSetActiveModule = (module: 'pricing' | 'orders') => {
    setActiveModule(module);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', module);
    window.history.replaceState({}, '', url.toString());
  };

  // --- Pricing Module States ---
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [submissions, setSubmissions] = useState<PriceSubmission[]>([]);
  const [subSearch, setSubSearch] = useState('');
  
  const [pricingTab, setPricingTab] = useState<'floors' | 'log'>(() => {
    const params = new URLSearchParams(window.location.search);
    const subtab = params.get('subtab');
    return subtab === 'log' ? 'log' : 'floors';
  });

  const handleSetPricingTab = (tab: 'floors' | 'log') => {
    setPricingTab(tab);
    const url = new URL(window.location.href);
    url.searchParams.set('subtab', tab);
    window.history.replaceState({}, '', url.toString());
  };

  // Rating edit state
  const [newKva, setNewKva] = useState('');
  const [newMinPrice, setNewMinPrice] = useState('');
  const [newReferFloor, setNewReferFloor] = useState('');
  const [isEditingRating, setIsEditingRating] = useState(false);

  // --- Order Module States ---
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState<'all' | 'open' | 'dispatched'>(() => {
    const params = new URLSearchParams(window.location.search);
    const filter = params.get('filter');
    return (filter === 'all' || filter === 'open' || filter === 'dispatched') ? filter : 'open';
  });

  const handleSetOrderFilter = (filter: 'all' | 'open' | 'dispatched') => {
    setOrderFilter(filter);
    const url = new URL(window.location.href);
    url.searchParams.set('filter', filter);
    window.history.replaceState({}, '', url.toString());
  };

  // --- Order Editing Modal States ---
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [editOrderDealer, setEditOrderDealer] = useState('');
  const [editOrderKva, setEditOrderKva] = useState('');
  const [editOrderSets, setEditOrderSets] = useState(1);
  const [editOrderCustomer, setEditOrderCustomer] = useState('');
  const [editOrderPhone, setEditOrderPhone] = useState('');
  const [editOrderPrice, setEditOrderPrice] = useState('');
  const [editOrderDate, setEditOrderDate] = useState('');
  const [editOrderStatus, setEditOrderStatus] = useState<'open' | 'dispatched'>('open');
  const [savingOrder, setSavingOrder] = useState(false);

  // Load Initial Data
  useEffect(() => {
    fetchPricingData();
    fetchOrderData();
  }, []);

  const fetchPricingData = async () => {
    try {
      const { data: ratData, error: ratErr } = await supabase
        .from('genset_ratings')
        .select('*')
        .order('kva');
      if (ratErr) throw ratErr;
      setRatings(sortRatings(ratData || []));

      const { data: subData, error: subErr } = await supabase
        .from('price_submissions')
        .select('*, profiles:user_id(email, firm_name)')
        .order('created_at', { ascending: false });
      if (subErr) throw subErr;
      setSubmissions(subData || []);
    } catch (err) {
      console.error('Error fetching pricing data:', err);
    }
  };

  const fetchOrderData = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, profiles:user_id(email, firm_name)')
        .order('dispatch_date', { ascending: true });
      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error('Error fetching order data:', err);
    }
  };

  // --- Pricing Operations ---
  const handleSaveRating = async (e: React.FormEvent) => {
    e.preventDefault();
    const minVal = Number(newMinPrice);
    const refVal = Number(newReferFloor);
    if (!newKva.trim() || isNaN(minVal) || isNaN(refVal) || refVal > minVal) {
      alert('Refer floor must be equal to or less than minimum price.');
      return;
    }

    try {
      const { error } = await supabase
        .from('genset_ratings')
        .upsert({
          kva: newKva.trim(),
          min_price: minVal,
          refer_floor: refVal,
        });

      if (error) throw error;

      setNewKva('');
      setNewMinPrice('');
      setNewReferFloor('');
      setIsEditingRating(false);
      fetchPricingData();
    } catch (err) {
      console.error('Failed to save rating:', err);
    }
  };

  const handleStartEditRating = (r: Rating) => {
    setNewKva(r.kva);
    setNewMinPrice(r.min_price.toString());
    setNewReferFloor(r.refer_floor.toString());
    setIsEditingRating(true);
  };

  const handleCancelEditRating = () => {
    setNewKva('');
    setNewMinPrice('');
    setNewReferFloor('');
    setIsEditingRating(false);
  };

  const handleDeleteRating = async (kva: string) => {
    if (!confirm(`Are you sure you want to remove rating floors for ${kva}?`)) return;
    try {
      const { error } = await supabase
        .from('genset_ratings')
        .delete()
        .eq('kva', kva);
      if (error) throw error;
      fetchPricingData();
    } catch (err) {
      console.error('Failed to delete rating:', err);
    }
  };

  const handleCopySubmissionsCSV = () => {
    const headers = ['Date', 'Reference', 'Sales Rep (Account)', 'Dealer', 'kVA', 'Customer', 'Price (excluding-GST)', 'Verdict'];
    const rows = filteredSubmissions.map((s) => [
      new Date(s.created_at).toLocaleDateString('en-IN'),
      s.id,
      cleanSalesRepName(s.sales_rep || s.profiles?.firm_name || s.profiles?.email || 'Unknown'),
      s.dealer_name || '',
      s.kva,
      s.customer_name,
      s.offered_price,
      s.verdict,
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    navigator.clipboard.writeText(csvContent);
    alert('Submissions CSV copied to clipboard!');
  };

  // --- Order Operations ---
  const handleUpdateOrderStatus = async (id: string, status: 'open' | 'dispatched') => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
      fetchOrderData();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleDeleteOrder = async (id: string) => {
    if (!confirm(`Are you sure you want to delete order ${id}? This action is permanent.`)) return;
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchOrderData();
    } catch (err) {
      console.error('Failed to delete order:', err);
    }
  };

  const handleStartEditOrder = (o: Order) => {
    setEditingOrder(o);
    setEditOrderDealer(o.dealer_name);
    setEditOrderKva(o.kva);
    setEditOrderSets(o.sets_count);
    setEditOrderCustomer(o.customer_name);
    setEditOrderPhone(o.customer_phone || '');
    setEditOrderPrice(o.price_per_set.toString());
    setEditOrderDate(o.dispatch_date);
    setEditOrderStatus(o.status);
  };

  const handleCancelEditOrder = () => {
    setEditingOrder(null);
  };

  const handleSaveOrderEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrder) return;

    setSavingOrder(true);
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          dealer_name: editOrderDealer.trim(),
          kva: editOrderKva,
          sets_count: Number(editOrderSets),
          customer_name: editOrderCustomer.trim(),
          customer_phone: editOrderPhone.trim() || null,
          price_per_set: Number(editOrderPrice),
          dispatch_date: editOrderDate,
          status: editOrderStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingOrder.id);

      if (error) throw error;

      setEditingOrder(null);
      fetchOrderData();
    } catch (err) {
      console.error('Error updating order:', err);
      alert('Failed to update order booking.');
    } finally {
      setSavingOrder(false);
    }
  };

  const handleExportOrdersCSV = () => {
    const headers = ['Ref', 'Booking Date', 'Sales Rep (Account)', 'Dealer', 'kVA', 'Sets', 'Customer', 'Phone', 'Price per Set', 'Value', 'Dispatch Date', 'Status'];
    const rows = filteredOrders.map((o) => [
      o.id,
      new Date(o.created_at).toLocaleDateString('en-IN'),
      cleanSalesRepName(o.sales_rep || o.profiles?.firm_name || o.profiles?.email || 'Unknown'),
      o.dealer_name || '',
      o.kva,
      o.sets_count,
      o.customer_name,
      o.customer_phone || '',
      o.price_per_set,
      o.sets_count * o.price_per_set,
      o.dispatch_date,
      o.status,
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `wcpl-orders-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- Filters and Computations ---
  const filteredSubmissions = submissions.filter((s) => {
    const rep = s.sales_rep || s.profiles?.email || '';
    const searchString = `${s.id} ${s.customer_name} ${s.dealer_name} ${rep} ${s.kva} ${s.verdict}`.toLowerCase();
    return searchString.includes(subSearch.toLowerCase());
  });

  const filteredOrders = orders.filter((o) => {
    if (orderFilter !== 'all' && o.status !== orderFilter) return false;
    const rep = o.sales_rep || o.profiles?.email || '';
    const searchString = `${o.id} ${o.customer_name} ${o.dealer_name} ${rep} ${o.kva}`.toLowerCase();
    return searchString.includes(orderSearch.toLowerCase());
  });

  // Calculate Order statistics
  const openOrders = orders.filter((o) => o.status === 'open');
  const openValue = openOrders.reduce((acc, o) => acc + (o.sets_count * o.price_per_set), 0);
  const openSets = openOrders.reduce((acc, o) => acc + o.sets_count, 0);

  const now = new Date();
  const setsDueThisMonth = openOrders.filter((o) => {
    const d = new Date(o.dispatch_date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).reduce((acc, o) => acc + o.sets_count, 0);

  return (
    <PortalLayout
      title="Admin Panel"

    >
      <div className="space-y-8 text-foreground">

        {/* Module Switcher */}
        <div className="flex bg-white p-1 rounded-xl border border-border max-w-md mx-auto sm:mx-0 shadow-sm">
          <button
            onClick={() => handleSetActiveModule('pricing')}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${activeModule === 'pricing' ? 'bg-primary text-white' : 'text-foreground-muted hover:text-primary hover:bg-slate-50'
              }`}
          >
            <Calculator size={14} /> Pricing Support
          </button>
          <button
            onClick={() => handleSetActiveModule('orders')}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${activeModule === 'orders' ? 'bg-primary text-white' : 'text-foreground-muted hover:text-primary hover:bg-slate-50'
              }`}
          >
            <ShoppingBag size={14} /> Order Booking
          </button>
        </div>

        {/* Pricing Module */}
        <div className={activeModule === 'pricing' ? 'block' : 'hidden'}>
          <Tabs value={pricingTab} onValueChange={(val) => handleSetPricingTab(val as 'floors' | 'log')} className="w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-border pb-3 mb-6 gap-4">
              <TabsList className="bg-white border border-border shadow-sm p-1">
                <TabsTrigger value="floors" className="data-[state=active]:bg-primary data-[state=active]:text-white text-xs font-bold tracking-wide uppercase">
                  <Sliders size={13} className="mr-1.5" /> Price Floors
                </TabsTrigger>
                <TabsTrigger value="log" className="data-[state=active]:bg-primary data-[state=active]:text-white text-xs font-bold tracking-wide uppercase">
                  <History size={13} className="mr-1.5" /> Submission Log
                </TabsTrigger>
              </TabsList>

              <div className="flex gap-2">
                <Button onClick={fetchPricingData} size="sm" variant="outline" className="border-border hover:bg-slate-100 text-foreground">
                  <RefreshCcw size={14} className="mr-1" /> Refresh
                </Button>
              </div>
            </div>

            {/* TAB: Price Floors */}
            <TabsContent value="floors" forceMount className={pricingTab === 'floors' ? "space-y-6 outline-none block" : "hidden"}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Add/Edit floor configuration */}
                <Card className="bg-white border-border h-fit shadow-sm">
                  <CardHeader>
                    <CardTitle className="font-display text-sm font-bold uppercase tracking-wider text-foreground">
                      {isEditingRating ? 'Edit Price Floor' : 'Configure Price Floor'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSaveRating} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-foreground-muted uppercase tracking-widest block">kVA Rating</label>
                        <Input
                          placeholder="e.g. 15 (3ph) GK"
                          value={newKva}
                          onChange={(e) => setNewKva(e.target.value)}
                          className="bg-white border-border text-foreground text-xs focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary"
                          required
                          disabled={isEditingRating}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-foreground-muted uppercase tracking-widest block">Minimum Approved Price (₹)</label>
                        <Input
                          type="number"
                          placeholder="e.g. 280000"
                          value={newMinPrice}
                          onChange={(e) => setNewMinPrice(e.target.value)}
                          className="bg-white border-border text-foreground font-mono text-xs focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary"
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-foreground-muted uppercase tracking-widest block">Management Referral Floor (₹)</label>
                        <Input
                          type="number"
                          placeholder="e.g. 270000"
                          value={newReferFloor}
                          onChange={(e) => setNewReferFloor(e.target.value)}
                          className="bg-white border-border text-foreground font-mono text-xs focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary"
                          required
                        />
                      </div>

                      {newMinPrice && newReferFloor && Number(newReferFloor) > Number(newMinPrice) && (
                        <div className="text-primary text-[10px] flex items-center gap-1">
                          <AlertTriangle size={12} /> Refer floor cannot exceed minimum price.
                        </div>
                      )}

                      <div className="flex gap-2">
                        {isEditingRating && (
                          <Button type="button" onClick={handleCancelEditRating} size="sm" className="flex-1 bg-white hover:bg-slate-100 text-foreground hover:text-foreground font-bold tracking-wider uppercase text-[10px] h-9 border border-border">
                            Cancel
                          </Button>
                        )}
                        <Button type="submit" size="sm" className="flex-1 bg-primary hover:bg-primary/95 text-white font-bold tracking-wider uppercase text-[10px] h-9">
                          {isEditingRating ? <Check size={14} className="mr-1" /> : <Plus size={14} className="mr-1" />}
                          {isEditingRating ? 'Update Rule' : 'Save Rule'}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>

                {/* Ratings Table */}
                <div className="lg:col-span-2 bg-white border border-border rounded-xl overflow-hidden shadow-sm">
                  <div className="p-4 border-b border-border bg-slate-50/50 flex justify-between items-center">
                    <span className="font-display text-xs font-bold uppercase tracking-wider text-foreground-muted">Company Price Floors</span>
                    <span className="text-[10px] text-zinc-400 font-mono">{ratings.length} ratings active</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-border text-foreground-muted font-bold uppercase tracking-wider bg-slate-50/30">
                          <th className="py-3.5 px-4 font-semibold">kVA</th>
                          <th className="py-3.5 px-4 font-semibold">Minimum Price</th>
                          <th className="py-3.5 px-4 font-semibold">Refer Floor</th>
                          <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ratings.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="py-12 text-center text-zinc-400 font-mono">No pricing guidelines defined yet.</td>
                          </tr>
                        ) : (
                          ratings.map((r) => (
                            <tr key={r.kva} className="border-b border-border hover:bg-slate-50/50 transition-all font-mono text-foreground">
                              <td className="py-3 px-4 font-bold text-foreground">{r.kva}</td>
                              <td className="py-3 px-4 text-emerald-600 font-bold">{formatINR(r.min_price)}</td>
                              <td className="py-3 px-4 text-amber-600 font-bold">{formatINR(r.refer_floor)}</td>
                              <td className="py-3 px-4 text-right">
                                <div className="flex gap-1 justify-end">
                                  <button onClick={() => handleStartEditRating(r)} className="text-zinc-400 hover:text-primary p-1.5 rounded transition-all" title="Edit">
                                    <Edit size={14} />
                                  </button>
                                  <button onClick={() => handleDeleteRating(r.kva)} className="text-zinc-400 hover:text-primary p-1.5 rounded transition-all" title="Delete">
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </TabsContent>

            {/* TAB: Submissions Log */}
            <TabsContent value="log" forceMount className={pricingTab === 'log' ? "space-y-4 outline-none block" : "hidden"}>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                  <Input
                    placeholder="Search by reference, dealer, customer, rating..."
                    value={subSearch}
                    onChange={(e) => setSubSearch(e.target.value)}
                    className="pl-9 bg-white border-border text-foreground placeholder-zinc-400 text-xs focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary"
                  />
                </div>
                <Button onClick={handleCopySubmissionsCSV} size="sm" className="bg-white hover:bg-slate-100 text-foreground hover:text-foreground border border-border">
                  <FileDown size={14} className="mr-1.5" /> Copy CSV Log
                </Button>
              </div>

              <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-border text-foreground-muted font-bold uppercase tracking-wider bg-slate-50/30">
                        <th className="py-3.5 px-4 font-semibold">Date</th>
                        <th className="py-3.5 px-4 font-semibold">Reference</th>
                        <th className="py-3.5 px-4 font-semibold">Sales Rep (Account)</th>
                        <th className="py-3.5 px-4 font-semibold">Dealer</th>
                        <th className="py-3.5 px-4 font-semibold">kVA</th>
                        <th className="py-3.5 px-4 font-semibold">Customer</th>
                        <th className="py-3.5 px-4 font-semibold">Offered Price</th>
                        <th className="py-3.5 px-4 font-semibold">Verdict</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSubmissions.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-12 text-center text-zinc-400 font-mono">No pricing submissions matched the filters.</td>
                        </tr>
                      ) : (
                        filteredSubmissions.map((s) => (
                          <tr key={s.id} className="border-b border-border hover:bg-slate-50/50 transition-all font-mono text-foreground">
                            <td className="py-3.5 px-4 text-zinc-400 text-[10px]">{new Date(s.created_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</td>
                            <td className="py-3.5 px-4 font-bold text-foreground">{s.id}</td>
                            <td className="py-3.5 px-4 font-sans font-medium text-foreground">{cleanSalesRepName(s.sales_rep || s.profiles?.firm_name || s.profiles?.email || '-')}</td>
                            <td className="py-3.5 px-4 text-foreground-muted font-sans">{s.dealer_name || '-'}</td>
                            <td className="py-3.5 px-4 text-foreground">{s.kva}</td>
                            <td className="py-3.5 px-4 font-sans font-medium text-foreground">{s.customer_name}</td>
                            <td className="py-3.5 px-4 text-primary font-bold">{formatINR(s.offered_price)}</td>
                            <td className="py-3.5 px-4">
                              <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase font-sans tracking-wide ${s.verdict === 'APPROVED' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/50' :
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
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Orders Module */}
        <div className={activeModule === 'orders' ? 'block' : 'hidden'}>
          <div className="space-y-6">

            {/* Order Book Statistics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-white border-border p-4 flex flex-col justify-between shadow-sm">
                <span className="text-[10px] font-bold text-foreground-muted uppercase tracking-widest block mb-2">Open Bookings</span>
                <span className="font-mono text-xl font-bold text-foreground">{openOrders.length}</span>
              </Card>
              <Card className="bg-white border-border p-4 flex flex-col justify-between shadow-sm">
                <span className="text-[10px] font-bold text-foreground-muted uppercase tracking-widest block mb-2">Sets Pending Dispatch</span>
                <span className="font-mono text-xl font-bold text-foreground">{openSets}</span>
              </Card>
              <Card className="bg-white border-border p-4 flex flex-col justify-between shadow-sm">
                <span className="text-[10px] font-bold text-foreground-muted uppercase tracking-widest block mb-2">Open Order Value</span>
                <span className="font-mono text-xl font-bold text-emerald-600">{formatINR(openValue)}</span>
              </Card>
              <Card className="bg-white border-border p-4 flex flex-col justify-between shadow-sm">
                <span className="text-[10px] font-bold text-foreground-muted uppercase tracking-widest block mb-2">Sets Due This Month</span>
                <span className="font-mono text-xl font-bold text-amber-600">{setsDueThisMonth}</span>
              </Card>
            </div>

            {/* Filtering and Actions */}
            <div className="flex flex-col md:flex-row gap-3 justify-between items-start md:items-center">
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-1">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
                  <Input
                    placeholder="Search by reference, dealer, customer, rating..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="pl-9 bg-white border-border text-foreground placeholder-zinc-400 text-xs focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary"
                  />
                </div>

                {/* Status Segment */}
                <div className="flex bg-white p-0.5 rounded-lg border border-border font-display text-xs uppercase font-bold shrink-0 shadow-sm">
                  {(['open', 'dispatched', 'all'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => handleSetOrderFilter(mode)}
                      className={`px-3 py-1.5 rounded-md transition-all ${orderFilter === mode ? 'bg-primary text-white' : 'text-foreground-muted hover:text-primary hover:bg-slate-50'
                        }`}
                    >
                      {mode.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 w-full sm:w-auto justify-end">
                <Button onClick={fetchOrderData} size="sm" variant="outline" className="border-border hover:bg-slate-100 text-foreground">
                  <RefreshCcw size={14} />
                </Button>
                <Button onClick={handleExportOrdersCSV} size="sm" className="bg-primary hover:bg-primary/95 text-white text-xs font-bold tracking-wider uppercase">
                  <FileDown size={14} className="mr-1.5" /> Export CSV Book
                </Button>
              </div>
            </div>

            {/* Orders Data Table */}
            <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-border text-foreground-muted font-bold uppercase tracking-wider bg-slate-50/30">
                      <th className="py-3.5 px-4 font-semibold">Ref</th>
                      <th className="py-3.5 px-4 font-semibold">Booked</th>
                      <th className="py-3.5 px-4 font-semibold">Sales Rep (Account)</th>
                      <th className="py-3.5 px-4 font-semibold">Dealer</th>
                      <th className="py-3.5 px-4 font-semibold">kVA</th>
                      <th className="py-3.5 px-4 font-semibold">Sets</th>
                      <th className="py-3.5 px-4 font-semibold">Customer</th>
                      <th className="py-3.5 px-4 font-semibold">Value</th>
                      <th className="py-3.5 px-4 font-semibold">Dispatch Date</th>
                      <th className="py-3.5 px-4 font-semibold">Status</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={11} className="py-12 text-center text-zinc-400 font-mono">No order records found in this view.</td>
                      </tr>
                    ) : (
                      filteredOrders.map((o) => {
                        const overdue = o.status === 'open' && new Date(o.dispatch_date) < new Date();
                        return (
                          <tr key={o.id} className="border-b border-border hover:bg-slate-50/50 transition-all font-mono text-foreground">
                            <td className="py-3.5 px-4 font-bold text-foreground">{o.id}</td>
                            <td className="py-3.5 px-4 text-zinc-400 text-[10px]">{new Date(o.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</td>
                            <td className="py-3.5 px-4 font-sans font-medium text-foreground">{cleanSalesRepName(o.sales_rep || o.profiles?.firm_name || o.profiles?.email || '-')}</td>
                            <td className="py-3.5 px-4 text-foreground-muted font-sans">{o.dealer_name || '-'}</td>
                            <td className="py-3.5 px-4 text-foreground">{o.kva}</td>
                            <td className="py-3.5 px-4 font-bold text-foreground">{o.sets_count}</td>
                            <td className="py-3.5 px-4 font-sans text-foreground">
                              <div>{o.customer_name}</div>
                              {o.customer_phone && <span className="text-[10px] text-zinc-400 font-mono block mt-0.5">{o.customer_phone}</span>}
                            </td>
                            <td className="py-3.5 px-4 text-primary font-bold">{formatINR(o.sets_count * o.price_per_set)}</td>
                            <td className={`py-3.5 px-4 ${overdue ? 'text-primary font-bold' : 'text-foreground'}`}>
                              {new Date(o.dispatch_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                              {overdue && <span className="ml-1 text-[8px] bg-red-50 border border-primary text-primary px-1 py-0.5 rounded font-sans uppercase font-bold tracking-wide">Overdue</span>}
                            </td>
                            <td className="py-3.5 px-4">
                              <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase font-sans tracking-wide ${o.status === 'open' ? 'bg-amber-50 text-amber-800 border border-amber-200/50' :
                                'bg-emerald-50 text-emerald-800 border border-emerald-200/50'
                                }`}>
                                {o.status === 'open' ? 'Open' : 'Dispatched'}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex gap-2 justify-end font-sans">
                                {o.status === 'open' ? (
                                  <Button onClick={() => handleUpdateOrderStatus(o.id, 'dispatched')} size="xs" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[9px] uppercase tracking-wide px-2 h-7">
                                    <Check size={11} className="mr-0.5" /> Dispatch
                                  </Button>
                                ) : (
                                  <Button onClick={() => handleUpdateOrderStatus(o.id, 'open')} size="xs" variant="outline" className="border-border hover:bg-slate-100 text-foreground font-bold text-[9px] uppercase tracking-wide px-2 h-7">
                                    Reopen
                                  </Button>
                                )}
                                <button onClick={() => handleStartEditOrder(o)} className="text-zinc-400 hover:text-primary p-1.5 rounded transition-all" title="Edit Order">
                                  <Edit size={13} />
                                </button>
                                <button onClick={() => handleDeleteOrder(o.id)} className="text-zinc-400 hover:text-primary p-1.5 rounded transition-all" title="Delete Order">
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Admin Order Edit Modal */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="bg-white border-border shadow-xl w-full max-w-lg relative animate-in zoom-in-95 duration-200">
            <CardHeader className="pb-4">
              <CardTitle className="font-display font-bold text-lg uppercase tracking-wider text-foreground">
                Edit Order Booking
              </CardTitle>
              <CardDescription className="text-foreground-muted text-sm mt-1">
                Modify order parameters for booking reference <span className="font-mono font-bold text-primary">{editingOrder.id}</span>.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSaveOrderEdit}>
              <CardContent className="space-y-4 max-h-[60vh] overflow-y-auto">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground-muted uppercase tracking-wider block">
                    Dealer Name
                  </label>
                  <Input
                    value={editOrderDealer}
                    onChange={(e) => setEditOrderDealer(e.target.value)}
                    className="bg-white border-border text-foreground focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground-muted uppercase tracking-wider block">
                      Genset Rating (kVA)
                    </label>
                    <Select value={editOrderKva} onValueChange={setEditOrderKva} required>
                      <SelectTrigger className="bg-white border-border text-foreground focus:ring-primary focus:ring-offset-0">
                        <SelectValue placeholder="Rating" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-border text-foreground">
                        {ratings.length === 0 ? (
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
                      value={editOrderSets}
                      onChange={(e) => setEditOrderSets(Math.max(1, Number(e.target.value)))}
                      className="bg-white border-border text-foreground focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground-muted uppercase tracking-wider block">
                    Customer Name
                  </label>
                  <Input
                    value={editOrderCustomer}
                    onChange={(e) => setEditOrderCustomer(e.target.value)}
                    className="bg-white border-border text-foreground focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground-muted uppercase tracking-wider block">
                    Customer Phone
                  </label>
                  <Input
                    placeholder="10-digit mobile number"
                    type="tel"
                    value={editOrderPhone}
                    onChange={(e) => setEditOrderPhone(e.target.value)}
                    className="bg-white border-border text-foreground focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground-muted uppercase tracking-wider block">
                      Price per Set (Excluding-GST, INR)
                    </label>
                    <Input
                      type="text"
                      inputMode="numeric"
                      value={editOrderPrice}
                      onChange={(e) => setEditOrderPrice(e.target.value.replace(/[^0-9]/g, ''))}
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
                      value={editOrderDate}
                      onChange={(e) => setEditOrderDate(e.target.value)}
                      className="bg-white border-border text-foreground focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground-muted uppercase tracking-wider block">
                    Status
                  </label>
                  <Select value={editOrderStatus} onValueChange={(val: 'open' | 'dispatched') => setEditOrderStatus(val)} required>
                    <SelectTrigger className="bg-white border-border text-foreground focus:ring-primary focus:ring-offset-0">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-border text-foreground">
                      <SelectItem value="open" className="focus:bg-primary focus:text-white">Open</SelectItem>
                      <SelectItem value="dispatched" className="focus:bg-primary focus:text-white">Dispatched</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter className="flex gap-3 justify-end border-t border-border pt-4 bg-slate-50/50 p-6">
                <Button
                  type="button"
                  onClick={handleCancelEditOrder}
                  className="flex-1 bg-white hover:bg-slate-100 text-foreground hover:text-foreground border border-border text-xs uppercase font-bold tracking-wider h-10"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={savingOrder}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white text-xs uppercase font-bold tracking-wider h-10"
                >
                  {savingOrder ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      )}
    </PortalLayout>
  );
}
