import React, { useState, useEffect } from 'react';
import { Order } from '../types';
import { AbaBankLogo, KhqrLogo, BakongLogo } from './Logos';
import { Clock, CheckCircle2, AlertCircle, RefreshCw, X, Copy, Check, Upload, Zap, ArrowRight, ShieldCheck } from 'lucide-react';

interface PaymentModalProps {
  order: Order;
  onClose: () => void;
  onPaymentSuccess: (updatedOrder: Order) => void;
  onOpenTrack: (orderNumber: string) => void;
  lang: 'en' | 'kh';
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  order: initialOrder,
  onClose,
  onPaymentSuccess,
  onOpenTrack,
  lang
}) => {
  const [order, setOrder] = useState<Order>(initialOrder);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(15 * 60); // 15 mins countdown
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [currencyView, setCurrencyView] = useState<'USD' | 'KHR'>(initialOrder.currency || 'USD');
  const [manualRefInput, setManualRefInput] = useState<string>('');
  const [proofSubmitted, setProofSubmitted] = useState<boolean>(false);
  const [proofError, setProofError] = useState<string>('');
  const [isSubmittingProof, setIsSubmittingProof] = useState<boolean>(false);

  // Fetch QR Code Data URL from server
  useEffect(() => {
    let isMounted = true;
    async function fetchQr() {
      try {
        const res = await fetch(`/api/orders/${order.id}/qr`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.dataUrl) {
            setQrDataUrl(data.dataUrl);
          }
        }
      } catch (e) {
        console.error('Error fetching QR code:', e);
      }
    }
    fetchQr();
    return () => {
      isMounted = false;
    };
  }, [order.id]);

  // 15-Minute Countdown Timer
  useEffect(() => {
    if (order.paymentStatus === 'PAID') return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [order.paymentStatus]);

  // Live Auto-Polling for Payment Verification (every 4 seconds)
  useEffect(() => {
    if (order.paymentStatus === 'PAID' || order.paymentStatus === 'CANCELLED') return;

    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/${order.id}/check-payment`);
        if (res.ok) {
          const data = await res.json();
          if (data.order && data.order.paymentStatus === 'PAID') {
            setOrder(data.order);
            onPaymentSuccess(data.order);
          }
        }
      } catch (err) {
        console.warn('Payment poll check:', err);
      }
    }, 4000);

    return () => clearInterval(pollInterval);
  }, [order.id, order.paymentStatus, onPaymentSuccess]);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleManualCheck = async () => {
    setIsChecking(true);
    try {
      const res = await fetch(`/api/orders/${order.id}/check-payment`);
      if (res.ok) {
        const data = await res.json();
        if (data.order) {
          setOrder(data.order);
          if (data.order.paymentStatus === 'PAID') {
            onPaymentSuccess(data.order);
          }
        }
      }
    } finally {
      setIsChecking(false);
    }
  };

  const handleSimulateWebhook = async () => {
    setIsSimulating(true);
    try {
      const res = await fetch(`/api/orders/${order.id}/simulate-webhook`, {
        method: 'POST'
      });
      if (res.ok) {
        const data = await res.json();
        if (data.order) {
          setOrder(data.order);
          onPaymentSuccess(data.order);
        }
      }
    } finally {
      setIsSimulating(false);
    }
  };

  const handleManualProofSubmit = async () => {
    if (!manualRefInput.trim()) {
      setProofError('Please enter your transaction reference or bank transfer code.');
      return;
    }

    setIsSubmittingProof(true);
    setProofError('');
    try {
      const res = await fetch(`/api/orders/${order.id}/confirm-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentReference: manualRefInput.trim()
        })
      });

      if (res.ok) {
        const data = await res.json();
        setOrder(data);
        setProofSubmitted(true);
      } else {
        setProofError('Failed to record payment reference. Please try again.');
      }
    } catch (e) {
      setProofError('Connection error. Please try again.');
    } finally {
      setIsSubmittingProof(false);
    }
  };

  const handleCancelOrder = async () => {
    if (confirm('Are you sure you want to cancel this payment?')) {
      try {
        await fetch(`/api/orders/${order.id}/cancel`, { method: 'POST' });
        onClose();
      } catch (e) {
        onClose();
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // SUCCESS VIEW
  if (order.paymentStatus === 'PAID') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
        <div className="relative w-full max-w-md rounded-3xl bg-[#0B1124] border border-emerald-500/40 p-6 sm:p-8 shadow-2xl shadow-emerald-950/50 text-center animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 ring-8 ring-emerald-500/10">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h2 className="text-2xl font-black text-white mb-1">
            {lang === 'en' ? 'Payment Verified!' : 'ការទូទាត់ទទួលបានជោគជ័យ!'}
          </h2>
          <p className="text-xs text-slate-300 mb-6">
            {lang === 'en' 
              ? `Your payment of $${order.totalUsd.toFixed(2)} via ${order.paymentMethod} was confirmed.` 
              : `ការទូទាត់របស់អ្នកចំនួន $${order.totalUsd.toFixed(2)} តាមរយៈ ${order.paymentMethod} ត្រូវបានផ្ទៀងផ្ទាត់រួចរាល់។`}
          </p>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-2.5 text-xs text-left mb-6">
            <div className="flex justify-between text-slate-400">
              <span>Order Number:</span>
              <span className="font-mono font-bold text-white">{order.orderNumber}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Game & Package:</span>
              <span className="font-semibold text-white">{order.productName}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Delivery Status:</span>
              <span className="font-bold text-emerald-400 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>{order.deliveryStatus}</span>
              </span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Player ID:</span>
              <span className="font-mono text-cyan-300 font-bold">{order.playerId}</span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => onOpenTrack(order.orderNumber)}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-xs font-bold text-white shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{lang === 'en' ? 'Track In-Game Delivery' : 'តាមដានការដឹកជញ្ជូនចូលហ្គេម'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
            >
              {lang === 'en' ? 'Close & Return to Store' : 'បិទ & ត្រឡប់ទៅទំព័រដើម'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl my-auto rounded-3xl bg-[#0B1124] border border-white/10 shadow-2xl shadow-purple-950/80 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <AbaBankLogo className="h-7 text-xs" />
            <KhqrLogo className="h-7 text-xs" />
            <span className="text-xs font-bold text-white">Payment Checkout</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Currency switcher */}
            <div className="flex items-center p-0.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => setCurrencyView('USD')}
                className={`px-2 py-0.5 rounded-md transition-colors ${
                  currencyView === 'USD' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                USD
              </button>
              <button
                type="button"
                onClick={() => setCurrencyView('KHR')}
                className={`px-2 py-0.5 rounded-md transition-colors ${
                  currencyView === 'KHR' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                KHR
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[82vh] overflow-y-auto">
          {/* Top Instruction Notice */}
          <div className="text-center">
            <p className="text-xs sm:text-sm font-semibold text-cyan-300">
              Scan the QR code using ABA Mobile or any supported KHQR banking application to complete your payment.
            </p>
          </div>

          {/* Amount and Expiry Strip */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 border border-white/10">
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Payment Amount</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black text-white tabular-nums">
                  {currencyView === 'USD' ? `$${order.totalUsd.toFixed(2)}` : `${order.totalKhr.toLocaleString()} ៛`}
                </span>
                <span className="text-xs text-slate-400 tabular-nums">
                  {currencyView === 'USD' ? `(${order.totalKhr.toLocaleString()} ៛ KHR)` : `($${order.totalUsd.toFixed(2)} USD)`}
                </span>
              </div>
            </div>

            {/* Countdown Timer */}
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block font-medium flex items-center justify-end gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Expires in</span>
              </span>
              <span className="text-lg font-black text-amber-400 font-mono tabular-nums">
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>

          {/* Dynamic QR Code Card */}
          <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-slate-950 border border-purple-500/20 shadow-inner">
            <div className="relative p-4 rounded-2xl bg-white shadow-xl shadow-cyan-950/40">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Dynamic ABA KHQR Payment Code"
                  className="w-56 h-56 sm:w-64 sm:h-64 object-contain rounded-lg"
                />
              ) : (
                <div className="w-56 h-56 sm:w-64 sm:h-64 flex flex-col items-center justify-center text-slate-600 gap-2">
                  <RefreshCw className="w-8 h-8 animate-spin text-purple-600" />
                  <span className="text-xs font-mono">Generating KHQR...</span>
                </div>
              )}

              {/* ABA & KHQR Stamp in center */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-1 rounded-lg shadow-md border border-slate-200">
                <div className="flex items-center gap-1">
                  <div className="w-5 h-5 rounded bg-[#004B87] text-[8px] font-black text-[#00E5FF] flex items-center justify-center">
                    ABA
                  </div>
                  <div className="w-5 h-5 rounded bg-[#D32F2F] text-[8px] font-black text-white flex items-center justify-center">
                    QR
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Status indicator */}
            <div className="mt-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
              <span className="text-xs font-semibold text-amber-300">
                {proofSubmitted ? 'Payment submitted · Awaiting automatic clearance' : 'Waiting for ABA Bank / KHQR scan...'}
              </span>
            </div>
          </div>

          {/* Reference and Order Meta */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block">Order Number</span>
                <span className="font-mono font-bold text-white">{order.orderNumber}</span>
              </div>
              <button
                onClick={() => copyToClipboard(order.orderNumber, 'order')}
                className="p-1.5 text-slate-400 hover:text-white"
                title="Copy Order ID"
              >
                {copiedField === 'order' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block">Transaction Reference</span>
                <span className="font-mono font-bold text-white">{order.paymentReference || 'ABA-TRX-PENDING'}</span>
              </div>
              <button
                onClick={() => copyToClipboard(order.paymentReference || '', 'ref')}
                className="p-1.5 text-slate-400 hover:text-white"
                title="Copy Transaction Reference"
              >
                {copiedField === 'ref' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Sandbox Instant Simulation Tool */}
          <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-xs font-bold text-white block">Developer Sandbox Simulation</span>
                <span className="text-[10px] text-purple-300">Simulate instant webhook payment callback from ABA</span>
              </div>
            </div>
            <button
              onClick={handleSimulateWebhook}
              disabled={isSimulating}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md shrink-0"
            >
              {isSimulating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
              <span>Simulate Paid</span>
            </button>
          </div>

          {/* Manual Payment Confirmation Fallback */}
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300">
                Manual Confirmation / I Have Paid
              </span>
              <span className="text-[10px] text-slate-500">
                Fallback verification
              </span>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              If your banking app completed the transfer but this screen hasn't updated automatically, enter your bank transfer reference ID below:
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                value={manualRefInput}
                onChange={(e) => setManualRefInput(e.target.value)}
                placeholder="e.g. ABA Bank Transfer Ref # / 0019284"
                className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              />
              <button
                type="button"
                onClick={handleManualProofSubmit}
                disabled={isSubmittingProof}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-xs font-bold text-white transition-colors flex items-center gap-1"
              >
                {isSubmittingProof ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                <span>I Have Paid</span>
              </button>
            </div>

            {proofError && (
              <span className="text-[11px] text-rose-400 block">{proofError}</span>
            )}
            {proofSubmitted && (
              <span className="text-[11px] text-emerald-400 block font-semibold">
                ✓ Reference submitted! Admin will audit and approve if webhook doesn't fire.
              </span>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-slate-900/80 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleCancelOrder}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-rose-950/60 hover:text-rose-300 text-xs font-semibold text-slate-400 transition-colors"
          >
            Cancel Payment
          </button>

          <button
            type="button"
            onClick={handleManualCheck}
            disabled={isChecking}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-xs font-bold text-white flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
            <span>Check Status</span>
          </button>
        </div>
      </div>
    </div>
  );
};
