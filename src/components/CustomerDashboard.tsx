import React, { useState, useEffect } from 'react';
import { User, Order } from '../types';
import { GameLogo } from './Logos';
import { ShoppingBag, User as UserIcon, Shield, Clock, CheckCircle2, ArrowRight } from 'lucide-react';

interface CustomerDashboardProps {
  currentUser: User;
  onLogout: () => void;
  onOpenTrack: (orderNumber: string) => void;
  onSelectGame: (gameId: string) => void;
  lang: 'en' | 'kh';
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  currentUser,
  onLogout,
  onOpenTrack,
  onSelectGame,
  lang
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCustomerOrders() {
      setIsLoading(true);
      try {
        const res = await fetch('/api/orders/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: currentUser.email })
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCustomerOrders();
  }, [currentUser.email]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Profile Overview Card */}
      <div className="rounded-3xl bg-slate-900/70 border border-white/10 p-6 sm:p-8 shadow-xl shadow-purple-950/30 mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-purple-900/40">
            <div className="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center text-xl font-black text-white">
              {currentUser.name.charAt(0)}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>{currentUser.name}</span>
              <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                VERIFIED CUSTOMER
              </span>
            </h2>
            <p className="text-xs text-slate-400">{currentUser.email}</p>
            <p className="text-[11px] text-slate-500 mt-1">
              Member since {new Date(currentUser.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectGame('mlbb')}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white shadow-md cursor-pointer"
          >
            New Top-Up
          </button>
          <button
            onClick={onLogout}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-rose-950/40 hover:text-rose-400 text-xs font-semibold text-slate-300 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Orders Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-cyan-400" />
            <span>My Purchase History ({orders.length})</span>
          </h3>
        </div>

        {orders.length === 0 && !isLoading ? (
          <div className="text-center p-12 rounded-3xl bg-slate-900/40 border border-white/5 space-y-3">
            <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto" />
            <h4 className="text-sm font-bold text-white">No Top-Ups Yet</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              You haven't made any top-up purchases yet. Choose a game to top up your credits in seconds!
            </p>
            <button
              onClick={() => onSelectGame('mlbb')}
              className="mt-2 px-5 py-2.5 rounded-xl bg-purple-600 text-xs font-bold text-white cursor-pointer"
            >
              Browse Games
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((o) => (
              <div
                key={o.id}
                className="p-5 rounded-2xl bg-slate-900/60 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-purple-500/20 transition-all"
              >
                <div className="flex items-center gap-3.5">
                  <GameLogo gameId={o.gameId} className="w-12 h-12 shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-white">{o.orderNumber}</span>
                      <span className="text-[10px] text-slate-500">{new Date(o.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h4 className="text-sm font-bold text-cyan-300">{o.productName}</h4>
                    <p className="text-xs text-slate-400 font-mono">
                      Target ID: {o.playerId} {o.zoneId ? `(${o.zoneId})` : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div className="text-right">
                    <span className="text-sm font-black text-white tabular-nums">${o.totalUsd.toFixed(2)}</span>
                    <span className="text-[10px] text-emerald-400 font-bold block">{o.deliveryStatus}</span>
                  </div>

                  <button
                    onClick={() => onOpenTrack(o.orderNumber)}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-purple-600 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    title="Track Delivery Status"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
