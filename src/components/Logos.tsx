import React from 'react';

// Original Website Logo: AuraTopUp (Gaming diamond crest with cyber energy)
export const BrandLogo: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 36 }) => (
  <div className={`flex items-center gap-2.5 font-bold select-none ${className}`}>
    <div 
      className="relative flex items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-400 p-2 shadow-lg shadow-purple-600/30 ring-1 ring-white/20"
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-white" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
      <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping opacity-75" />
    </div>
    <div className="flex flex-col leading-none">
      <span className="text-xl font-extrabold tracking-tight text-white flex items-center">
        AURA<span className="text-cyan-400">TOPUP</span>
      </span>
      <span className="text-[10px] font-semibold tracking-wider text-purple-300 uppercase mt-0.5">
        ABA & KHQR Official Partner
      </span>
    </div>
  </div>
);

// Official ABA Bank Logo
export const AbaBankLogo: React.FC<{ className?: string }> = ({ className = 'h-8' }) => (
  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#004B87] text-white font-bold tracking-tight shadow-sm select-none ${className}`}>
    <span className="text-sm font-black tracking-widest text-[#00E5FF]">ABA</span>
    <span className="text-[11px] font-semibold text-white/90">PAYWAY</span>
  </div>
);

// Official KHQR Logo
export const KhqrLogo: React.FC<{ className?: string }> = ({ className = 'h-8' }) => (
  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#D32F2F] text-white font-bold select-none ${className}`}>
    <div className="w-4 h-4 rounded-sm bg-white text-[#D32F2F] flex items-center justify-center text-[10px] font-black">
      QR
    </div>
    <span className="text-xs font-black tracking-wider text-white">KHQR</span>
  </div>
);

// Bakong Logo
export const BakongLogo: React.FC<{ className?: string }> = ({ className = 'h-6' }) => (
  <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#C62828] text-white text-xs font-extrabold select-none ${className}`}>
    <span>BAKONG</span>
  </div>
);

// Authentic Game Badges & Logos
export const GameLogo: React.FC<{ gameId: string; className?: string }> = ({ gameId, className = 'w-12 h-12' }) => {
  switch (gameId) {
    case 'mlbb':
      return (
        <div className={`rounded-xl bg-gradient-to-br from-[#1E1B4B] via-[#312E81] to-[#4338CA] p-2 flex items-center justify-center border border-purple-500/30 shadow-lg shadow-purple-900/40 ${className}`}>
          <div className="flex flex-col items-center justify-center text-center">
            <span className="text-[11px] font-black tracking-tighter text-amber-300 drop-shadow">MLBB</span>
            <span className="text-[8px] font-extrabold tracking-widest text-white/90 uppercase">DIAMONDS</span>
          </div>
        </div>
      );
    case 'freefire':
      return (
        <div className={`rounded-xl bg-gradient-to-br from-[#7C2D12] via-[#C2410C] to-[#EA580C] p-2 flex items-center justify-center border border-orange-500/30 shadow-lg shadow-orange-900/40 ${className}`}>
          <div className="flex flex-col items-center justify-center text-center">
            <span className="text-[11px] font-black tracking-tighter text-yellow-300 drop-shadow">FREE FIRE</span>
            <span className="text-[8px] font-extrabold tracking-widest text-white/90 uppercase">GARENA</span>
          </div>
        </div>
      );
    case 'pubgm':
      return (
        <div className={`rounded-xl bg-gradient-to-br from-[#713F12] via-[#A16207] to-[#CA8A04] p-2 flex items-center justify-center border border-yellow-500/30 shadow-lg shadow-yellow-900/40 ${className}`}>
          <div className="flex flex-col items-center justify-center text-center">
            <span className="text-[11px] font-black tracking-tighter text-white drop-shadow">PUBG</span>
            <span className="text-[8px] font-extrabold tracking-widest text-amber-200 uppercase">MOBILE UC</span>
          </div>
        </div>
      );
    case 'roblox':
      return (
        <div className={`rounded-xl bg-gradient-to-br from-[#0C4A6E] via-[#0284C7] to-[#00D4FF] p-2 flex items-center justify-center border border-cyan-500/30 shadow-lg shadow-cyan-900/40 ${className}`}>
          <div className="flex flex-col items-center justify-center text-center">
            <span className="text-[11px] font-black tracking-tighter text-white drop-shadow">ROBLOX</span>
            <span className="text-[8px] font-extrabold tracking-widest text-cyan-100 uppercase">ROBUX</span>
          </div>
        </div>
      );
    default:
      return null;
  }
};
