import React, { useState } from 'react';
import { Search, SlidersHorizontal, LayoutGrid, List, Plus, Settings, ChevronDown, Check } from 'lucide-react';

interface LibraryHeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  viewMode: 'list' | 'grid';
  setViewMode: (mode: 'list' | 'grid') => void;
  activeTab: 'suggested' | 'favorites' | 'folders' | 'images' | 'all';
  setActiveTab: (tab: 'suggested' | 'favorites' | 'folders' | 'images' | 'all') => void;
  onNewItem: (action: 'upload' | 'folder' | 'note') => void;
  sortBy: 'activity' | 'name';
  setSortBy: (sort: 'activity' | 'name') => void;
  onOpenSettings: () => void;
}

export const LibraryHeader: React.FC<LibraryHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
  activeTab,
  setActiveTab,
  onNewItem,
  sortBy,
  setSortBy,
  onOpenSettings
}) => {
  const [showNewMenu, setShowNewMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  return (
    <div className="sticky top-0 z-20 bg-[#212121] border-b border-white/5 pb-2">
      <div className="max-w-[840px] mx-auto px-6 pt-5">
        {/* Top title and actions row */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Library
          </h1>

          <div className="flex items-center gap-2 flex-1 justify-end">
            {/* View & Filter Controls */}
            <div className="flex items-center gap-1">
              {/* Filter popup */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowFilterMenu(!showFilterMenu)}
                  className={`p-2 rounded-full transition-colors cursor-pointer ${
                    showFilterMenu ? 'bg-[#2f2f2f] text-white' : 'text-slate-400 hover:text-white hover:bg-[#2f2f2f]'
                  }`}
                  title="Filter and Sort"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </button>

                {showFilterMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 rounded-2xl bg-[#262626] border border-white/10 shadow-2xl p-1.5 z-40 text-xs text-slate-200 space-y-1">
                    <span className="text-[10px] text-slate-500 font-semibold px-2 py-1 block uppercase">Sort by</span>
                    <button
                      onClick={() => {
                        setSortBy('activity');
                        setShowFilterMenu(false);
                      }}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-left"
                    >
                      <span>Last activity</span>
                      {sortBy === 'activity' && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                    </button>
                    <button
                      onClick={() => {
                        setSortBy('name');
                        setShowFilterMenu(false);
                      }}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-left"
                    >
                      <span>Name (A-Z)</span>
                      {sortBy === 'name' && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                    </button>
                  </div>
                )}
              </div>

              {/* Grid vs List View toggle */}
              <div className="flex items-center p-0.5 rounded-full bg-[#171717] border border-white/5">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                    viewMode === 'grid' ? 'bg-[#2f2f2f] text-white' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Grid view"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                    viewMode === 'list' ? 'bg-[#2f2f2f] text-white' : 'text-slate-400 hover:text-white'
                  }`}
                  title="List view"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative w-48 sm:w-60">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search library"
                className="w-full pl-9 pr-3 py-1.5 rounded-full bg-[#171717] border border-white/10 hover:border-white/20 focus:border-white/40 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
              />
            </div>

            {/* New Button with Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNewMenu(!showNewMenu)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-100 text-[#1f1f1f] text-xs font-semibold shadow-md transition-colors cursor-pointer"
              >
                <span>New</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {showNewMenu && (
                <div className="absolute right-0 top-full mt-2 w-44 rounded-2xl bg-[#262626] border border-white/10 shadow-2xl p-1.5 z-40 text-xs text-slate-200 space-y-0.5">
                  <button
                    onClick={() => {
                      onNewItem('upload');
                      setShowNewMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 text-left transition-colors cursor-pointer"
                  >
                    <span>Upload files</span>
                  </button>
                  <button
                    onClick={() => {
                      onNewItem('folder');
                      setShowNewMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 text-left transition-colors cursor-pointer"
                  >
                    <span>New folder</span>
                  </button>
                  <button
                    onClick={() => {
                      onNewItem('note');
                      setShowNewMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 text-left transition-colors cursor-pointer"
                  >
                    <span>New document</span>
                  </button>
                </div>
              )}
            </div>

            {/* Settings button */}
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-[#2f2f2f] transition-colors cursor-pointer"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Tabs Row: Suggested, Favorites, Folders, Images, All */}
        <div className="flex items-center gap-1 overflow-x-auto py-2 no-scrollbar text-xs font-medium">
          {(['suggested', 'favorites', 'folders', 'images', 'all'] as const).map((tab) => {
            const isActive = activeTab === tab;
            const label = tab.charAt(0).toUpperCase() + tab.slice(1);
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-full transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#2f2f2f] text-white font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-[#2f2f2f]/60'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
