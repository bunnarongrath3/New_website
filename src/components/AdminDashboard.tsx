import React, { useState, useEffect } from 'react';
import { User, Order, Product } from '../types';
import { ShoppingCart, Package, Check, RefreshCw, Edit2, ShieldAlert, CheckCircle2, Search } from 'lucide-react';

interface AdminDashboardProps {
  currentUser: User;
  onLogout: () => void;
  lang: 'en' | 'kh';
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  onLogout,
  lang
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'stock'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [orderSearch, setOrderSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const headers = {
        'x-user-email': currentUser.email,
        'x-user-name': currentUser.name
      };

      const [ordersRes, prodsRes] = await Promise.all([
        fetch('/api/admin/orders', { headers }),
        fetch('/api/admin/products', { headers })
      ]);

      if (ordersRes.ok) setOrders(await ordersRes.json());
      if (prodsRes.ok) setProducts(await prodsRes.json());
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const triggerSuccessMsg = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(''), 3000);
  };

  const handleUpdateStatus = async (orderId: string, paymentStatus?: string, deliveryStatus?: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': currentUser.email,
          'x-user-name': currentUser.name
        },
        body: JSON.stringify({ paymentStatus, deliveryStatus })
      });

      if (res.ok) {
        triggerSuccessMsg('Order updated');
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': currentUser.email,
          'x-user-name': currentUser.name
        },
        body: JSON.stringify(editingProduct)
      });

      if (res.ok) {
        setEditingProduct(null);
        triggerSuccessMsg('Stock updated');
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredOrders = orders.filter(o => 
    !orderSearch.trim() ||
    o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
    o.playerId.toLowerCase().includes(orderSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100">
      {actionSuccessMsg && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-emerald-600 text-white shadow-xl flex items-center gap-2">
          <Check className="w-5 h-5" />
          <span className="text-xs font-bold">{actionSuccessMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-white/10 bg-[#0B1124]/90 px-4 sm:px-8 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-black text-white flex items-center gap-2">
            <span>Admin Operational Console</span>
            <span className="text-[10px] text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800">
              STAFF
            </span>
          </h1>
          <p className="text-xs text-slate-400">
            {currentUser.name} · Orders, Game ID Checks & Stock Management
          </p>
        </div>

        <button
          onClick={fetchData}
          disabled={isLoading}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/5 bg-slate-950/50 px-4 sm:px-8">
        <nav className="flex space-x-6 py-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 py-2 px-3 rounded-lg border transition-all ${
              activeTab === 'orders' ? 'bg-purple-900/40 text-cyan-300 border-cyan-500/40' : 'text-slate-400'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Orders & Verification ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('stock')}
            className={`flex items-center gap-2 py-2 px-3 rounded-lg border transition-all ${
              activeTab === 'stock' ? 'bg-purple-900/40 text-cyan-300 border-cyan-500/40' : 'text-slate-400'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Stock & Pricing ({products.length})</span>
          </button>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="relative">
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search Order ID or Player ID..."
                  className="w-72 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                />
              </div>
              <span className="text-xs text-slate-400">{filteredOrders.length} orders</span>
            </div>

            <div className="rounded-3xl bg-slate-900/70 border border-white/10 overflow-x-auto shadow-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider border-b border-white/5">
                  <tr>
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Game</th>
                    <th className="p-4">Player ID & Zone</th>
                    <th className="p-4">Verified Name</th>
                    <th className="p-4">Package</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Payment</th>
                    <th className="p-4">Delivery</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-800/40">
                      <td className="p-4 font-mono font-bold text-white">{o.orderNumber}</td>
                      <td className="p-4 uppercase font-bold text-slate-300">{o.gameId}</td>
                      <td className="p-4 font-mono text-cyan-300 font-bold">
                        {o.playerId} {o.zoneId ? `(${o.zoneId})` : ''}
                      </td>
                      <td className="p-4 text-emerald-400 font-semibold">
                        {o.verifiedAccountName || 'Manual Check'}
                      </td>
                      <td className="p-4 text-white font-medium">{o.productName}</td>
                      <td className="p-4 tabular-nums font-bold text-white">${o.totalUsd.toFixed(2)}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          o.paymentStatus === 'PAID' ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'
                        }`}>
                          {o.paymentStatus}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-slate-300">{o.deliveryStatus}</span>
                      </td>
                      <td className="p-4 text-right space-x-1 whitespace-nowrap">
                        {o.paymentStatus !== 'PAID' && (
                          <button
                            onClick={() => handleUpdateStatus(o.id, 'PAID', 'PROCESSING')}
                            className="px-2.5 py-1 rounded bg-purple-600 hover:bg-purple-500 font-bold text-white text-[11px]"
                          >
                            Confirm Pay
                          </button>
                        )}
                        {o.deliveryStatus !== 'COMPLETED' && (
                          <button
                            onClick={() => handleUpdateStatus(o.id, undefined, 'COMPLETED')}
                            className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 font-bold text-white text-[11px]"
                          >
                            Mark Delivered
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* STOCK TAB */}
        {activeTab === 'stock' && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white">Stock & Pricing Control</h2>
            <div className="rounded-3xl bg-slate-900/70 border border-white/10 overflow-x-auto shadow-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider border-b border-white/5">
                  <tr>
                    <th className="p-4">Game</th>
                    <th className="p-4">Product</th>
                    <th className="p-4">Price ($)</th>
                    <th className="p-4">Available Stock</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/40">
                      <td className="p-4 uppercase font-bold text-white">{p.gameId}</td>
                      <td className="p-4 font-bold text-slate-200">{p.name}</td>
                      <td className="p-4 font-mono font-bold text-cyan-300">${p.priceUsd.toFixed(2)}</td>
                      <td className="p-4">
                        {p.isUnlimitedStock ? 'Unlimited' : `${p.stock} units`}
                      </td>
                      <td className="p-4">
                        {p.stock <= 0 && !p.isUnlimitedStock ? (
                          <span className="text-rose-400 font-bold">Out of Stock</span>
                        ) : (
                          <span className="text-emerald-400 font-semibold">Available</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setEditingProduct(p)}
                          className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-[11px]"
                        >
                          Update Stock
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Quick Edit Stock Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-3xl bg-[#0B1124] border border-white/10 p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Update Stock: {editingProduct.name}</h3>
            <form onSubmit={handleSaveStock} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Price (USD)</label>
                <input
                  type="number"
                  step="0.01"
                  value={editingProduct.priceUsd}
                  onChange={(e) => setEditingProduct({ ...editingProduct, priceUsd: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Stock Count</label>
                <input
                  type="number"
                  disabled={editingProduct.isUnlimitedStock}
                  value={editingProduct.stock}
                  onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  checked={editingProduct.isUnlimitedStock}
                  onChange={(e) => setEditingProduct({ ...editingProduct, isUnlimitedStock: e.target.checked })}
                  className="rounded bg-slate-950 border-slate-700 text-purple-600"
                />
                <span className="text-slate-300">Set Unlimited Stock</span>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 font-bold text-white"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
