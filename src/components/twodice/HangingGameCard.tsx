import React from 'react';

export interface GameItem {
  id: string;
  name: string;
  category?: string;
  discountBadge?: string;
  tag?: string;
  imageUrl: string;
  publisher?: string;
  startingPriceUsd: number;
}

interface HangingGameCardProps {
  item: GameItem;
  currency: 'MYR' | 'USD' | 'KHR';
  onSelect: (item: GameItem) => void;
}

export const HangingGameCard: React.FC<HangingGameCardProps> = ({ item, currency, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(item)}
      className="group relative rounded-[20px] bg-white border border-slate-200/80 hover:border-[#6C47FF]/40 p-3 pt-2.5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10 cursor-pointer select-none"
    >
      {/* Authentic Retail Hanger Punch Slot */}
      <div className="w-10 h-1.5 rounded-full bg-slate-200 group-hover:bg-[#C4B5FD] mx-auto mb-2 transition-colors" />

      {/* Image Container with Discount Badge */}
      <div className="relative aspect-square w-full rounded-[14px] overflow-hidden bg-slate-100 mb-3 shadow-inner">
        <img
          src={item.imageUrl}
          alt={item.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Discount Badge on bottom right */}
        {item.discountBadge && (
          <div className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded-full bg-[#5833EF] text-white text-[10px] font-black tracking-tight shadow-md">
            {item.discountBadge}
          </div>
        )}
      </div>

      {/* Title */}
      <div className="space-y-2 mb-1">
        <h4 className="text-[13px] font-bold text-[#1F2937] group-hover:text-[#6C47FF] transition-colors line-clamp-1 leading-snug" title={item.name}>
          {item.name}
        </h4>

        {/* Bottom Tag Pill */}
        <div className="flex items-center justify-between">
          <span className="inline-block px-2 py-0.5 rounded-md bg-[#F3F0FF] text-[#6C47FF] text-[10px] font-bold">
            {item.tag || 'Promo'}
          </span>

          <span className="text-[11px] font-bold text-slate-500 font-mono">
            {currency === 'MYR' 
              ? `RM ${(item.startingPriceUsd * 4.45).toFixed(1)}`
              : currency === 'KHR'
              ? `${Math.round(item.startingPriceUsd * 4100).toLocaleString()} ៛`
              : `$${item.startingPriceUsd.toFixed(2)}`}
          </span>
        </div>
      </div>
    </div>
  );
};
