import React, { useState, useEffect } from 'react';
import { User, Order, Product, PaymentGatewaySettings, WebsiteSettings, ActivityLog } from '../types';
import { GameLogo, AbaBankLogo, KhqrLogo } from './Logos';
import {
  DollarSign, ShoppingCart, Clock, CheckCircle2, AlertTriangle, Users, Package,
  Settings, Key, ShieldCheck, Plus, Trash2, Edit2, Check, RefreshCw, X, Eye, FileText
} from 'lucide-react';

interface SuperAdminDashboardProps {
  currentUser: User;
  onLogout: () => void;
  lang: 'en' | 'kh';
}

export const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({
  currentUser,
  onLogout,
  lang
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'payments' | 'admins' | 'logs' | 'settings'>('overview');
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [adminUsers, setAdminUsers] = useState<User[]>([]);
  const [paymentSettings, setPaymentSettings] = useState<PaymentGatewaySettings | null>(null);
  const [websiteSettings, setWebsiteSettings] = useState<WebsiteSettings | null>(null);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Filter states for orders
  const [orderGameFilter, setOrderGameFilter] = useState('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [orderSearch, setOrderSearch] = useState('');

  // Modals
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [showAddAdminModal, setShowAddAdminModal] = useState<boolean>(false);
  const [newAdminForm, setNewAdminForm] = useState({ name: '', email: '', password: '', role: 'ADMIN', phone: '' });
  const [rejectingOrder, setRejectingOrder] = useState<Order | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string>('');

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const headers = {
        'x-user-email': currentUser.email,
        'x-user-name': currentUser.name
      };

      const [statsRes, ordersRes, prodsRes, usersRes, payRes, logsRes, settingsRes] = await Promise.all([
        fetch('/api/admin/stats', { headers }),
        fetch('/api/admin/orders', { headers }),
        fetch('/api/admin/products', { headers }),
        fetch('/api/admin/users', { headers }),
        fetch('/api/admin/payment-settings', { headers }),
        fetch('/api/admin/logs', { headers }),
        fetch('/api/settings')
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (ordersRes.ok) setOrders(await ordersRes.json());
      if (prodsRes.ok) setProducts(await prodsRes.json());
      if (usersRes.ok) setAdminUsers(await usersRes.json());
      if (payRes.ok) setPaymentSettings(await payRes.json());
      if (logsRes.ok) setLogs(await logsRes.json());
      if (settingsRes.ok) setWebsiteSettings(await settingsRes.json());
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const triggerSuccessMsg = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(''), 3000);
  };

  // Order status update
  const handleUpdateOrderStatus = async (orderId: string, paymentStatus?: string, deliveryStatus?: string, reason?: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': currentUser.email,
          'x-user-name': currentUser.name
        },
        body: JSON.stringify({ paymentStatus, deliveryStatus, rejectionReason: reason })
      });

      if (res.ok) {
        triggerSuccessMsg('Order updated successfully');
        fetchAllData();
      }
    } catch (e) {
      console.error('Update status error:', e);
    }
  };

  // Save Product (Add or Edit)
  const handleSaveProduct = async (e: React.FormEvent) => {
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
        triggerSuccessMsg('Product saved successfully');
        fetchAllData();
      }
    } catch (e) {
      console.error('Save product error:', e);
    }
  };

  // Delete product
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: {
          'x-user-email': currentUser.email,
          'x-user-name': currentUser.name
        }
      });
      if (res.ok) {
        triggerSuccessMsg('Product deleted');
        fetchAllData();
      }
    } catch (e) {
      console.error('Delete product error:', e);
    }
  };

  // Save Payment Settings
  const handleSavePaymentSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentSettings) return;

    try {
      const res = await fetch('/api/admin/payment-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': currentUser.email,
          'x-user-name': currentUser.name
        },
        body: JSON.stringify(paymentSettings)
      });

      if (res.ok) {
        triggerSuccessMsg('ABA PayWay & KHQR Settings saved!');
        fetchAllData();
      }
    } catch (e) {
      console.error('Save payment settings error:', e);
    }
  };

  // Create Admin
  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-email': currentUser.email,
          'x-user-name': currentUser.name
        },
        body: JSON.stringify(newAdminForm)
      });

      if (res.ok) {
        setShowAddAdminModal(false);
        setNewAdminForm({ name: '', email: '', password: '', role: 'ADMIN', phone: '' });
        triggerSuccessMsg('New administrator created successfully');
        fetchAllData();
      } else {
        const d = await res.json();
        alert(d.error || 'Failed to create admin');
      }
    } catch (e) {
      console.error('Create admin error:', e);
    }
  };

  // Delete Admin
  const handleDeleteAdmin = async (id: string) => {
    if (!confirm('Are you sure you want to delete this admin account?')) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: {
          'x-user-email': currentUser.email,
          'x-user-name': currentUser.name
        }
      });

      if (res.ok) {
        triggerSuccessMsg('Admin removed');
        fetchAllData();
      }
    } catch (e) {
      console.error('Delete admin error:', e);
    }
  };

  // Filtered orders
  const filteredOrders = orders.filter(o => {
    const matchesGame = orderGameFilter === 'all' || o.gameId === orderGameFilter;
    const matchesStatus = orderStatusFilter === 'all' || o.paymentStatus === orderStatusFilter || o.deliveryStatus === orderStatusFilter;
    const matchesSearch = !orderSearch.trim() || 
      o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.playerId.toLowerCase().includes(orderSearch.toLowerCase()) ||
      (o.verifiedAccountName && o.verifiedAccountName.toLowerCase().includes(orderSearch.toLowerCase()));
    return matchesGame && matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100">
      {/* Top Banner & Alert */}
      {actionSuccessMsg && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-emerald-600 text-white shadow-xl flex items-center gap-2 animate-in fade-in duration-200">
          <Check className="w-5 h-5" />
          <span className="text-xs font-bold">{actionSuccessMsg}</span>
        </div>
      )}

      {/* Admin Navbar */}
      <div className="border-b border-white/10 bg-[#0B1124]/90 backdrop-blur-xl px-4 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-md">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-black text-white flex items-center gap-2">
              <span>Super Admin Master Control</span>
              <span className="text-[10px] font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                FULL ACCESS
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Welcome, {currentUser.name} ({currentUser.email})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchAllData}
            disabled={isLoading}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Refresh System Data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh Data</span>
          </button>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="border-b border-white/5 bg-slate-950/50 px-4 sm:px-8">
        <nav className="flex space-x-6 overflow-x-auto py-2 text-xs font-semibold">
          {[
            { id: 'overview', label: 'Dashboard Overview', icon: DollarSign },
            { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingCart },
            { id: 'products', label: `Stock Management (${products.length})`, icon: Package },
            { id: 'payments', label: 'ABA & KHQR Gateway', icon: Key },
            { id: 'admins', label: 'Admin Accounts', icon: Users },
            { id: 'logs', label: 'Audit Activity Logs', icon: FileText }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-2.5 px-3 rounded-lg border transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-purple-900/40 text-cyan-300 border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white border-transparent'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* TAB 1: OVERVIEW & CHARTS */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Stat Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/5 shadow-md">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Total Revenue
                </span>
                <span className="text-2xl sm:text-3xl font-black text-cyan-400 tabular-nums">
                  ${stats.totalRevenue.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">
                  ≈ {(stats.totalRevenue * 4100).toLocaleString()} ៛ KHR
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/5 shadow-md">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Total Orders
                </span>
                <span className="text-2xl sm:text-3xl font-black text-white tabular-nums">
                  {stats.totalOrders}
                </span>
                <span className="text-[10px] text-emerald-400 block mt-1">
                  {stats.completedOrders} Delivered ({Math.round((stats.completedOrders / (stats.totalOrders || 1)) * 100)}%)
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/5 shadow-md">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Pending Verification
                </span>
                <span className="text-2xl sm:text-3xl font-black text-amber-400 tabular-nums">
                  {stats.pendingOrders}
                </span>
                <span className="text-[10px] text-amber-300/80 block mt-1">
                  Awaiting payment/clearance
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/5 shadow-md">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Low Stock Alerts
                </span>
                <span className="text-2xl sm:text-3xl font-black text-rose-400 tabular-nums">
                  {stats.lowStockAlerts}
                </span>
                <span className="text-[10px] text-rose-300/80 block mt-1">
                  Products ≤ 100 units
                </span>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily Revenue Trend (Last 7 Days) */}
              <div className="p-6 rounded-3xl bg-slate-900/70 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">Daily Revenue (Last 7 Days)</h3>
                  <span className="text-xs text-cyan-400 font-mono font-bold">USD</span>
                </div>

                {/* Visual SVG Bar Chart */}
                <div className="h-52 flex items-end justify-between gap-3 pt-6 pb-2 px-2">
                  {stats.dailyRevenue.map((d: any, idx: number) => {
                    const max = 1500;
                    const heightPercent = Math.min(100, Math.max(15, (d.revenue / max) * 100));
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                        <span className="text-[10px] font-mono text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity tabular-nums">
                          ${d.revenue}
                        </span>
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className="w-full max-w-[40px] rounded-t-lg bg-gradient-to-t from-purple-700 to-cyan-400 group-hover:from-purple-500 group-hover:to-cyan-300 transition-all shadow-md shadow-purple-950/40"
                        />
                        <span className="text-[11px] font-medium text-slate-400">
                          {d.day}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Monthly Revenue Chart */}
              <div className="p-6 rounded-3xl bg-slate-900/70 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">Monthly Revenue Growth</h3>
                  <span className="text-xs text-emerald-400 font-semibold">+38% MoM</span>
                </div>

                {/* Visual Trend Bars */}
                <div className="h-52 flex items-end justify-between gap-3 pt-6 pb-2 px-2">
                  {stats.monthlyRevenue.map((m: any, idx: number) => {
                    const max = 7000;
                    const heightPercent = Math.min(100, Math.max(15, (m.revenue / max) * 100));
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                        <span className="text-[10px] font-mono text-white opacity-0 group-hover:opacity-100 transition-opacity tabular-nums">
                          ${m.revenue}
                        </span>
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className="w-full max-w-[40px] rounded-t-lg bg-gradient-to-t from-indigo-700 to-purple-500 group-hover:from-indigo-600 group-hover:to-purple-400 transition-all shadow-md"
                        />
                        <span className="text-[11px] font-medium text-slate-400">
                          {m.month}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Sales by Game Breakdown */}
            <div className="p-6 rounded-3xl bg-slate-900/70 border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white">Sales Distribution by Game</h3>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {[
                  { id: 'mlbb', name: 'Mobile Legends', count: stats.salesByGame?.mlbb?.count || 142, revenue: stats.salesByGame?.mlbb?.revenue || 4820 },
                  { id: 'freefire', name: 'Garena Free Fire', count: stats.salesByGame?.freefire?.count || 118, revenue: stats.salesByGame?.freefire?.revenue || 2940 },
                  { id: 'pubgm', name: 'PUBG Mobile', count: stats.salesByGame?.pubgm?.count || 94, revenue: stats.salesByGame?.pubgm?.revenue || 3650 },
                  { id: 'roblox', name: 'Roblox Robux', count: stats.salesByGame?.roblox?.count || 186, revenue: stats.salesByGame?.roblox?.revenue || 5420 }
                ].map((game) => (
                  <div key={game.id} className="p-4 rounded-2xl bg-slate-950/60 border border-white/5 space-y-2">
                    <div className="flex items-center gap-2.5">
                      <GameLogo gameId={game.id} className="w-8 h-8" />
                      <div>
                        <span className="text-xs font-bold text-white block">{game.name}</span>
                        <span className="text-[10px] text-slate-400">{game.count} Orders</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-white/5 flex justify-between items-baseline">
                      <span className="text-xs text-slate-400">Revenue:</span>
                      <span className="text-sm font-black text-cyan-400 tabular-nums">
                        ${game.revenue.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDER MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Filter controls */}
            <div className="p-4 rounded-2xl bg-slate-900/70 border border-white/10 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <select
                  value={orderGameFilter}
                  onChange={(e) => setOrderGameFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                >
                  <option value="all">All Games</option>
                  <option value="mlbb">Mobile Legends</option>
                  <option value="freefire">Free Fire</option>
                  <option value="pubgm">PUBG Mobile</option>
                  <option value="roblox">Roblox</option>
                </select>

                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                >
                  <option value="all">All Statuses</option>
                  <option value="WAITING_FOR_PAYMENT">Waiting For Payment</option>
                  <option value="PAYMENT_PROCESSING">Payment Processing</option>
                  <option value="PAID">Paid</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search Order ID or Player..."
                  className="w-64 px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 font-mono"
                />
              </div>
            </div>

            {/* Orders Table */}
            <div className="rounded-3xl bg-slate-900/70 border border-white/10 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider border-b border-white/5">
                    <tr>
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Game & Package</th>
                      <th className="p-4">Game Account</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Payment Method</th>
                      <th className="p-4">Payment Status</th>
                      <th className="p-4">Delivery</th>
                      <th className="p-4">Date</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-4 font-mono font-bold text-white whitespace-nowrap">
                          {ord.orderNumber}
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <div className="font-semibold text-slate-200">{ord.customerName || 'Guest'}</div>
                          <div className="text-[10px] text-slate-500">{ord.customerPhone || ord.customerEmail || 'No contact'}</div>
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <div className="font-semibold text-white">{ord.gameName}</div>
                          <div className="text-[11px] text-cyan-300 font-mono">{ord.productName}</div>
                        </td>
                        <td className="p-4 whitespace-nowrap font-mono">
                          <div className="text-white font-bold">{ord.playerId} {ord.zoneId ? `(${ord.zoneId})` : ''}</div>
                          {ord.verifiedAccountName && (
                            <div className="text-[10px] text-emerald-400 font-sans">{ord.verifiedAccountName}</div>
                          )}
                        </td>
                        <td className="p-4 whitespace-nowrap tabular-nums font-bold text-white">
                          ${ord.totalUsd.toFixed(2)}
                          <div className="text-[10px] text-slate-500 font-normal">{ord.totalKhr.toLocaleString()} ៛</div>
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <span className="font-mono text-slate-300">{ord.paymentMethod}</span>
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            ord.paymentStatus === 'PAID' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                            ord.paymentStatus === 'CANCELLED' ? 'bg-rose-950 text-rose-400' :
                            'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}>
                            {ord.paymentStatus}
                          </span>
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            ord.deliveryStatus === 'COMPLETED' ? 'bg-emerald-950 text-emerald-400' :
                            'bg-slate-800 text-slate-300'
                          }`}>
                            {ord.deliveryStatus}
                          </span>
                        </td>
                        <td className="p-4 whitespace-nowrap text-slate-400">
                          {new Date(ord.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4 whitespace-nowrap text-right space-x-1">
                          {ord.paymentStatus !== 'PAID' && (
                            <button
                              onClick={() => handleUpdateOrderStatus(ord.id, 'PAID', 'COMPLETED')}
                              className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold cursor-pointer"
                              title="Verify & Complete"
                            >
                              Approve
                            </button>
                          )}
                          {ord.paymentStatus !== 'CANCELLED' && ord.paymentStatus !== 'PAID' && (
                            <button
                              onClick={() => {
                                setRejectingOrder(ord);
                                setRejectionReason('');
                              }}
                              className="px-2 py-1 rounded bg-rose-600/80 hover:bg-rose-600 text-white text-[11px] font-bold cursor-pointer"
                              title="Reject with Reason"
                            >
                              Reject
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: STOCK & PRODUCT MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Stock Management System</h2>
                <p className="text-xs text-slate-400">Add, edit, restock, or toggle unlimited stock for top-up packages.</p>
              </div>
              <button
                onClick={() => setEditingProduct({
                  gameId: 'mlbb',
                  name: '',
                  itemCount: 100,
                  itemUnit: 'Diamonds',
                  priceUsd: 1.00,
                  stock: 100,
                  isUnlimitedStock: false,
                  isActive: true
                })}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-500 text-xs font-bold text-white flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Product</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="rounded-3xl bg-slate-900/70 border border-white/10 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider border-b border-white/5">
                    <tr>
                      <th className="p-4">Game</th>
                      <th className="p-4">Product Name</th>
                      <th className="p-4">Price (USD)</th>
                      <th className="p-4">Stock Status</th>
                      <th className="p-4">Sold</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {products.map((p) => {
                      const isOutOfStock = !p.isUnlimitedStock && p.stock <= 0;
                      return (
                        <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="p-4 whitespace-nowrap">
                            <span className="font-bold text-white uppercase">{p.gameId}</span>
                          </td>
                          <td className="p-4 whitespace-nowrap font-bold text-white">
                            {p.name} {p.bonus && <span className="text-[10px] text-emerald-400 font-normal">({p.bonus})</span>}
                          </td>
                          <td className="p-4 whitespace-nowrap font-bold text-cyan-300 tabular-nums">
                            ${p.priceUsd.toFixed(2)}
                          </td>
                          <td className="p-4 whitespace-nowrap">
                            {p.isUnlimitedStock ? (
                              <span className="text-cyan-400 font-semibold">Unlimited Stock</span>
                            ) : (
                              <span className={`tabular-nums font-bold ${p.stock <= 100 ? 'text-amber-400' : 'text-slate-200'}`}>
                                {p.stock} units remaining
                              </span>
                            )}
                          </td>
                          <td className="p-4 whitespace-nowrap tabular-nums text-slate-400">
                            {p.soldCount || 0}
                          </td>
                          <td className="p-4 whitespace-nowrap">
                            {isOutOfStock ? (
                              <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800 text-[10px] font-bold">
                                Out of Stock
                              </span>
                            ) : p.isActive ? (
                              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
                                Available
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-bold">
                                Disabled
                              </span>
                            )}
                          </td>
                          <td className="p-4 whitespace-nowrap text-right space-x-2">
                            <button
                              onClick={() => setEditingProduct(p)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                              title="Edit Product & Stock"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-400"
                              title="Delete Product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PAYMENT GATEWAY CONFIGURATION */}
        {activeTab === 'payments' && paymentSettings && (
          <div className="max-w-3xl space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <AbaBankLogo className="h-6" />
                <KhqrLogo className="h-6" />
                <span>ABA PayWay & KHQR Gateway Configuration</span>
              </h2>
              <p className="text-xs text-slate-400">
                Configure your official ABA PayWay Merchant keys, Bakong National QR settings, and exchange rates.
              </p>
            </div>

            <form onSubmit={handleSavePaymentSettings} className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Environment Mode
                  </label>
                  <select
                    value={paymentSettings.abaEnvironment}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, abaEnvironment: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                  >
                    <option value="sandbox">Sandbox (Testing / Demo)</option>
                    <option value="production">Production (Live Merchant)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    ABA Merchant ID
                  </label>
                  <input
                    type="text"
                    value={paymentSettings.abaMerchantId}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, abaMerchantId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    ABA PayWay Public / API Secret Key
                  </label>
                  <input
                    type="password"
                    value={paymentSettings.abaApiKey}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, abaApiKey: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Bakong Account ID (For KHQR)
                  </label>
                  <input
                    type="text"
                    value={paymentSettings.bakongAccountId}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, bakongAccountId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    USD to KHR Exchange Rate
                  </label>
                  <input
                    type="number"
                    value={paymentSettings.exchangeRateKhrPerUsd}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, exchangeRateKhrPerUsd: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Merchant Name (Printed on KHQR)
                  </label>
                  <input
                    type="text"
                    value={paymentSettings.merchantName}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, merchantName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Payment Expiry Timeout (Minutes)
                  </label>
                  <input
                    type="number"
                    value={paymentSettings.paymentExpiryMinutes}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, paymentExpiryMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={paymentSettings.abaPayWayEnabled}
                      onChange={(e) => setPaymentSettings({ ...paymentSettings, abaPayWayEnabled: e.target.checked })}
                      className="rounded border-slate-700 bg-slate-950 text-purple-600 focus:ring-0"
                    />
                    <span>Enable ABA PAY</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={paymentSettings.khqrEnabled}
                      onChange={(e) => setPaymentSettings({ ...paymentSettings, khqrEnabled: e.target.checked })}
                      className="rounded border-slate-700 bg-slate-950 text-purple-600 focus:ring-0"
                    />
                    <span>Enable KHQR</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white shadow-lg cursor-pointer"
                >
                  Save Gateway Settings
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 5: ADMIN ACCOUNTS MANAGEMENT */}
        {activeTab === 'admins' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Administrator Account Access Control</h2>
                <p className="text-xs text-slate-400">Only Super Admins can create or remove system administrators.</p>
              </div>
              <button
                onClick={() => setShowAddAdminModal(true)}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create Administrator</span>
              </button>
            </div>

            <div className="rounded-3xl bg-slate-900/70 border border-white/10 overflow-hidden shadow-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider border-b border-white/5">
                  <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {adminUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-800/40">
                      <td className="p-4 font-bold text-white">{u.name}</td>
                      <td className="p-4 font-mono text-slate-300">{u.email}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.role === 'SUPER_ADMIN' ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-purple-950 text-purple-300'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4 text-slate-400">{u.phone || 'N/A'}</td>
                      <td className="p-4">
                        <span className="text-emerald-400 font-semibold">Active</span>
                      </td>
                      <td className="p-4 text-right">
                        {u.role !== 'SUPER_ADMIN' && (
                          <button
                            onClick={() => handleDeleteAdmin(u.id)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400"
                            title="Remove Admin"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

        {/* TAB 6: AUDIT ACTIVITY LOGS */}
        {activeTab === 'logs' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h2 className="text-lg font-bold text-white">System Audit Activity Trail</h2>
            <div className="rounded-3xl bg-slate-900/70 border border-white/10 p-4 divide-y divide-white/5">
              {logs.map((log) => (
                <div key={log.id} className="py-3 flex items-start justify-between gap-4 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{log.userName}</span>
                      <span className="text-[10px] text-purple-400 bg-purple-950/60 px-1.5 rounded">
                        {log.userRole}
                      </span>
                      <span className="text-[10px] font-mono text-cyan-400 font-semibold">
                        {log.action}
                      </span>
                    </div>
                    <p className="text-slate-300 mt-1">{log.details}</p>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono shrink-0">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* EDIT PRODUCT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl bg-[#0B1124] border border-white/10 p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-white">
                {editingProduct.id ? 'Edit Product & Stock' : 'Add New Product'}
              </h3>
              <button onClick={() => setEditingProduct(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  placeholder="e.g. 514 Diamonds"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Price (USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editingProduct.priceUsd ?? ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, priceUsd: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={editingProduct.stock ?? 100}
                    disabled={editingProduct.isUnlimitedStock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono disabled:opacity-40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Bonus Description (Optional)</label>
                <input
                  type="text"
                  value={editingProduct.bonus || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, bonus: e.target.value })}
                  placeholder="e.g. +52 Bonus"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div className="pt-2 flex items-center gap-4">
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isUnlimitedStock || false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isUnlimitedStock: e.target.checked })}
                    className="rounded bg-slate-950 border-slate-700"
                  />
                  <span>Unlimited Stock</span>
                </label>

                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.isActive ?? true}
                    onChange={(e) => setEditingProduct({ ...editingProduct, isActive: e.target.checked })}
                    className="rounded bg-slate-950 border-slate-700"
                  />
                  <span>Active for Purchase</span>
                </label>
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
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-white cursor-pointer"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE ADMIN MODAL */}
      {showAddAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-3xl bg-[#0B1124] border border-white/10 p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-white">Create Administrator</h3>
              <button onClick={() => setShowAddAdminModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAdmin} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newAdminForm.name}
                  onChange={(e) => setNewAdminForm({ ...newAdminForm, name: e.target.value })}
                  placeholder="e.g. Sreymom Keo"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newAdminForm.email}
                  onChange={(e) => setNewAdminForm({ ...newAdminForm, email: e.target.value })}
                  placeholder="admin@auratopup.com"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Temporary Password</label>
                <input
                  type="password"
                  required
                  value={newAdminForm.password}
                  onChange={(e) => setNewAdminForm({ ...newAdminForm, password: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Role Permission</label>
                <select
                  value={newAdminForm.role}
                  onChange={(e) => setNewAdminForm({ ...newAdminForm, role: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                >
                  <option value="ADMIN">Normal Admin (Orders & Stock only)</option>
                  <option value="SUPER_ADMIN">Super Admin (Master System Control)</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddAdminModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold text-white cursor-pointer"
                >
                  Create Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REJECT ORDER MODAL */}
      {rejectingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-3xl bg-[#0B1124] border border-rose-500/30 p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Reject Order {rejectingOrder.orderNumber}</h3>
            <p className="text-xs text-slate-400">
              Provide a reason for rejection (e.g. invalid payment slip, incorrect Game ID).
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Payment receipt could not be verified in ABA Mobile."
              className="w-full h-24 p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
            />
            <div className="flex justify-end gap-2 text-xs">
              <button
                onClick={() => setRejectingOrder(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleUpdateOrderStatus(rejectingOrder.id, 'CANCELLED', 'CANCELLED', rejectionReason);
                  setRejectingOrder(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 font-bold text-white"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
