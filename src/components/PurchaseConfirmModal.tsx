import React from 'react';
import { Game, Product, PaymentMethodType } from '../types';
import { GameLogo, AbaBankLogo, KhqrLogo, BakongLogo } from './Logos';
import { ShieldAlert, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface PurchaseConfirmModalProps {
  orderData: {
    game: Game;
    product: Product;
    playerId: string;
    zoneId?: string;
    verifiedAccountName?: string;
    verifiedAvatarUrl?: string;
    paymentMethod: PaymentMethodType;
    customerEmail?: string;
    customerPhone?: string;
  };
  onCancel: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  lang: 'en' | 'kh';
}

export const PurchaseConfirmModal: React.FC<PurchaseConfirmModalProps> = ({
  orderData,
  onCancel,
  onConfirm,
  isLoading,
  lang
}) => {
  const { game, product, playerId, zoneId, verifiedAccountName, verifiedAvatarUrl, paymentMethod } = orderData;
  const priceUsd = product.priceUsd;
  const khrAmount = Math.round(priceUsd * 4100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0B1124] border border-purple-500/30 shadow-2xl shadow-purple-950/80 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10 bg-slate-900/80 text-center">
          <div className="inline-flex p-2 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30 mb-3">
            <CheckCircle2 className="w-8 h-8 text-cyan-400" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">
            {lang === 'en' ? 'Confirm Your Purchase' : 'បញ្ជាក់ការបញ្ជាទិញរបស់អ្នក'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {lang === 'en' 
              ? 'Please review your game account and top-up package details carefully.' 
              : 'សូមពិនិត្យមើលព័ត៌មានគណនីហ្គេម និងកញ្ចប់បញ្ចូលទឹកប្រាក់របស់អ្នកដោយប្រុងប្រយ័ត្ន។'}
          </p>
        </div>

        {/* Details Card */}
        <div className="p-6 space-y-4">
          {/* Game & Item Row */}
          <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-slate-900/60 border border-white/5">
            <GameLogo gameId={game.id} className="w-14 h-14 shrink-0" />
            <div className="overflow-hidden">
              <span className="text-[11px] font-semibold text-purple-400 uppercase tracking-wider block">
                {game.name}
              </span>
              <h3 className="text-base font-bold text-white truncate">
                {product.name}
              </h3>
              {product.bonus && (
                <span className="text-xs text-emerald-400 font-medium">
                  {product.bonus}
                </span>
              )}
            </div>
          </div>

          {/* Account Details */}
          <div className="space-y-2.5 p-4 rounded-xl bg-slate-950/60 border border-white/5 text-xs">
            <div className="flex justify-between items-center text-slate-300">
              <span>{game.idLabel}:</span>
              <span className="font-mono font-bold text-white">{playerId}</span>
            </div>

            {zoneId && (
              <div className="flex justify-between items-center text-slate-300">
                <span>Zone ID:</span>
                <span className="font-mono font-bold text-white">{zoneId}</span>
              </div>
            )}

            <div className="flex justify-between items-center text-slate-300">
              <span>Verified Account Name:</span>
              <div className="flex items-center gap-1.5 font-semibold text-emerald-400">
                {verifiedAvatarUrl && (
                  <img
                    src={verifiedAvatarUrl}
                    alt="Avatar"
                    referrerPolicy="no-referrer"
                    className="w-5 h-5 rounded-full object-cover border border-emerald-400/50"
                  />
                )}
                <span>{verifiedAccountName || 'Direct Verification Ready'}</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-slate-300 pt-2 border-t border-white/5">
              <span>Quantity:</span>
              <span className="font-semibold text-white">1</span>
            </div>

            <div className="flex justify-between items-center text-slate-300">
              <span>Unit Price:</span>
              <span className="font-bold text-white tabular-nums">${priceUsd.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center text-slate-300">
              <span>Payment Method:</span>
              <div className="flex items-center gap-1.5">
                {paymentMethod === 'ABA_PAY' && <AbaBankLogo className="h-5 text-[10px]" />}
                {paymentMethod === 'ABA_KHQR' && <KhqrLogo className="h-5 text-[10px]" />}
                {paymentMethod === 'BAKONG' && <BakongLogo className="h-4 text-[9px]" />}
                <span className="font-bold text-slate-200">{paymentMethod}</span>
              </div>
            </div>
          </div>

          {/* Total Amount Card */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-purple-950/60 to-slate-900 border border-purple-500/30">
            <div>
              <span className="text-xs text-slate-400 block font-medium">Total Amount Due</span>
              <span className="text-[11px] text-slate-500 font-mono">1 USD = 4,100 KHR</span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-cyan-400 tabular-nums">
                ${priceUsd.toFixed(2)}
              </span>
              <span className="text-xs text-slate-300 block tabular-nums font-semibold">
                {khrAmount.toLocaleString()} ៛ KHR
              </span>
            </div>
          </div>

          {/* Safety Notice */}
          <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/20 text-[11px] text-amber-300 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p>
              Please make sure your Game ID is 100% correct. Top-up credits are delivered immediately upon payment and cannot be reversed.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-white/10 bg-slate-900/60 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Cancel' : 'ថយក្រោយ'}</span>
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-xs font-bold text-white shadow-lg shadow-purple-900/40 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            {isLoading ? (
              <span>Creating Payment Transaction...</span>
            ) : (
              <>
                <span>{lang === 'en' ? 'Confirm & Continue to Payment' : 'បញ្ជាក់ & បន្តទៅការទូទាត់'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
