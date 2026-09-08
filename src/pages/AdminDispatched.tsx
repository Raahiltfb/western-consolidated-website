import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { PortalLayout } from '@/components/layout/PortalLayout';
import {
  CheckCircle2,
  Search,
  FileDown,
  RefreshCcw,
  Calendar,
  Layers,
  ShoppingBag,
  ArrowUpDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cleanSalesRepName } from '@/lib/utils';

const formatINR = (n: number | string) => {
  const num = Number(n);
  return isNaN(num) ? '' : '₹' + num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

interface DispatchedOrder {
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

export default function AdminDispatched() {
  const [orders, setOrders] = useState<DispatchedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Month filter state (default to current month YYYY-MM)
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  });

  // Sort state: 'dispatch_desc' | 'dispatch_asc' | 'booking_desc' | 'booking_asc'
  type SortOption = 'dispatch_desc' | 'dispatch_asc' | 'booking_desc' | 'booking_asc';
  const [sortOption, setSortOption] = useState<SortOption>('dispatch_desc');

  // Load Dispatched Orders
  const fetchDispatchedOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, profiles:user_id(email, firm_name)')
        .eq('status', 'dispatched')
        .order('dispatch_date', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error('Error fetching dispatched orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDispatchedOrders();
  }, []);

  // --- Computations for Selected Month Summary ---
  const monthlyOrders = orders.filter((o) => {
    if (!o.dispatch_date) return false;
    return o.dispatch_date.startsWith(selectedMonth);
  });

  const totalDispatchesMonth = monthlyOrders.length;
  const totalSetsDispatchedMonth = monthlyOrders.reduce((sum, o) => sum + o.sets_count, 0);
  const totalValueDispatchedMonth = monthlyOrders.reduce((sum, o) => sum + (o.sets_count * o.price_per_set), 0);

  // --- Filtered and Sorted Table Data ---
  const filteredOrders = orders
    .filter((o) => {
      const rep = cleanSalesRepName(o.sales_rep || o.profiles?.firm_name || o.profiles?.email || '');
      const searchStr = `${o.id} ${o.customer_name} ${o.dealer_name} ${rep} ${o.kva} ${o.customer_phone || ''}`.toLowerCase();
      return searchStr.includes(search.toLowerCase());
    })
    .sort((a, b) => {
      if (sortOption === 'booking_desc') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      if (sortOption === 'booking_asc') {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      if (sortOption === 'dispatch_asc') {
        return new Date(a.dispatch_date).getTime() - new Date(b.dispatch_date).getTime();
      }
      // dispatch_desc
      return new Date(b.dispatch_date).getTime() - new Date(a.dispatch_date).getTime();
    });

  // Export CSV for Dispatched Orders
  const handleExportCSV = () => {
    const headers = [
      'Order Ref',
      'Booking Date',
      'Execution / Dispatch Date',
      'Sales Rep',
      'Dealer',
      'Customer Name',
      'Customer Phone',
      'Genset Rating',
      'No. of Sets',
      'Price per Set (₹)',
      'Total Order Value (₹)'
    ];

    const rows = filteredOrders.map((o) => [
      o.id,
      new Date(o.created_at).toLocaleDateString('en-IN'),
      o.dispatch_date,
      cleanSalesRepName(o.sales_rep || o.profiles?.firm_name || o.profiles?.email || 'Unknown'),
      o.dealer_name || '',
      o.customer_name,
      o.customer_phone || '',
      o.kva,
      o.sets_count,
      o.price_per_set,
      o.sets_count * o.price_per_set
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `dispatched-orders-${selectedMonth}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Format month string for display (e.g., "2026-09" -> "September 2026")
  const formatMonthLabel = (monthStr: string) => {
    if (!monthStr || !monthStr.includes('-')) return monthStr;
    const [yearStr, mStr] = monthStr.split('-');
    const date = new Date(Number(yearStr), Number(mStr) - 1, 1);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  return (
    <PortalLayout
      title="Dispatched Orders"
      subtitle="Admin summary and record of executed order dispatches"
    >
      <div className="space-y-8 text-foreground font-sans">
        
        {/* Top Section: Month Selection & Summary Header */}
        <div className="bg-white border border-border rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-4">
            <div>
              <h2 className="font-display font-bold text-base uppercase tracking-wider text-foreground flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" /> Monthly Dispatch Summary
              </h2>
              <p className="text-xs text-foreground-muted mt-0.5">
                Overview of dispatches for <span className="font-bold text-foreground">{formatMonthLabel(selectedMonth)}</span>
              </p>
            </div>

            {/* Month Selector */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-foreground-muted uppercase tracking-wider whitespace-nowrap">
                Select Month:
              </label>
              <Input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-white border-border text-foreground font-mono text-xs w-[160px] focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary"
              />
            </div>
          </div>

          {/* Monthly KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-slate-50/50 border-border p-4 shadow-none">
              <span className="text-[10px] font-bold text-foreground-muted uppercase tracking-widest block mb-1">
                Total Dispatches
              </span>
              <span className="font-mono text-2xl font-extrabold text-foreground flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 inline" />
                {totalDispatchesMonth}
              </span>
              <span className="text-[10px] text-zinc-400 block mt-1">
                Dispatched bookings in {formatMonthLabel(selectedMonth)}
              </span>
            </Card>

            <Card className="bg-slate-50/50 border-border p-4 shadow-none">
              <span className="text-[10px] font-bold text-foreground-muted uppercase tracking-widest block mb-1">
                Total Sets Dispatched
              </span>
              <span className="font-mono text-2xl font-extrabold text-primary flex items-center gap-2">
                <Layers className="w-5 h-5 text-primary inline" />
                {totalSetsDispatchedMonth}
              </span>
              <span className="text-[10px] text-zinc-400 block mt-1">
                Cumulative genset units dispatched
              </span>
            </Card>

            <Card className="bg-slate-50/50 border-border p-4 shadow-none">
              <span className="text-[10px] font-bold text-foreground-muted uppercase tracking-widest block mb-1">
                Monthly Dispatched Value
              </span>
              <span className="font-mono text-2xl font-extrabold text-emerald-600 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-600 inline" />
                {formatINR(totalValueDispatchedMonth)}
              </span>
              <span className="text-[10px] text-zinc-400 block mt-1">
                Gross value excluding GST
              </span>
            </Card>
          </div>
        </div>

        {/* Toolbar: Search, Sorting & Actions */}
        <div className="flex flex-col md:flex-row gap-3 justify-between items-start md:items-center">
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-1">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
              <Input
                placeholder="Search by reference, dealer, customer, sales rep, rating..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-white border-border text-foreground placeholder-zinc-400 text-xs focus-visible:ring-primary focus-visible:ring-offset-0 focus-visible:border-primary"
              />
            </div>

            {/* Sorting Select */}
            <div className="shrink-0">
              <Select value={sortOption} onValueChange={(val) => setSortOption(val as SortOption)}>
                <SelectTrigger className="w-[230px] bg-white border-border text-foreground text-xs focus:ring-primary focus:ring-offset-0">
                  <ArrowUpDown className="w-3.5 h-3.5 mr-1 text-zinc-400" />
                  <SelectValue placeholder="Sort Dispatches" />
                </SelectTrigger>
                <SelectContent className="bg-white border-border text-foreground text-xs">
                  <SelectItem value="dispatch_desc">Dispatch Date: Latest → Earliest</SelectItem>
                  <SelectItem value="dispatch_asc">Dispatch Date: Earliest → Latest</SelectItem>
                  <SelectItem value="booking_desc">Booking Date: Newest → Oldest</SelectItem>
                  <SelectItem value="booking_asc">Booking Date: Oldest → Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 w-full sm:w-auto justify-end">
            <Button onClick={fetchDispatchedOrders} size="sm" variant="outline" className="border-border hover:bg-slate-100 text-foreground">
              <RefreshCcw size={14} />
            </Button>
            <Button onClick={handleExportCSV} size="sm" className="bg-primary hover:bg-primary/95 text-white text-xs font-bold tracking-wider uppercase">
              <FileDown size={14} className="mr-1.5" /> Export CSV
            </Button>
          </div>
        </div>

        {/* Dispatched Orders Data Table */}
        <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-border bg-slate-50/50 flex justify-between items-center">
            <span className="font-display text-xs font-bold uppercase tracking-wider text-foreground-muted">
              Closed / Dispatched Orders Log ({filteredOrders.length})
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border text-foreground-muted font-bold uppercase tracking-wider bg-slate-50/30">
                  <th className="py-3.5 px-4 font-semibold">Order Ref</th>
                  <th className="py-3.5 px-4 font-semibold">Booking Date</th>
                  <th className="py-3.5 px-4 font-semibold">Dispatch Date</th>
                  <th className="py-3.5 px-4 font-semibold">Sales Rep</th>
                  <th className="py-3.5 px-4 font-semibold">Dealer</th>
                  <th className="py-3.5 px-4 font-semibold">Customer Name</th>
                  <th className="py-3.5 px-4 font-semibold">Customer Phone</th>
                  <th className="py-3.5 px-4 font-semibold">Genset Rating</th>
                  <th className="py-3.5 px-4 font-semibold">No. of Sets</th>
                  <th className="py-3.5 px-4 font-semibold">Price per Set</th>
                  <th className="py-3.5 px-4 font-semibold">Total Value</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={11} className="py-12 text-center text-zinc-400 font-mono">
                      Loading dispatched orders...
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="py-12 text-center text-zinc-400 font-mono">
                      No dispatched order records found.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((o) => (
                    <tr key={o.id} className="border-b border-border hover:bg-slate-50/50 transition-all font-mono text-foreground">
                      <td className="py-3.5 px-4 font-bold text-foreground">{o.id}</td>
                      <td className="py-3.5 px-4 text-zinc-400 text-[10px]">
                        {new Date(o.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-emerald-600">
                        {new Date(o.dispatch_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="py-3.5 px-4 font-sans font-medium text-foreground">
                        {cleanSalesRepName(o.sales_rep || o.profiles?.firm_name || o.profiles?.email || '-')}
                      </td>
                      <td className="py-3.5 px-4 text-foreground-muted font-sans">{o.dealer_name || '-'}</td>
                      <td className="py-3.5 px-4 font-sans font-medium text-foreground">{o.customer_name}</td>
                      <td className="py-3.5 px-4 text-zinc-500 font-mono text-[11px]">
                        {o.customer_phone || '-'}
                      </td>
                      <td className="py-3.5 px-4 text-foreground font-bold">{o.kva}</td>
                      <td className="py-3.5 px-4 font-bold text-foreground">{o.sets_count}</td>
                      <td className="py-3.5 px-4 text-foreground font-mono">{formatINR(o.price_per_set)}</td>
                      <td className="py-3.5 px-4 text-primary font-bold">{formatINR(o.sets_count * o.price_per_set)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </PortalLayout>
  );
}
