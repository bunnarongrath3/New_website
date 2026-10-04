import React, { useState, useEffect } from 'react';
import { Game, Product, PaymentMethodType, PlayerVerificationResult } from '../types';
import { GameLogo, AbaBankLogo, KhqrLogo, BakongLogo } from './Logos';
import { X, CheckCircle2, AlertCircle, Loader2, Sparkles, HelpCircle, ShieldCheck } from 'lucide-react';

interface GameTopUpModalProps {
  game: Game;
  products: Product[];
  onClose: () => void;
  onProceedToConfirm: (orderData: {
    game: Game;
    product: Product;
    playerId: string;
    zoneId?: string;
    verifiedAccountName?: string;
    verifiedAvatarUrl?: string;
    paymentMethod: PaymentMethodType;
    customerEmail?: string;
    customerPhone?: string;
  }) => void;
  lang: 'en' | 'kh';
}

export const GameTopUpModal: React.FC<GameTopUpModalProps> = ({
  game,
  products,
  onClose,
  onProceedToConfirm,
  lang
}) => {
  const [playerId, setPlayerId] = useState('');
  const [zoneId, setZoneId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<PlayerVerificationResult | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodType>('ABA_KHQR');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Default select first available product
  useEffect(() => {
    const available = products.find(p => p.isActive && (p.isUnlimitedStock || p.stock > 0));
    if (available) {
      setSelectedProductId(available.id);
    }
  }, [products]);

  const handleVerify = async () => {
    if (!playerId.trim()) {
      setErrorMsg(lang === 'en' ? 'Please enter your Player ID or Username' : 'សូមបញ្ចូលលេខសម្គាល់ ឬឈ្មោះអ្នកប្រើប្រាស់');
      return;
    }
    if (game.hasZoneId && !zoneId.trim()) {
      setErrorMsg(lang === 'en' ? 'Please enter your Zone ID' : 'សូមបញ្ចូលលេខតំបន់ (Zone ID)');
      return;
    }

    setErrorMsg('');
    setIsVerifying(true);
    setVerificationResult(null);

    try {
      const res = await fetch('/api/verify-player', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId: game.id,
          playerId: playerId.trim(),
          zoneId: zoneId.trim()
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || data.statusText || 'Verification failed');
      } else {
        setVerificationResult(data);
      }
    } catch (err: any) {
      setErrorMsg('Failed to connect to verification service. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCheckout = () => {
    if (!playerId.trim()) {
      setErrorMsg(lang === 'en' ? 'Please enter your Game ID or Username' : 'សូមបញ្ចូលលេខសម្គាល់ហ្គេមរបស់អ្នក');
      return;
    }

    if (game.hasZoneId && !zoneId.trim()) {
      setErrorMsg(lang === 'en' ? 'Please enter your Zone ID' : 'សូមបញ្ចូលលេខតំបន់ (Zone ID)');
      return;
    }

    const selectedProduct = products.find(p => p.id === selectedProductId);
    if (!selectedProduct) {
      setErrorMsg(lang === 'en' ? 'Please select a top-up package' : 'សូមជ្រើសរើសកញ្ចប់បញ្ចូលទឹកប្រាក់');
      return;
    }

    if (!selectedProduct.isUnlimitedStock && selectedProduct.stock <= 0) {
      setErrorMsg(lang === 'en' ? 'Selected package is out of stock' : 'កញ្ចប់ដែលបានជ្រើសរើសអស់ពីស្តុកហើយ');
      return;
    }

    onProceedToConfirm({
      game,
      product: selectedProduct,
      playerId: playerId.trim(),
      zoneId: game.hasZoneId ? zoneId.trim() : undefined,
      verifiedAccountName: verificationResult?.accountName || undefined,
      verifiedAvatarUrl: verificationResult?.avatarUrl || undefined,
      paymentMethod: selectedPaymentMethod,
      customerEmail: customerEmail.trim() || undefined,
      customerPhone: customerPhone.trim() || undefined
    });
  };

  const selectedProduct = products.find(p => p.id === selectedProductId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl my-auto rounded-3xl bg-[#0B1124] border border-white/10 shadow-2xl shadow-purple-950/60 overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-white/10 bg-slate-900/60">
          <div className="flex items-center gap-3.5">
            <GameLogo gameId={game.id} className="w-12 h-12" />
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>{game.name}</span>
                <span className="text-xs font-semibold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                  Official Top-Up
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {lang === 'en' ? 'Direct automated in-game credit top-up' : 'បញ្ចូលទឹកប្រាក់ស្វ័យប្រវត្តិចូលគណនីហ្គេម'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Two Columns */}
        <div className="p-5 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 max-h-[80vh] overflow-y-auto">
          {/* Left Column: Player ID & Product Selection (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Player ID / Verification */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-bold">
                    1
                  </span>
                  <h3 className="text-sm font-bold text-white">
                    {lang === 'en' ? 'Enter Account Information' : 'បញ្ចូលព័ត៌មានគណនី'}
                  </h3>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>How to find ID?</span>
                </div>
              </div>

              {/* ID Input Form */}
              <div className="space-y-3">
                <div className={`grid gap-3 ${game.hasZoneId ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1'}`}>
                  <div className={game.hasZoneId ? 'sm:col-span-2' : ''}>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      {game.idLabel} <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={playerId}
                      onChange={(e) => {
                        setPlayerId(e.target.value);
                        setVerificationResult(null);
                        setErrorMsg('');
                      }}
                      placeholder={game.idPlaceholder}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-sm text-white placeholder-slate-500 font-mono transition-all"
                    />
                  </div>

                  {game.hasZoneId && (
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        {game.zoneIdLabel || 'Zone ID'} <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={zoneId}
                        onChange={(e) => {
                          setZoneId(e.target.value);
                          setVerificationResult(null);
                          setErrorMsg('');
                        }}
                        placeholder={game.zoneIdPlaceholder || 'Zone ID'}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-sm text-white placeholder-slate-500 font-mono transition-all"
                      />
                    </div>
                  )}
                </div>

                {/* Guide Note */}
                <p className="text-[11px] text-slate-400 leading-relaxed bg-slate-950/40 p-2.5 rounded-lg border border-white/5">
                  {game.guideNote}
                </p>

                {/* Verify Button */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleVerify}
                    disabled={isVerifying || !playerId.trim()}
                    className="px-4 py-2 rounded-xl bg-purple-600/80 hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-bold text-white flex items-center gap-1.5 transition-colors"
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{game.id === 'roblox' ? 'Search Roblox Profile' : 'Verify Player ID'}</span>
                      </>
                    )}
                  </button>

                  <span className="text-[11px] text-slate-500">
                    Auto-validates before checkout
                  </span>
                </div>

                {/* Error Banner */}
                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/30 text-xs text-rose-300 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Verification Card Result */}
                {verificationResult && (
                  <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-3.5">
                    {verificationResult.avatarUrl ? (
                      <img
                        src={verificationResult.avatarUrl}
                        alt="Roblox Avatar"
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-xl bg-slate-900 border border-emerald-400/40 object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    )}
                    <div className="overflow-hidden">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white truncate">
                          {verificationResult.accountName}
                        </span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      </div>
                      <p className="text-[11px] text-emerald-300/90 truncate">
                        {verificationResult.statusText}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Step 2: Package Selection */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-bold">
                    2
                  </span>
                  <h3 className="text-sm font-bold text-white">
                    {lang === 'en' ? 'Select Package' : 'ជ្រើសរើសកញ្ចប់ទំនិញ'}
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400">
                  {products.length} Packages available
                </span>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {products.map((prod) => {
                  const isSelected = selectedProductId === prod.id;
                  const isOutOfStock = !prod.isUnlimitedStock && prod.stock <= 0;

                  return (
                    <button
                      key={prod.id}
                      type="button"
                      disabled={isOutOfStock || !prod.isActive}
                      onClick={() => setSelectedProductId(prod.id)}
                      className={`relative text-left p-3 rounded-xl border transition-all ${
                        isOutOfStock || !prod.isActive
                          ? 'opacity-40 bg-slate-950/40 border-slate-800 cursor-not-allowed'
                          : isSelected
                          ? 'bg-purple-900/40 border-cyan-400 shadow-md shadow-cyan-950/50 ring-1 ring-cyan-400/50'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                      }`}
                    >
                      {/* Popular indicator */}
                      {prod.isPopular && !isOutOfStock && (
                        <div className="absolute -top-2 right-2 px-1.5 py-0.5 rounded bg-amber-500 text-[9px] font-black text-slate-950 uppercase flex items-center gap-0.5">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>POPULAR</span>
                        </div>
                      )}

                      <div className="font-bold text-sm text-white mb-0.5 truncate">
                        {prod.name}
                      </div>

                      {prod.bonus && (
                        <div className="text-[10px] text-emerald-400 font-medium truncate mb-1">
                          {prod.bonus}
                        </div>
                      )}

                      <div className="flex items-baseline justify-between mt-2 pt-2 border-t border-white/5">
                        <span className="text-xs font-black text-cyan-300 tabular-nums">
                          ${prod.priceUsd.toFixed(2)}
                        </span>

                        <span className="text-[10px] text-slate-400 tabular-nums">
                          {isOutOfStock ? (
                            <span className="text-rose-400 font-bold">Sold Out</span>
                          ) : prod.isUnlimitedStock ? (
                            'In Stock'
                          ) : (
                            `${prod.stock} left`
                          )}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Payment Method & Order Summary (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Step 3: Payment Method */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/5 space-y-4">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-bold">
                  3
                </span>
                <h3 className="text-sm font-bold text-white">
                  {lang === 'en' ? 'Select Payment Method' : 'ជ្រើសរើសវិធីសាស្ត្រទូទាត់'}
                </h3>
              </div>

              <div className="space-y-2">
                {/* ABA KHQR */}
                <button
                  type="button"
                  onClick={() => setSelectedPaymentMethod('ABA_KHQR')}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                    selectedPaymentMethod === 'ABA_KHQR'
                      ? 'bg-purple-900/30 border-cyan-400 ring-1 ring-cyan-400/40'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <KhqrLogo className="h-6" />
                    <div className="text-left">
                      <div className="text-xs font-bold text-white">ABA KHQR</div>
                      <div className="text-[10px] text-slate-400">Scan with any bank app in Cambodia</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
                    Instant
                  </span>
                </button>

                {/* ABA PAY */}
                <button
                  type="button"
                  onClick={() => setSelectedPaymentMethod('ABA_PAY')}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                    selectedPaymentMethod === 'ABA_PAY'
                      ? 'bg-purple-900/30 border-cyan-400 ring-1 ring-cyan-400/40'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <AbaBankLogo className="h-6" />
                    <div className="text-left">
                      <div className="text-xs font-bold text-white">ABA PAY Direct</div>
                      <div className="text-[10px] text-slate-400">ABA Mobile deep link & PayWay QR</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/40">
                    0% Fee
                  </span>
                </button>

                {/* Bakong KHQR */}
                <button
                  type="button"
                  onClick={() => setSelectedPaymentMethod('BAKONG')}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                    selectedPaymentMethod === 'BAKONG'
                      ? 'bg-purple-900/30 border-cyan-400 ring-1 ring-cyan-400/40'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <BakongLogo className="h-5" />
                    <div className="text-left">
                      <div className="text-xs font-bold text-white">Bakong Wallet</div>
                      <div className="text-[10px] text-slate-400">National Bank of Cambodia Standard</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Optional Contact fields */}
            <div className="p-4 rounded-xl bg-slate-950/40 border border-white/5 space-y-2.5">
              <span className="text-xs font-semibold text-slate-300 block">
                {lang === 'en' ? 'Receipt Delivery (Optional)' : 'ទទួលបង្កាន់ដៃទូទាត់ (មិនទាមទារ)'}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="Email for receipt"
                  className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-cyan-400"
                />
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Telegram / Phone"
                  className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Order Summary & Buy Button */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-purple-500/20 shadow-xl space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {lang === 'en' ? 'Order Summary' : 'សេចក្តីសង្ខេប'}
              </h4>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Game:</span>
                  <span className="font-semibold text-white">{game.name}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Selected Item:</span>
                  <span className="font-semibold text-cyan-300">
                    {selectedProduct?.name || 'None'}
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Player / Account:</span>
                  <span className="font-mono text-white">
                    {verificationResult?.accountName || playerId || 'Not entered'}
                  </span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Payment Method:</span>
                  <span className="font-semibold text-slate-200">{selectedPaymentMethod}</span>
                </div>
                <div className="flex justify-between text-slate-300 pt-2 border-t border-white/5">
                  <span>Subtotal:</span>
                  <span className="tabular-nums">${selectedProduct ? selectedProduct.priceUsd.toFixed(2) : '0.00'}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Gateway Fee:</span>
                  <span className="text-emerald-400 font-semibold">$0.00 (FREE)</span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-white/10 text-white font-bold">
                  <span className="text-sm">Total Due:</span>
                  <div className="text-right">
                    <span className="text-xl font-black text-cyan-400 tabular-nums">
                      ${selectedProduct ? selectedProduct.priceUsd.toFixed(2) : '0.00'}
                    </span>
                    <span className="text-[11px] text-slate-400 block tabular-nums">
                      ≈ {selectedProduct ? (selectedProduct.priceUsd * 4100).toLocaleString() : 0} ៛ KHR
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                disabled={!selectedProduct || (!selectedProduct.isUnlimitedStock && selectedProduct.stock <= 0)}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-bold text-white shadow-lg shadow-purple-900/40 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{lang === 'en' ? 'Continue to Purchase Confirmation' : 'បន្តទៅកាន់ការបញ្ជាក់ការបញ្ជាទិញ'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
