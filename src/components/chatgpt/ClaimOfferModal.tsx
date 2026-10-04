import React from 'react';
import { X, Gift, Check, Sparkles, Zap, Shield, ArrowRight } from 'lucide-react';

interface ClaimOfferModalProps {
  onClose: () => void;
  onClaim: () => void;
}

export const ClaimOfferModal: React.FC<ClaimOfferModalProps> = ({ onClose, onClaim }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-3xl bg-[#1e1e1e] border border-white/10 p-6 sm:p-8 shadow-2xl text-center space-y-5">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500/20 to-purple-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/30">
          <Gift className="w-8 h-8" />
        </div>

        <div>
          <h3 className="text-xl font-bold text-white mb-1.5">
            Exclusive ChatGPT Plus Offer
          </h3>
          <p className="text-xs text-slate-400">
            Enjoy unlimited access to GPT-4o, advanced data analysis, image generation with DALL·E, and priority access during peak hours.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#171717] border border-white/5 space-y-2.5 text-xs text-left">
          <div className="flex items-center gap-2 text-slate-200">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Access to GPT-4o and advanced voice mode</span>
          </div>
          <div className="flex items-center gap-2 text-slate-200">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Create, edit, and organize files in your Library</span>
          </div>
          <div className="flex items-center gap-2 text-slate-200">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Faster response speed & higher message limits</span>
          </div>
        </div>

        <div className="space-y-2">
          <button
            onClick={onClaim}
            className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-[#1f1f1f] text-xs font-bold shadow-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Claim 1-Month Free Trial</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="w-full py-2 rounded-xl text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
};
