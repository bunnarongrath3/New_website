import React, { useState } from 'react';
import { User } from '../types';
import { BrandLogo } from './Logos';
import { X, Lock, Mail, User as UserIcon, Phone, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  lang: 'en' | 'kh';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  onClose,
  onLoginSuccess,
  lang
}) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const endpoint = tab === 'login' ? '/api/auth/login' : '/api/auth/register';
      const body = tab === 'login'
        ? { email: email.trim(), password }
        : { name: name.trim(), email: email.trim(), password, phone: phone.trim() };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Authentication failed');
      } else {
        localStorage.setItem('aura_user', JSON.stringify(data.user));
        onLoginSuccess(data.user);
        onClose();
      }
    } catch (err: any) {
      setError('Connection failure. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: demoEmail, password: demoPass })
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('aura_user', JSON.stringify(data.user));
        onLoginSuccess(data.user);
        onClose();
      } else {
        setError(data.error || 'Demo login failed');
      }
    } catch (e) {
      setError('Connection error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-3xl bg-[#0B1124] border border-white/10 p-6 sm:p-8 shadow-2xl shadow-purple-950/80">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-block mb-3">
            <BrandLogo size={42} />
          </div>
          <h2 className="text-xl font-bold text-white">
            {tab === 'login' ? 'Welcome Back, Gamer' : 'Create Customer Account'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Access order tracking, instant ABA checkout, and VIP deals
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex p-1 rounded-xl bg-slate-950 border border-slate-800 mb-6 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setError('');
            }}
            className={`flex-1 py-2 rounded-lg transition-colors cursor-pointer ${
              tab === 'login' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('register');
              setError('');
            }}
            className={`flex-1 py-2 rounded-lg transition-colors cursor-pointer ${
              tab === 'register' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-rose-950/50 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {tab === 'register' && (
            <div>
              <label className="block text-slate-300 font-medium mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sopheak Meas"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-slate-300 font-medium mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400"
              />
            </div>
          </div>

          {tab === 'register' && (
            <div>
              <label className="block text-slate-300 font-medium mb-1">Phone / Telegram (Optional)</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="012 345 678"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 disabled:opacity-50 text-xs font-bold text-white shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <span>{isLoading ? 'Processing...' : tab === 'login' ? 'Sign In to Account' : 'Register Customer'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast-Login Strip for Evaluation */}
        <div className="mt-6 pt-5 border-t border-white/10 space-y-2">
          <span className="text-[11px] font-bold text-slate-400 block text-center uppercase tracking-wider">
            Evaluation Quick Logins
          </span>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('superadmin@auratopup.com', 'superadmin123')}
              className="p-2 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 border border-purple-500/30 text-left transition-colors cursor-pointer"
            >
              <div className="text-[10px] font-extrabold text-amber-300">Super Admin</div>
              <div className="text-[9px] text-slate-400 truncate">Sokha Chan</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('admin@auratopup.com', 'admin123')}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-left transition-colors cursor-pointer"
            >
              <div className="text-[10px] font-extrabold text-cyan-300">Support Admin</div>
              <div className="text-[9px] text-slate-400 truncate">Dara Vannak</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('gamer@auratopup.com', 'gamer123')}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-left transition-colors cursor-pointer"
            >
              <div className="text-[10px] font-extrabold text-emerald-300">Gamer User</div>
              <div className="text-[9px] text-slate-400 truncate">Rithy Seng</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
