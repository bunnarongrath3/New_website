import React from 'react';
import { X, Send, Phone, Mail, MessageCircle, Clock, ShieldCheck } from 'lucide-react';
import { BrandLogo } from './Logos';

interface ContactModalProps {
  onClose: () => void;
  lang: 'en' | 'kh';
}

export const ContactModal: React.FC<ContactModalProps> = ({ onClose, lang }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0B1124] border border-white/10 p-6 sm:p-8 shadow-2xl shadow-purple-950/80">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-block mb-2">
            <BrandLogo size={40} />
          </div>
          <h2 className="text-xl font-bold text-white">
            {lang === 'en' ? 'Customer Support & Verification Help' : 'ផ្នែកបម្រើអតិថិជន & ជំនួយការ'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Our support operators are available 24/7 in Khmer and English.
          </p>
        </div>

        <div className="space-y-3 text-xs">
          {/* Telegram Support */}
          <a
            href="https://t.me/auratopup_support"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between p-4 rounded-2xl bg-cyan-950/30 hover:bg-cyan-900/40 border border-cyan-500/30 transition-all text-white group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-sm block">Telegram Live Support</span>
                <span className="text-[11px] text-cyan-300 font-mono">@auratopup_support</span>
              </div>
            </div>
            <span className="text-[10px] text-cyan-400 font-bold bg-cyan-950 px-2 py-1 rounded border border-cyan-800">
              Instant Reply &lt; 2m
            </span>
          </a>

          {/* Hotline */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-white/5 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/20 text-purple-400">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-sm block">Hotline (Phnom Penh)</span>
                <span className="text-[11px] text-slate-300 font-mono">+855 23 888 777 / 012 888 999</span>
              </div>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">24/7 Free</span>
          </div>

          {/* Email */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-white/5 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-400">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-sm block">Official Inquiries & Billing</span>
                <span className="text-[11px] text-slate-300 font-mono">support@auratopup.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-white/10 text-center text-[11px] text-slate-400">
          Have an Order Number ready so our support agent can verify and deliver your diamonds immediately.
        </div>
      </div>
    </div>
  );
};
