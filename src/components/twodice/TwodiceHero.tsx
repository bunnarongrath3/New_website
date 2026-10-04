import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronRight, Sparkles } from 'lucide-react';
import heroImage from '../../assets/images/hero_gaming_banner_1791085620819.jpg';

interface TwodiceHeroProps {
  onShopNow: () => void;
}

export const TwodiceHero: React.FC<TwodiceHeroProps> = ({ onShopNow }) => {
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      brand: 'RIOT GAMES',
      headlinePrefix: 'UNLEASH YOUR',
      headlineHighlight: 'GAME POTENTIAL',
      subtitle: 'Top up your favorite games, fast, secure and reliable. Play more, worry less!',
      ctaText: 'Shop Now'
    },
    {
      brand: 'MOONTON MLBB',
      headlinePrefix: 'INSTANT DIAMONDS',
      headlineHighlight: 'DIRECT TOP-UP',
      subtitle: 'Enjoy 10% bonus diamonds on Weekly Diamond Pass and Twilight Pass packages.',
      ctaText: 'Top Up Diamonds'
    },
    {
      brand: 'ROBLOX ROBUX',
      headlinePrefix: 'VERIFIED AVATAR',
      headlineHighlight: 'ROBUX BUNDLES',
      subtitle: 'Official automated delivery straight to your Roblox character in seconds.',
      ctaText: 'Get Robux'
    }
  ];

  // Auto-advance slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const current = slides[activeSlide];

  return (
    <div className="px-6 sm:px-8 pt-6 pb-4">
      <div className="relative rounded-[24px] overflow-hidden min-h-[360px] sm:min-h-[420px] lg:min-h-[460px] flex items-center shadow-xl shadow-purple-900/10">
        {/* Background Image with Deep Contrast Scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Gaming Hero Banner"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-right md:object-center filter brightness-95 contrast-110"
          />
          {/* Gradient Scrim matching screenshot: dark purple/blue on left, clear on right */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#170E3B]/95 via-[#1C1248]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#120B2E]/90 via-transparent to-transparent" />
        </div>

        {/* Content Box */}
        <div className="relative z-10 p-8 sm:p-12 lg:p-16 max-w-2xl text-white">
          {/* Riot Games Brand Pill / Badge */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 backdrop-blur-md border border-white/20 text-[11px] font-black tracking-widest uppercase">
              {/* Riot Fist / Game Emblem */}
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-white">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <span>{current.brand}</span>
            </div>
          </div>

          {/* Large Headline */}
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] mb-4">
            <div>{current.headlinePrefix}</div>
            <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#A78BFA] via-[#C084FC] to-[#38BDF8] drop-shadow-sm">
              {current.headlineHighlight}
            </div>
          </h2>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-slate-200/90 mb-8 max-w-md leading-relaxed font-medium">
            {current.subtitle}
          </p>

          {/* Shop Now CTA Button */}
          <button
            onClick={onShopNow}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#7052FF] via-[#7B5CFF] to-[#6039FE] hover:from-[#6039FE] hover:to-[#5028EE] text-white text-xs sm:text-sm font-bold shadow-lg shadow-purple-600/40 border border-white/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <span>{current.ctaText}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom Pagination Slider Dots */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`transition-all duration-300 rounded-full h-1.5 cursor-pointer ${
                activeSlide === idx
                  ? 'w-7 bg-white shadow-md'
                  : 'w-2 bg-white/40 hover:bg-white/60'
              }`}
              title={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
