import React from 'react';
import { BrandLogo, AbaBankLogo, KhqrLogo, BakongLogo } from './Logos';
import { ShieldCheck, Lock, Heart } from 'lucide-react';

interface FooterProps {
  onSelectGame: (gameId: string) => void;
  onOpenContact: () => void;
  onOpenTrack: () => void;
  onOpenAdminAuth: () => void;
  lang: 'en' | 'kh';
}

export const Footer: React.FC<FooterProps> = ({
  onSelectGame,
  onOpenContact,
  onOpenTrack,
  onOpenAdminAuth,
  lang
}) => {
  return (
    <footer className="border-t border-white/10 bg-[#050814] text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand & Bio */}
          <div className="md:col-span-1 space-y-4">
            <BrandLogo />
            <p className="text-slate-400 text-xs leading-relaxed">
              The premier automated gaming top-up destination in Cambodia. Instant game credits for Mobile Legends, Free Fire, PUBG Mobile, and Roblox powered by official ABA PayWay and KHQR banking.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-cyan-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Authorized & Safe Top-Up</span>
            </div>
          </div>

          {/* Col 2: Games Supported */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4">Supported Games</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onSelectGame('mlbb')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Mobile Legends: Bang Bang Diamonds
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectGame('freefire')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Garena Free Fire Diamonds
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectGame('pubgm')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  PUBG Mobile UC & Royale Pass
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectGame('roblox')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Roblox Robux & Premium
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Care & Services */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4">Customer Care</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={onOpenTrack} className="hover:text-cyan-400 transition-colors">
                  Track In-Game Order
                </button>
              </li>
              <li>
                <button onClick={onOpenContact} className="hover:text-cyan-400 transition-colors">
                  Contact Support 24/7
                </button>
              </li>
              <li>
                <span className="text-slate-400">Payment Guides & FAQ</span>
              </li>
              <li>
                <span className="text-slate-400">Refund & Cancellation Policy</span>
              </li>
              <li>
                <button
                  onClick={onOpenAdminAuth}
                  className="text-purple-400 hover:text-purple-300 font-semibold"
                >
                  Admin / Super Admin Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Payments & Security */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4">Official Payment Gateway</h4>
            <div className="space-y-3">
              <p className="text-[11px] text-slate-400">
                Direct integration with Cambodia's leading payment platforms:
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <AbaBankLogo className="h-6" />
                <KhqrLogo className="h-6" />
                <BakongLogo className="h-5" />
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 text-[11px] text-slate-400 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <Lock className="w-3.5 h-3.5" />
                  <span>256-Bit SSL Encrypted Checkout</span>
                </div>
                <p>Funds settle securely through certified Cambodian banking switches.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} AuraTopUp Cambodia. All game logos and trademarks are property of their respective publishers (Moonton, Garena, Krafton, Roblox Corp).
          </div>
          <div className="flex items-center gap-4">
            <span>Terms of Service</span>
            <span>·</span>
            <span>Privacy Policy</span>
            <span>·</span>
            <span>KHQR Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
