import React, { useState, useEffect } from 'react';
import { Game, Product, Order, User, PaymentMethodType } from './types';
import { EXCLUSIVE_OFFERS, LATEST_PRODUCTS } from './data/twodiceData';
import { GameItem } from './components/twodice/HangingGameCard';
import { TwodiceNavbar } from './components/twodice/TwodiceNavbar';
import { TwodiceHero } from './components/twodice/TwodiceHero';
import { ExclusiveOffersSection } from './components/twodice/ExclusiveOffersSection';
import { LatestProductsSection } from './components/twodice/LatestProductsSection';
import { GameTopUpModal } from './components/GameTopUpModal';
import { PurchaseConfirmModal } from './components/PurchaseConfirmModal';
import { PaymentModal } from './components/PaymentModal';
import { OrderTrackingView } from './components/OrderTrackingView';
import { AuthModal } from './components/AuthModal';
import { SuperAdminDashboard } from './components/SuperAdminDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { AbaBankLogo, KhqrLogo, BakongLogo } from './components/Logos';
import { ShieldCheck, Lock, Headphones, RefreshCw, Sparkles, ChevronRight } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'track' | 'admin' | 'superadmin'>('home');
  const [currency, setCurrency] = useState<'MYR' | 'USD' | 'KHR'>('MYR');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Store data from server
  const [games, setGames] = useState<Game[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  // Modals & Flow
  const [selectedGameForTopUp, setSelectedGameForTopUp] = useState<Game | null>(null);
  const [pendingConfirmData, setPendingConfirmData] = useState<any>(null);
  const [activePaymentOrder, setActivePaymentOrder] = useState<Order | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [trackingOrderNumber, setTrackingOrderNumber] = useState<string>('');
  const [isSubmittingOrder, setIsSubmittingOrder] = useState<boolean>(false);

  // Fetch games & products from backend
  useEffect(() => {
    async function loadData() {
      try {
        const [gRes, pRes] = await Promise.all([
          fetch('/api/games'),
          fetch('/api/products')
        ]);
        if (gRes.ok) setGames(await gRes.json());
        if (pRes.ok) setProducts(await pRes.json());
      } catch (err) {
        console.error(err);
      }
    }
    loadData();
  }, []);

  // Map GameItem to Game for top-up modal
  const handleSelectGameItem = (item: GameItem) => {
    // Look up game in database or construct compatible game config
    let matchedGame = games.find(g => g.id === item.id);
    if (!matchedGame) {
      if (item.id === 'mlbb') matchedGame = games.find(g => g.id === 'mlbb');
      else if (item.id === 'freefire') matchedGame = games.find(g => g.id === 'freefire');
      else if (item.id === 'roblox') matchedGame = games.find(g => g.id === 'roblox');
      else {
        // Fallback for Genshin, Identity V, Ragnarok, etc.
        matchedGame = {
          id: item.id as any,
          name: item.name,
          publisher: item.publisher || 'Game Publisher',
          tagline: `Instant ${item.name} In-Game Credits Top-Up`,
          category: item.category || 'Online Game',
          idLabel: 'Player ID / User ID',
          idPlaceholder: 'e.g. 192837465',
          hasZoneId: false,
          guideNote: `Enter your exact ${item.name} Player ID. Our automated server dispatches credits immediately after payment confirmation.`,
          color: '#6C47FF'
        };
      }
    }

    if (matchedGame) {
      setSelectedGameForTopUp(matchedGame);
    }
  };

  const handleProceedToConfirm = (orderData: any) => {
    setSelectedGameForTopUp(null);
    setPendingConfirmData(orderData);
  };

  const handleConfirmPurchase = async () => {
    if (!pendingConfirmData) return;
    setIsSubmittingOrder(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameId: pendingConfirmData.game.id,
          productId: pendingConfirmData.product.id,
          playerId: pendingConfirmData.playerId,
          zoneId: pendingConfirmData.zoneId,
          verifiedAccountName: pendingConfirmData.verifiedAccountName,
          verifiedAvatarUrl: pendingConfirmData.verifiedAvatarUrl,
          paymentMethod: pendingConfirmData.paymentMethod,
          customerName: currentUser?.name || undefined,
          customerEmail: currentUser?.email || pendingConfirmData.customerEmail,
          customerPhone: currentUser?.phone || pendingConfirmData.customerPhone,
          currency: currency === 'KHR' ? 'KHR' : 'USD'
        })
      });

      if (res.ok) {
        const createdOrder: Order = await res.json();
        setPendingConfirmData(null);
        setActivePaymentOrder(createdOrder);
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to place order');
      }
    } catch (e) {
      alert('Network error while processing order.');
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  // Get active products for current selected game
  const activeProducts = selectedGameForTopUp
    ? products.filter(p => p.gameId === selectedGameForTopUp.id).length > 0
      ? products.filter(p => p.gameId === selectedGameForTopUp.id)
      : [
          { id: 'item-1', gameId: selectedGameForTopUp.id, name: 'Small Bundle', itemCount: 60, itemUnit: 'Credits', priceUsd: 0.99, stock: 500, isUnlimitedStock: true, soldCount: 140, isActive: true },
          { id: 'item-2', gameId: selectedGameForTopUp.id, name: 'Standard Pack', itemCount: 300, itemUnit: 'Credits', priceUsd: 4.99, bonus: '+30 Bonus', stock: 500, isUnlimitedStock: true, soldCount: 420, isActive: true, isPopular: true },
          { id: 'item-3', gameId: selectedGameForTopUp.id, name: 'Special Pass', itemCount: 1, itemUnit: 'Pass', priceUsd: 9.99, bonus: '30-Day Rewards', stock: 500, isUnlimitedStock: true, soldCount: 890, isActive: true, isPopular: true },
          { id: 'item-4', gameId: selectedGameForTopUp.id, name: 'Pro Vault Pack', itemCount: 2000, itemUnit: 'Credits', priceUsd: 29.99, bonus: '+400 Bonus', stock: 200, isUnlimitedStock: false, soldCount: 180, isActive: true }
        ]
    : [];

  return (
    <div className="min-h-screen bg-[#EDE8F9] text-slate-800 font-sans relative overflow-x-hidden selection:bg-[#635BFF] selection:text-white py-4 sm:py-8 px-2 sm:px-6 lg:px-12 flex justify-center">
      {/* Decorative Floating 3D Geometric Prismatic Shards (Matching exact screenshot background) */}
      <div className="fixed top-24 left-3 w-36 h-72 opacity-40 pointer-events-none transform -rotate-12 hidden xl:block">
        <div className="w-full h-full bg-gradient-to-br from-purple-300 to-indigo-200/50 rounded-3xl filter blur-[1px] shadow-2xl transform skew-y-12" />
      </div>
      <div className="fixed top-96 left-6 w-24 h-48 opacity-30 pointer-events-none transform rotate-45 hidden xl:block">
        <div className="w-full h-full bg-gradient-to-tr from-purple-400/40 to-white/60 rounded-2xl filter blur-[1px]" />
      </div>

      <div className="fixed top-36 right-4 w-44 h-80 opacity-40 pointer-events-none transform rotate-12 hidden xl:block">
        <div className="w-full h-full bg-gradient-to-bl from-purple-300 to-indigo-200/50 rounded-3xl filter blur-[1px] shadow-2xl transform -skew-y-12" />
      </div>
      <div className="fixed top-[480px] right-8 w-28 h-56 opacity-30 pointer-events-none transform -rotate-45 hidden xl:block">
        <div className="w-full h-full bg-gradient-to-tl from-purple-400/40 to-white/60 rounded-2xl filter blur-[1px]" />
      </div>

      {/* Main Centered twodice Window Container (Matching screenshot exact rounded-3xl white card) */}
      <div className="w-full max-w-[1360px] bg-white rounded-[28px] shadow-2xl shadow-purple-900/10 border border-purple-200/40 overflow-hidden flex flex-col relative z-10">
        {/* Navbar */}
        <TwodiceNavbar
          currentUser={currentUser}
          onOpenAuth={() => setShowAuthModal(true)}
          onOpenTrack={() => setCurrentView(currentView === 'track' ? 'home' : 'track')}
          onOpenAdmin={() => {
            if (currentUser?.role === 'SUPER_ADMIN') setCurrentView('superadmin');
            else if (currentUser?.role === 'ADMIN') setCurrentView('admin');
            else setShowAuthModal(true);
          }}
          currency={currency}
          setCurrency={setCurrency}
          onSelectCategory={(cat) => {
            const el = document.getElementById('exclusive-offers');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Dynamic Views */}
        {currentView === 'track' ? (
          <div className="p-6 bg-slate-900 text-white min-h-[500px]">
            <OrderTrackingView
              initialOrderNumber={trackingOrderNumber}
              onSelectOrderForPayment={(order) => setActivePaymentOrder(order)}
              lang="en"
            />
          </div>
        ) : currentView === 'superadmin' && currentUser?.role === 'SUPER_ADMIN' ? (
          <SuperAdminDashboard
            currentUser={currentUser}
            onLogout={() => {
              setCurrentUser(null);
              setCurrentView('home');
            }}
            lang="en"
          />
        ) : currentView === 'admin' && currentUser ? (
          <AdminDashboard
            currentUser={currentUser}
            onLogout={() => {
              setCurrentUser(null);
              setCurrentView('home');
            }}
            lang="en"
          />
        ) : (
          /* HOMEPAGE matching screenshot */
          <div className="space-y-2">
            {/* Hero Section */}
            <TwodiceHero
              onShopNow={() => {
                const el = document.getElementById('exclusive-offers');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Exclusive Offers Section (6 hanging cards matching screenshot) */}
            <div id="exclusive-offers">
              <ExclusiveOffersSection
                items={EXCLUSIVE_OFFERS}
                currency={currency}
                onSelectGame={handleSelectGameItem}
                onViewMore={() => {
                  const el = document.getElementById('latest-products');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              />
            </div>

            {/* Latest Products Section (6 hanging cards matching screenshot) */}
            <div id="latest-products">
              <LatestProductsSection
                items={LATEST_PRODUCTS}
                currency={currency}
                onSelectGame={handleSelectGameItem}
                onViewMore={() => {
                  alert('Explore our complete digital voucher catalog.');
                }}
              />
            </div>

            {/* Feature Trust Strip */}
            <div className="mx-6 sm:mx-8 my-8 p-6 rounded-2xl bg-gradient-to-r from-purple-50 via-white to-purple-50 border border-purple-100 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-[#6C47FF]/10 text-[#6C47FF] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-slate-900">Official Game Direct Top-Up</h5>
                  <p className="text-xs text-slate-500">100% authorized publisher credits delivered in under 60 seconds.</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-[#6C47FF]/10 text-[#6C47FF] flex items-center justify-center shrink-0">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-slate-900">Certified Instant Payment</h5>
                  <p className="text-xs text-slate-500">Official ABA Bank, KHQR, FPX, and 3D Secure checkout.</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-[#6C47FF]/10 text-[#6C47FF] flex items-center justify-center shrink-0">
                  <Headphones className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-slate-900">24/7 Dedicated Support</h5>
                  <p className="text-xs text-slate-500">Live chat & Telegram support agents ready to help anytime.</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <footer className="w-full bg-[#161338] text-slate-300 py-12 px-6 sm:px-12 border-t border-purple-900/30">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-xs">
                {/* Brand */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#5833EF] to-[#8E72FF] p-1 flex items-center justify-center text-white">
                      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-white" stroke="currentColor" strokeWidth="2.5">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                      </svg>
                    </div>
                    <span className="text-xl font-black text-white">twodice</span>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Top up your favorite games fast, secure and reliable. Play more, worry less with twodice gaming digital marketplace.
                  </p>
                </div>

                {/* Games */}
                <div>
                  <h5 className="font-bold text-white mb-3 uppercase tracking-wider text-[11px]">Popular Games</h5>
                  <ul className="space-y-2 text-slate-400">
                    <li>Mobile Legends: Bang Bang</li>
                    <li>Garena Free Fire MAX</li>
                    <li>Roblox Robux</li>
                    <li>Genshin Impact Genesis Crystals</li>
                    <li>PUBG Mobile UC</li>
                  </ul>
                </div>

                {/* Customer Care */}
                <div>
                  <h5 className="font-bold text-white mb-3 uppercase tracking-wider text-[11px]">Help & Service</h5>
                  <ul className="space-y-2 text-slate-400">
                    <li>
                      <button onClick={() => setCurrentView('track')} className="hover:text-white">
                        Track Order Status
                      </button>
                    </li>
                    <li>Terms of Service</li>
                    <li>Privacy Policy</li>
                    <li>Refund & Return Policy</li>
                    <li>
                      <button
                        onClick={() => setShowAuthModal(true)}
                        className="text-purple-400 hover:text-purple-300 font-semibold"
                      >
                        Admin & Staff Login
                      </button>
                    </li>
                  </ul>
                </div>

                {/* Payment Methods */}
                <div>
                  <h5 className="font-bold text-white mb-3 uppercase tracking-wider text-[11px]">Supported Payments</h5>
                  <div className="space-y-2 text-slate-400">
                    <p className="text-[11px]">Pay effortlessly with local and regional payment switches:</p>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <AbaBankLogo className="h-6" />
                      <KhqrLogo className="h-6" />
                      <BakongLogo className="h-5" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
                <div>© 2024–2026 twodice. All rights reserved. All trademarks belong to their respective owners.</div>
                <div>Singapore · Malaysia · Cambodia · Global Direct Top-Up</div>
              </div>
            </footer>
          </div>
        )}
      </div>

      {/* TOP-UP MODAL (When clicking any card) */}
      {selectedGameForTopUp && (
        <GameTopUpModal
          game={selectedGameForTopUp}
          products={activeProducts}
          onClose={() => setSelectedGameForTopUp(null)}
          onProceedToConfirm={handleProceedToConfirm}
          lang="en"
        />
      )}

      {/* PURCHASE CONFIRM MODAL */}
      {pendingConfirmData && (
        <PurchaseConfirmModal
          orderData={pendingConfirmData}
          onCancel={() => {
            setSelectedGameForTopUp(pendingConfirmData.game);
            setPendingConfirmData(null);
          }}
          onConfirm={handleConfirmPurchase}
          isLoading={isSubmittingOrder}
          lang="en"
        />
      )}

      {/* PAYMENT MODAL (ABA Bank & KHQR / Online Banking) */}
      {activePaymentOrder && (
        <PaymentModal
          order={activePaymentOrder}
          onClose={() => setActivePaymentOrder(null)}
          onPaymentSuccess={(order) => setActivePaymentOrder(order)}
          onOpenTrack={(orderNum) => {
            setActivePaymentOrder(null);
            setTrackingOrderNumber(orderNum);
            setCurrentView('track');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          lang="en"
        />
      )}

      {/* AUTH MODAL */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            if (user.role === 'SUPER_ADMIN') setCurrentView('superadmin');
            else if (user.role === 'ADMIN') setCurrentView('admin');
            else setCurrentView('home');
          }}
          lang="en"
        />
      )}
    </div>
  );
}
