import React from 'react';
import { BrandLogo } from './Logos';
import { User } from '../types';
import { ShieldCheck, UserCheck, Search, Globe, LogOut } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenTrack: () => void;
  onOpenContact: () => void;
  onSelectGame: (gameId: string) => void;
  lang: 'en' | 'kh';
  setLang: (lang: 'en' | 'kh') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  setCurrentView,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenTrack,
  onOpenContact,
  lang,
  setLang
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#080D1B]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand title, one line */}
        <div 
          onClick={() => setCurrentView('home')}
          className="cursor-pointer transition-opacity hover:opacity-95"
        >
          <BrandLogo />
        </div>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <button
            onClick={() => setCurrentView('home')}
            className={`transition-colors hover:text-cyan-400 ${currentView === 'home' ? 'text-cyan-400 font-semibold' : ''}`}
          >
            {lang === 'en' ? 'Home' : 'ទំព័រដើម'}
          </button>

          <a
            href="#games-section"
            onClick={() => {
              if (currentView !== 'home') setCurrentView('home');
            }}
            className="transition-colors hover:text-cyan-400"
          >
            {lang === 'en' ? 'All Games' : 'ហ្គេមទាំងអស់'}
          </a>

          <a
            href="#promotions-section"
            onClick={() => {
              if (currentView !== 'home') setCurrentView('home');
            }}
            className="transition-colors hover:text-cyan-400"
          >
            {lang === 'en' ? 'Promotions' : 'ប្រូម៉ូសិន'}
          </a>

          <button
            onClick={onOpenTrack}
            className={`transition-colors hover:text-cyan-400 flex items-center gap-1.5 ${currentView === 'track' ? 'text-cyan-400 font-semibold' : ''}`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>{lang === 'en' ? 'Track Order' : 'តាមដានការបញ្ជាទិញ'}</span>
          </button>

          <button
            onClick={onOpenContact}
            className="transition-colors hover:text-cyan-400"
          >
            {lang === 'en' ? 'Contact' : 'ទំនាក់ទំនង'}
          </button>

          {/* Admin Shortcuts if logged in */}
          {currentUser && (currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'ADMIN') && (
            <button
              onClick={() => setCurrentView(currentUser.role === 'SUPER_ADMIN' ? 'superadmin' : 'admin')}
              className={`transition-colors flex items-center gap-1.5 px-2.5 py-1 rounded bg-purple-900/60 text-purple-300 border border-purple-500/30 text-xs font-semibold ${
                currentView === 'admin' || currentView === 'superadmin' ? 'ring-1 ring-purple-400 text-white' : ''
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>{currentUser.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin Panel'}</span>
            </button>
          )}
        </nav>

        {/* Zone 3: 1-2 primary actions + language switch */}
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <button
            onClick={() => setLang(lang === 'en' ? 'kh' : 'en')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/80 border border-slate-700/60 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            title="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            <span className="uppercase">{lang}</span>
          </button>

          {/* User Account or Login */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (currentUser.role === 'SUPER_ADMIN') setCurrentView('superadmin');
                  else if (currentUser.role === 'ADMIN') setCurrentView('admin');
                  else setCurrentView('customer');
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 text-xs font-medium text-slate-200 transition-colors"
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-purple-500 to-cyan-400 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                  {currentUser.name.charAt(0)}
                </div>
                <span className="max-w-[100px] truncate hidden sm:inline">{currentUser.name}</span>
                <span className="text-[10px] text-purple-400 bg-purple-950/60 px-1.5 py-0.5 rounded border border-purple-800/40">
                  {currentUser.role === 'SUPER_ADMIN' ? 'Super' : currentUser.role === 'ADMIN' ? 'Admin' : 'VIP'}
                </span>
              </button>

              <button
                onClick={onLogout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-semibold text-white shadow-md shadow-purple-900/30 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Login / Register' : 'ចូលគណនី'}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
