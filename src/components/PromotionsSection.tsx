import React from 'react';
import { Game } from '../types';
import { GameLogo } from './Logos';
import { Sparkles, ArrowRight, ShieldCheck, Flame } from 'lucide-react';
import fintechImage from '../assets/images/fintech_payment_art_1791085633314.jpg';

interface PromotionsSectionProps {
  onSelectGame: (gameId: string) => void;
  lang: 'en' | 'kh';
}

export const PromotionsSection: React.FC<PromotionsSectionProps> = ({ onSelectGame, lang }) => {
  return (
    <section id="promotions-section" className="py-16 border-t border-white/5 bg-[#070B18]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Limited Time Gaming Campaigns</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {lang === 'en' ? 'Exclusive Player Promotions' : 'ប្រូម៉ូសិនពិសេសសម្រាប់អ្នកលេងហ្គេម'}
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-md">
            Earn bonus diamonds, UC, and robux on every top-up paid through ABA KHQR. Instant delivery directly to your account.
          </p>
        </div>

        {/* Promo Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Promo 1: MLBB */}
          <div className="rounded-3xl bg-gradient-to-b from-purple-950/40 to-slate-900 border border-purple-500/30 p-6 flex flex-col justify-between space-y-4 hover:border-purple-400 transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <GameLogo gameId="mlbb" className="w-12 h-12" />
                <span className="text-[10px] font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-600/40">
                  +10% EXTRA
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">
                MLBB Weekly Diamond Pass
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Get 210 Diamonds + 70 Starlight points for only $1.99. Pay with ABA KHQR for instant credit.
              </p>
            </div>
            <button
              onClick={() => onSelectGame('mlbb')}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Claim Promotion</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Promo 2: Roblox */}
          <div className="rounded-3xl bg-gradient-to-b from-cyan-950/40 to-slate-900 border border-cyan-500/30 p-6 flex flex-col justify-between space-y-4 hover:border-cyan-400 transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <GameLogo gameId="roblox" className="w-12 h-12" />
                <span className="text-[10px] font-bold text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-600/40">
                  REAL AVATAR CHECK
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">
                Roblox 800 Robux + Bonus
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Verify your exact Roblox avatar and get +80 bonus Robux for only $9.60. Zero delay.
              </p>
            </div>
            <button
              onClick={() => onSelectGame('roblox')}
              className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Top-Up Robux</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Promo 3: PUBG */}
          <div className="rounded-3xl bg-gradient-to-b from-amber-950/40 to-slate-900 border border-amber-500/30 p-6 flex flex-col justify-between space-y-4 hover:border-amber-400 transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <GameLogo gameId="pubgm" className="w-12 h-12" />
                <span className="text-[10px] font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-600/40">
                  ROYALE PASS
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">
                PUBG Mobile 660 UC
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Upgrade your Royale Pass with 660 UC + 60 Bonus UC at only $9.80. Powered by ABA PayWay.
              </p>
            </div>
            <button
              onClick={() => onSelectGame('pubgm')}
              className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-xs font-bold text-slate-950 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Get PUBG UC</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
