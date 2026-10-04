import React, { useState } from 'react';
import { 
  Search, Instagram, ChevronDown, Megaphone, X, 
  User as UserIcon, ShieldCheck, Globe, ShoppingBag 
} from 'lucide-react';
import { User } from '../../types';

interface TwodiceNavbarProps {
  currentUser: User | null;
  onOpenAuth: () => void;
  onOpenTrack: () => void;
  onOpenAdmin: () => void;
  currency: 'MYR' | 'USD' | 'KHR';
  setCurrency: (c: 'MYR' | 'USD' | 'KHR') => void;
  onSelectCategory: (cat: string) => void;
}

export const TwodiceNavbar: React.FC<TwodiceNavbarProps> = ({
  currentUser,
  onOpenAuth,
  onOpenTrack,
  onOpenAdmin,
  currency,
  setCurrency,
  onSelectCategory
}) => {
  const [showBanner, setShowBanner] = useState(true);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [showGameDropdown, setShowGameDropdown] = useState(false);
  const [showCardsDropdown, setShowCardsDropdown] = useState(false);

  return (
    <div className="w-full">
      {/* Top Purple Announcement Ribbon */}
      {showBanner && (
        <div className="w-full bg-[#6C47FF] text-white text-[12px] font-medium py-2.5 px-4 sm:px-6 rounded-t-[28px] flex items-center justify-between shadow-sm transition-all">
          <div className="flex items-center gap-2 mx-auto text-center truncate">
            <Megaphone className="w-4 h-4 shrink-0 text-white/90" />
            <span className="truncate">
              We will be at GG Gamers Asia 2024! We look forward to seeing you in 2024 from 17 - 20 October 2024 in Singapore at Marina Convention Centre.
            </span>
          </div>
          <button
            onClick={() => setShowBanner(false)}
            className="p-1 rounded-full hover:bg-white/20 text-white/90 hover:text-white transition-colors shrink-0 ml-2"
            title="Dismiss announcement"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Navbar */}
      <nav className="w-full bg-white px-6 sm:px-8 py-4 flex items-center justify-between border-b border-slate-100">
        {/* Left: Brand Logo + Nav Links */}
        <div className="flex items-center gap-8">
          {/* Logo: twodice */}
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            {/* 3D Isometric Purple Dice Icon */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#5833EF] via-[#6C47FF] to-[#8E72FF] p-1.5 shadow-md shadow-purple-500/25 flex items-center justify-center relative">
              <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-white" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
              <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-white" />
              <div className="absolute bottom-2.5 left-2.5 w-1.5 h-1.5 rounded-full bg-white" />
            </div>

            <span className="text-2xl font-black tracking-tight text-[#161338]">
              twodice
            </span>
          </div>

          {/* Links */}
          <div className="hidden lg:flex items-center gap-6 text-sm font-semibold text-[#374151]">
            {/* Game */}
            <div className="relative">
              <button
                onClick={() => setShowGameDropdown(!showGameDropdown)}
                className="flex items-center gap-1 hover:text-[#6C47FF] transition-colors cursor-pointer"
              >
                <span>Game</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {showGameDropdown && (
                <div className="absolute top-full left-0 mt-2 w-48 rounded-2xl bg-white border border-slate-100 shadow-xl p-2 z-40 space-y-1">
                  {['Mobile Legends', 'Free Fire', 'Roblox', 'Genshin Impact', 'PUBG Mobile'].map((g) => (
                    <button
                      key={g}
                      onClick={() => {
                        onSelectCategory(g);
                        setShowGameDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-purple-50 hover:text-[#6C47FF] transition-colors"
                    >
                      {g}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Cards */}
            <div className="relative">
              <button
                onClick={() => setShowCardsDropdown(!showCardsDropdown)}
                className="flex items-center gap-1 hover:text-[#6C47FF] transition-colors cursor-pointer"
              >
                <span>Cards</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {showCardsDropdown && (
                <div className="absolute top-full left-0 mt-2 w-48 rounded-2xl bg-white border border-slate-100 shadow-xl p-2 z-40 space-y-1">
                  {['Battle.net Gift Cards', 'Steam Wallet', 'PlayStation Cards', 'Apple iTunes'].map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        onSelectCategory(c);
                        setShowCardsDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-purple-50 hover:text-[#6C47FF] transition-colors"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => onSelectCategory('direct')}
              className="hover:text-[#6C47FF] transition-colors cursor-pointer"
            >
              Direct Top-Up
            </button>

            <button
              onClick={() => onSelectCategory('mobile')}
              className="hover:text-[#6C47FF] transition-colors cursor-pointer"
            >
              Mobile Charge
            </button>

            <button
              onClick={onOpenTrack}
              className="hover:text-[#6C47FF] transition-colors cursor-pointer text-xs font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-lg"
            >
              Track Order
            </button>
          </div>
        </div>

        {/* Right Action Icons & Register/Sign In */}
        <div className="flex items-center gap-3">
          {/* Search Icon button */}
          <button
            onClick={onOpenTrack}
            className="w-9 h-9 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
            title="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Instagram button */}
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="w-9 h-9 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors"
            title="Instagram"
          >
            <Instagram className="w-4 h-4" />
          </a>

          {/* Currency Dropdown: MYR / USD / KHR */}
          <div className="relative">
            <button
              onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:border-slate-300 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
            >
              <span className="text-sm">
                {currency === 'MYR' ? '🇲🇾' : currency === 'USD' ? '🇺🇸' : '🇰🇭'}
              </span>
              <span>{currency}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showCurrencyDropdown && (
              <div className="absolute right-0 top-full mt-2 w-36 rounded-2xl bg-white border border-slate-100 shadow-xl p-1.5 z-40 space-y-0.5 text-xs font-semibold">
                <button
                  onClick={() => {
                    setCurrency('MYR');
                    setShowCurrencyDropdown(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left ${currency === 'MYR' ? 'bg-purple-50 text-[#6C47FF]' : 'hover:bg-slate-50 text-slate-700'}`}
                >
                  <span>🇲🇾</span>
                  <span>MYR (RM)</span>
                </button>
                <button
                  onClick={() => {
                    setCurrency('USD');
                    setShowCurrencyDropdown(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left ${currency === 'USD' ? 'bg-purple-50 text-[#6C47FF]' : 'hover:bg-slate-50 text-slate-700'}`}
                >
                  <span>🇺🇸</span>
                  <span>USD ($)</span>
                </button>
                <button
                  onClick={() => {
                    setCurrency('KHR');
                    setShowCurrencyDropdown(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left ${currency === 'KHR' ? 'bg-purple-50 text-[#6C47FF]' : 'hover:bg-slate-50 text-slate-700'}`}
                >
                  <span>🇰🇭</span>
                  <span>KHR (៛)</span>
                </button>
              </div>
            )}
          </div>

          {/* Register / Sign In button */}
          {currentUser ? (
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#6C47FF] text-xs font-bold transition-all cursor-pointer"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span className="max-w-[100px] truncate">{currentUser.name}</span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-5 py-2.5 rounded-xl bg-[#635BFF] hover:bg-[#5349EE] text-white text-xs font-bold shadow-md shadow-purple-600/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer whitespace-nowrap"
            >
              Register/Sign In
            </button>
          )}
        </div>
      </nav>
    </div>
  );
};
