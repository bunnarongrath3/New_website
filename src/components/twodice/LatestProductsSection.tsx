import React from 'react';
import { Star, ChevronRight } from 'lucide-react';
import { HangingGameCard, GameItem } from './HangingGameCard';

interface LatestProductsSectionProps {
  items: GameItem[];
  currency: 'MYR' | 'USD' | 'KHR';
  onSelectGame: (game: GameItem) => void;
  onViewMore: () => void;
}

export const LatestProductsSection: React.FC<LatestProductsSectionProps> = ({
  items,
  currency,
  onSelectGame,
  onViewMore
}) => {
  return (
    <section className="px-6 sm:px-8 py-8 border-t border-slate-100">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          {/* Star Icon */}
          <div className="w-10 h-10 rounded-2xl bg-[#EDE9FE] text-[#6C47FF] flex items-center justify-center shrink-0">
            <Star className="w-5 h-5 fill-[#6C47FF]" />
          </div>

          <div>
            <h3 className="text-xl sm:text-2xl font-black text-[#161338] tracking-tight">
              Latest Products
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Explore freshly released direct top-up titles and digital vouchers.
            </p>
          </div>
        </div>

        {/* View more > button */}
        <button
          onClick={onViewMore}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-slate-200 hover:border-[#6C47FF] hover:bg-purple-50 text-slate-700 hover:text-[#6C47FF] text-xs font-bold transition-all self-start sm:self-center cursor-pointer"
        >
          <span>View more</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Grid of 6 hanging cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {items.map((item) => (
          <HangingGameCard
            key={item.id}
            item={item}
            currency={currency}
            onSelect={onSelectGame}
          />
        ))}
      </div>
    </section>
  );
};
