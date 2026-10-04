import React from 'react';
import { Game } from '../types';
import { GameLogo } from './Logos';
import { ArrowRight, Sparkles } from 'lucide-react';

interface GameCardProps {
  game: Game;
  onSelect: (game: Game) => void;
  lang: 'en' | 'kh';
}

const GAME_METADATA: Record<string, { startingPrice: string; productsCount: string; highlight: string; accentColor: string }> = {
  mlbb: {
    startingPrice: '$1.40',
    productsCount: '10 Diamond Packages & Passes',
    highlight: 'Weekly Pass & Diamonds',
    accentColor: 'from-purple-900/60 to-indigo-950/80 border-purple-500/30 hover:border-purple-400'
  },
  freefire: {
    startingPrice: '$0.95',
    productsCount: '7 Diamond & Membership Packs',
    highlight: 'Instant UID Top-Up',
    accentColor: 'from-orange-950/60 to-red-950/80 border-orange-500/30 hover:border-orange-400'
  },
  pubgm: {
    startingPrice: '$0.99',
    productsCount: '7 UC Packs & Royale Pass',
    highlight: 'Official UC Delivery',
    accentColor: 'from-amber-950/60 to-yellow-950/80 border-amber-500/30 hover:border-amber-400'
  },
  roblox: {
    startingPrice: '$0.99',
    productsCount: '7 Robux Packs & Premium',
    highlight: 'Real Avatar Verification',
    accentColor: 'from-cyan-950/60 to-blue-950/80 border-cyan-500/30 hover:border-cyan-400'
  }
};

export const GameCard: React.FC<GameCardProps> = ({ game, onSelect, lang }) => {
  const meta = GAME_METADATA[game.id] || {
    startingPrice: '$1.00',
    productsCount: 'Multiple Packages',
    highlight: 'Instant Top-Up',
    accentColor: 'from-slate-900 to-slate-950 border-slate-700 hover:border-slate-500'
  };

  return (
    <div
      onClick={() => onSelect(game)}
      className={`group relative rounded-2xl p-6 bg-gradient-to-b ${meta.accentColor} border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-purple-950/50 cursor-pointer flex flex-col justify-between overflow-hidden`}
    >
      {/* Decorative ambient glow */}
      <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-white/5 blur-2xl group-hover:bg-white/10 transition-colors pointer-events-none" />

      {/* Top row: Game Logo + Category */}
      <div>
        <div className="flex items-start justify-between gap-4 mb-5">
          <GameLogo gameId={game.id} className="w-16 h-16 shrink-0" />
          <div className="text-right">
            <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase block">
              {game.publisher}
            </span>
            <span className="text-xs text-cyan-400 font-medium flex items-center justify-end gap-1 mt-0.5">
              <Sparkles className="w-3 h-3" />
              <span>{meta.highlight}</span>
            </span>
          </div>
        </div>

        {/* Game Name */}
        <h3 className="text-xl font-bold text-white mb-1.5 group-hover:text-cyan-300 transition-colors">
          {game.name}
        </h3>

        {/* Tagline / Subtitle */}
        <p className="text-xs text-slate-300 line-clamp-2 mb-6 leading-relaxed">
          {game.tagline}
        </p>

        {/* Product specs */}
        <div className="space-y-1.5 py-3 border-y border-white/5 mb-6 text-xs text-slate-400">
          <div className="flex justify-between items-center">
            <span>Available:</span>
            <span className="font-semibold text-slate-200">{meta.productsCount}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Delivery:</span>
            <span className="font-medium text-emerald-400">Instant Automated</span>
          </div>
        </div>
      </div>

      {/* Bottom row: Price & Buy Button */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <div>
          <span className="text-[11px] text-slate-400 block">{lang === 'en' ? 'Starting from' : 'ចាប់ផ្តើមពី'}</span>
          <span className="text-lg font-black text-white tabular-nums">
            {meta.startingPrice}
          </span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(game);
          }}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white text-white hover:text-slate-900 border border-white/20 text-xs font-bold transition-all duration-200 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-cyan-500 group-hover:text-white group-hover:border-transparent group-hover:shadow-lg group-hover:shadow-purple-900/40"
        >
          <span>{lang === 'en' ? 'Buy Now' : 'ទិញឥឡូវ'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
