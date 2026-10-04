import React from 'react';
import { AbaBankLogo, KhqrLogo, BakongLogo } from './Logos';
import { Zap, ShieldCheck, Clock, ArrowRight, Flame } from 'lucide-react';
import heroBannerImage from '../assets/images/hero_gaming_banner_1791085620819.jpg';

interface HeroSectionProps {
  onStartTopUp: () => void;
  announcementText?: string;
  lang: 'en' | 'kh';
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartTopUp,
  announcementText,
  lang
}) => {
  return (
    <section className="relative overflow-hidden pt-6 pb-16 lg:pb-24">
      {/* Announcement Bar */}
      {announcementText && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-6">
          <div className="flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-purple-950/50 border border-purple-500/20 text-xs text-purple-200 backdrop-blur-md">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="flex items-center gap-1 font-bold text-amber-400 shrink-0">
                <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>HOT</span>
              </span>
              <span className="truncate">{announcementText}</span>
            </div>
            <span className="text-[11px] text-purple-400/80 font-medium shrink-0 hidden sm:inline">
              Instant 24/7 Delivery
            </span>
          </div>
        </div>
      )}

      {/* Hero Visual Card */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-purple-950/40 bg-slate-900/90">
          {/* Background Image with Measured Scrim */}
          <div className="absolute inset-0 z-0">
            <img
              src={heroBannerImage}
              alt="AuraTopUp Esports Gaming Arena"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center opacity-40 filter contrast-125 saturate-125 transform scale-105 transition-transform duration-1000"
            />
            {/* Multi-layer Gradient Scrim for crisp readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#080D1B] via-[#080D1B]/90 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080D1B] via-transparent to-transparent" />
          </div>

          {/* Content Layer */}
          <div className="relative z-10 p-8 sm:p-12 lg:p-16 max-w-3xl">
            {/* Quiet category / trust marker */}
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 mb-4 tracking-wide uppercase">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Official Gaming Top-Up Partner</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-purple-300">Cambodia & Regional</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-5 text-balance">
              Your Ultimate Gaming Top-Up Destination
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 mb-8 max-w-xl leading-relaxed">
              Fast, secure & trusted game credits for <span className="text-white font-semibold">Mobile Legends</span>, <span className="text-white font-semibold">Free Fire</span>, <span className="text-white font-semibold">PUBG Mobile</span>, and <span className="text-white font-semibold">Roblox</span>. Instant delivery via ABA PAY and KHQR.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <button
                onClick={onStartTopUp}
                className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:via-indigo-500 hover:to-cyan-400 text-sm font-bold text-white shadow-xl shadow-purple-900/40 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span>{lang === 'en' ? 'Start Top-Up Now' : 'ចាប់ផ្តើមបញ្ចូលទឹកប្រាក់'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#games-section"
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-sm font-semibold text-slate-200 transition-colors"
              >
                <span>{lang === 'en' ? 'Explore 4 Games' : 'មើលហ្គេមទាំង ៤'}</span>
              </a>
            </div>

            {/* Supported Payment Logos strip */}
            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <span className="font-medium text-slate-300">Seamless Instant Checkout:</span>
              <div className="flex items-center gap-2.5 flex-wrap">
                <AbaBankLogo className="h-7 text-xs" />
                <KhqrLogo className="h-7 text-xs" />
                <BakongLogo className="h-7 text-xs" />
                <span className="text-[11px] text-slate-500 font-medium">
                  + All Cambodian Bank Apps
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Pillars Claim-to-Proof */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/5 backdrop-blur-md flex items-start gap-4">
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white mb-1">Instant Auto-Delivery</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Diamonds, UC, and Robux delivered directly to your player account within 60 seconds after payment confirmation.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/5 backdrop-blur-md flex items-start gap-4">
            <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white mb-1">Official Payment Gateway</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Integrated directly with ABA PayWay and Cambodia's national standard KHQR. 100% secure with zero hidden fees.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/5 backdrop-blur-md flex items-start gap-4">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white mb-1">24/7 Dedicated Support</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Support team ready on Telegram and Live Chat in Khmer and English to verify transactions and answer questions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
