import React, { useState } from 'react';
import { Order } from '../types';
import { GameLogo } from './Logos';
import { Search, CheckCircle2, Clock, AlertTriangle, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';

interface OrderTrackingViewProps {
  initialOrderNumber?: string;
  onSelectOrderForPayment?: (order: Order) => void;
  lang: 'en' | 'kh';
}

export const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({
  initialOrderNumber = '',
  onSelectOrderForPayment,
  lang
}) => {
  const [query, setQuery] = useState(initialOrderNumber);
  const [results, setResults] = useState<Order[]>([]);
  const [searched, setSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) {
      setError('Please enter an Order ID, Phone number, or Game ID');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/orders/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim() })
      });

      if (res.ok) {
        const data = await res.json();
        setResults(data);
        setSearched(true);
      } else {
        setError('No orders found matching your search.');
      }
    } catch (err) {
      setError('Failed to reach tracking server.');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto trigger search if initialOrderNumber is passed
  React.useEffect(() => {
    if (initialOrderNumber) {
      setQuery(initialOrderNumber);
      handleSearch();
    }
  }, [initialOrderNumber]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{status}</span>
          </span>
        );
      case 'WAITING_FOR_PAYMENT':
      case 'PAYMENT_PROCESSING':
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-950/80 text-amber-300 border border-amber-500/30">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{status}</span>
          </span>
        );
      case 'CANCELLED':
      case 'REJECTED':
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-950/80 text-rose-300 border border-rose-500/30">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>{status}</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-300">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
          {lang === 'en' ? 'Track In-Game Top-Up Order' : 'តាមដានការបញ្ជាទិញបញ្ចូលទឹកប្រាក់'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
          {lang === 'en'
            ? 'Enter your Order ID (e.g. AURA-MLBB-9281), Player ID, or registered phone number.'
            : 'បញ្ចូលលេខកូដបញ្ជាទិញ លេខសម្គាល់ហ្គេម ឬលេខទូរស័ព្ទរបស់អ្នក។'}
        </p>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSearch} className="mb-10">
        <div className="flex flex-col sm:flex-row gap-3 p-2 rounded-2xl bg-slate-900/80 border border-white/10 shadow-xl shadow-purple-950/40">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. AURA-MLBB-9281 or 82918274 or 070333444"
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-950/70 border border-slate-700 text-sm text-white placeholder-slate-500 font-mono focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-xs font-bold text-white flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>{lang === 'en' ? 'Search Order' : 'ស្វែងរក'}</span>
          </button>
        </div>
        {error && <p className="text-xs text-rose-400 mt-2 text-center">{error}</p>}
      </form>

      {/* Search Results */}
      {searched && results.length === 0 && (
        <div className="text-center p-12 rounded-3xl bg-slate-900/40 border border-white/5">
          <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-bold text-white mb-1">No Orders Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            We could not find an order with "{query}". Please double-check your Order Number or Game ID.
          </p>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-6">
          {results.map((order) => {
            const isCompleted = order.deliveryStatus === 'COMPLETED';
            const isPaid = order.paymentStatus === 'PAID';

            return (
              <div
                key={order.id}
                className="rounded-3xl bg-slate-900/70 border border-white/10 p-6 sm:p-8 shadow-xl shadow-purple-950/30 space-y-6"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                  <div className="flex items-center gap-3.5">
                    <GameLogo gameId={order.gameId} className="w-12 h-12 shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm sm:text-base font-extrabold text-white">
                          {order.orderNumber}
                        </span>
                        <span className="text-xs text-slate-500">·</span>
                        <span className="text-xs text-slate-400">
                          {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-cyan-300">
                        {order.productName}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusBadge(order.paymentStatus)}
                    {getStatusBadge(order.deliveryStatus)}
                  </div>
                </div>

                {/* Tracking Progress Steps */}
                <div className="relative py-2">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    {/* Step 1 */}
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center text-xs font-bold shrink-0">
                        ✓
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">1. Order Placed</span>
                        <span className="text-[10px] text-slate-400">Order ID generated</span>
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex items-start gap-3">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        isPaid ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-slate-800 text-slate-500'
                      }`}>
                        {isPaid ? '✓' : '2'}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">2. Payment Verified</span>
                        <span className="text-[10px] text-slate-400">ABA / KHQR clearance</span>
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex items-start gap-3">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        order.deliveryStatus === 'PROCESSING' || isCompleted
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-slate-800 text-slate-500'
                      }`}>
                        {isCompleted ? '✓' : '3'}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">3. In-Game Processing</span>
                        <span className="text-[10px] text-slate-400">Direct server dispatch</span>
                      </div>
                    </div>

                    {/* Step 4 */}
                    <div className="flex items-start gap-3">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        isCompleted ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-slate-800 text-slate-500'
                      }`}>
                        {isCompleted ? '✓' : '4'}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">4. Top-Up Delivered</span>
                        <span className="text-[10px] text-slate-400">Credited to player account</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Details Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-950/60 border border-white/5 text-xs">
                  <div className="space-y-2">
                    <div className="flex justify-between text-slate-400">
                      <span>Game:</span>
                      <span className="font-semibold text-white">{order.gameName}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Player ID:</span>
                      <span className="font-mono text-cyan-300 font-bold">{order.playerId}</span>
                    </div>
                    {order.zoneId && (
                      <div className="flex justify-between text-slate-400">
                        <span>Zone ID:</span>
                        <span className="font-mono text-white">{order.zoneId}</span>
                      </div>
                    )}
                    {order.verifiedAccountName && (
                      <div className="flex justify-between text-slate-400">
                        <span>Account Name:</span>
                        <span className="text-emerald-400 font-bold">{order.verifiedAccountName}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-slate-400">
                      <span>Payment Method:</span>
                      <span className="font-semibold text-white">{order.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Transaction Ref:</span>
                      <span className="font-mono text-slate-300">{order.paymentReference || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Total Paid:</span>
                      <span className="font-black text-cyan-400 tabular-nums">
                        ${order.totalUsd.toFixed(2)} ({order.totalKhr.toLocaleString()} ៛)
                      </span>
                    </div>
                  </div>
                </div>

                {/* If still waiting for payment, show pay button */}
                {order.paymentStatus === 'WAITING_FOR_PAYMENT' && onSelectOrderForPayment && (
                  <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-between gap-3">
                    <div className="text-xs text-purple-200">
                      This order is awaiting payment. Complete payment using ABA KHQR to receive instant delivery.
                    </div>
                    <button
                      type="button"
                      onClick={() => onSelectOrderForPayment(order)}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white shrink-0 cursor-pointer"
                    >
                      Pay Now ($ {order.totalUsd.toFixed(2)})
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
