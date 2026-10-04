import React, { useState } from 'react';
import { ChatConversation, UserProfile } from '../../types/chatgpt';
import { 
  Plus, Search, Pin, MessageSquare, Image, Library as LibraryIcon, 
  Clock, Puzzle, FolderKanban, Terminal, MoreHorizontal, ChevronDown, 
  ChevronRight, PinOff, Gift, Sparkles, LogOut, Settings, User as UserIcon,
  PanelLeftClose, PanelLeftOpen, ExternalLink, X
} from 'lucide-react';

interface SidebarProps {
  conversations: ChatConversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onOpenLibrary: () => void;
  currentView: 'library' | 'chat';
  currentUser: UserProfile;
  onPinToggle: (id: string, e: React.MouseEvent) => void;
  onOpenOffer: () => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewChat,
  onOpenLibrary,
  currentView,
  currentUser,
  onPinToggle,
  onOpenOffer,
  isCollapsed,
  setIsCollapsed
}) => {
  const [pinnedOpen, setPinnedOpen] = useState(true);
  const [recentsOpen, setRecentsOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const pinnedChats = conversations.filter(c => c.isPinned);
  const recentChats = conversations.filter(c => !c.isPinned);

  const filteredSearchChats = searchQuery.trim()
    ? conversations.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : conversations;

  if (isCollapsed) {
    return (
      <aside className="w-13 h-full bg-[#171717] border-r border-white/5 flex flex-col items-center py-3 select-none shrink-0 transition-all z-30">
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#212121] transition-colors mb-4"
          title="Open sidebar"
        >
          <PanelLeftOpen className="w-5 h-5" />
        </button>

        <button
          onClick={onNewChat}
          className="p-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-[#212121] transition-colors mb-2"
          title="New chat"
        >
          <Plus className="w-5 h-5" />
        </button>

        <button
          onClick={onOpenLibrary}
          className={`p-2.5 rounded-lg transition-colors mb-2 ${
            currentView === 'library' ? 'bg-[#2a2a2a] text-white' : 'text-slate-400 hover:text-white hover:bg-[#212121]'
          }`}
          title="Library"
        >
          <LibraryIcon className="w-5 h-5" />
        </button>

        <div className="flex-1" />

        {/* Minimized profile */}
        <button
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          className="w-8 h-8 rounded-full bg-blue-500 text-white font-bold text-xs flex items-center justify-center hover:ring-2 hover:ring-white/20"
          title={currentUser.name}
        >
          {currentUser.initials}
        </button>
      </aside>
    );
  }

  return (
    <>
      <aside className="w-[260px] h-full bg-[#171717] border-r border-white/5 flex flex-col justify-between select-none shrink-0 transition-all z-30">
        {/* Header row */}
        <div className="flex flex-col min-h-0 flex-1">
          <div className="h-14 px-3 flex items-center justify-between border-b border-transparent">
            <button
              onClick={onNewChat}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[#212121] text-white font-semibold text-base transition-colors"
            >
              <span>ChatGPT</span>
            </button>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowSearchModal(true)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#212121] transition-colors"
                title="Search conversations"
              >
                <Search className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsCollapsed(true)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#212121] transition-colors"
                title="Close sidebar"
              >
                <PanelLeftClose className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="px-2 py-1 space-y-0.5 text-xs font-medium">
            <button
              onClick={onNewChat}
              className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-slate-200 hover:bg-[#212121] transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Plus className="w-4 h-4 text-slate-400 group-hover:text-white" />
                <span>New chat</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
                Ctrl Shift O
              </span>
            </button>

            <button
              onClick={() => onOpenLibrary()}
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-300 hover:bg-[#212121] hover:text-white transition-colors cursor-pointer"
            >
              <Image className="w-4 h-4 text-slate-400" />
              <span>Images</span>
            </button>

            <button
              onClick={onOpenLibrary}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-colors cursor-pointer font-semibold ${
                currentView === 'library'
                  ? 'bg-[#2a2a2a] text-white'
                  : 'text-slate-300 hover:bg-[#212121] hover:text-white'
              }`}
            >
              <LibraryIcon className="w-4 h-4 text-slate-400" />
              <span>Library</span>
            </button>

            <button
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-300 hover:bg-[#212121] hover:text-white transition-colors"
            >
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Scheduled</span>
            </button>

            <button
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-300 hover:bg-[#212121] hover:text-white transition-colors"
            >
              <Puzzle className="w-4 h-4 text-slate-400" />
              <span>Plugins</span>
            </button>

            <div className="flex items-center justify-between px-2.5 py-2 rounded-lg text-slate-300 hover:bg-[#212121] hover:text-white transition-colors group cursor-pointer">
              <div className="flex items-center gap-2.5">
                <FolderKanban className="w-4 h-4 text-slate-400" />
                <span>Projects</span>
              </div>
              <Plus className="w-3.5 h-3.5 text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <a
              href="https://chatgpt.com/codex"
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-slate-300 hover:bg-[#212121] hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Terminal className="w-4 h-4 text-slate-400" />
                <span>Codex</span>
              </div>
              <ExternalLink className="w-3 h-3 text-slate-500" />
            </a>

            <button
              className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-slate-400 hover:bg-[#212121] hover:text-white transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
              <span>More</span>
            </button>
          </div>

          {/* Conversations Scroll Area */}
          <div className="flex-1 overflow-y-auto px-2 py-2 space-y-4">
            {/* Pinned Section */}
            {pinnedChats.length > 0 && (
              <div>
                <button
                  onClick={() => setPinnedOpen(!pinnedOpen)}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-slate-400 hover:text-slate-200 uppercase tracking-wider w-full text-left"
                >
                  {pinnedOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  <span>Pinned</span>
                </button>

                {pinnedOpen && (
                  <div className="mt-1 space-y-0.5">
                    {pinnedChats.map((chat) => (
                      <div
                        key={chat.id}
                        onClick={() => onSelectConversation(chat.id)}
                        className={`group relative flex items-center justify-between px-2.5 py-2 rounded-lg text-xs cursor-pointer transition-colors ${
                          activeConversationId === chat.id
                            ? 'bg-[#212121] text-white font-medium'
                            : 'text-slate-300 hover:bg-[#212121] hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{chat.title}</span>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={(e) => onPinToggle(chat.id, e)}
                            className="p-1 hover:text-white text-slate-400"
                            title="Unpin conversation"
                          >
                            <PinOff className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Recents Section */}
            <div>
              <div className="flex items-center justify-between px-2.5 py-1">
                <button
                  onClick={() => setRecentsOpen(!recentsOpen)}
                  className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 hover:text-slate-200 uppercase tracking-wider text-left"
                >
                  {recentsOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  <span>Recents</span>
                </button>
              </div>

              {recentsOpen && (
                <div className="mt-1 space-y-0.5">
                  {recentChats.map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() => onSelectConversation(chat.id)}
                      className={`group relative flex items-center justify-between px-2.5 py-2 rounded-lg text-xs cursor-pointer transition-colors ${
                        activeConversationId === chat.id
                          ? 'bg-[#212121] text-white font-medium'
                          : 'text-slate-300 hover:bg-[#212121] hover:text-white'
                      }`}
                    >
                      <span className="truncate flex-1 min-w-0 pr-2">{chat.title}</span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <button
                          type="button"
                          onClick={(e) => onPinToggle(chat.id, e)}
                          className="p-1 hover:text-white text-slate-400"
                          title="Pin conversation"
                        >
                          <Pin className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Profile & Offer section */}
        <div className="p-3 border-t border-white/5 space-y-2 relative">
          {/* Profile Menu Dropdown */}
          {showProfileMenu && (
            <div className="absolute bottom-full left-3 right-3 mb-2 p-1.5 rounded-2xl bg-[#262626] border border-white/10 shadow-2xl space-y-1 text-xs text-slate-200 z-50">
              <div className="px-3 py-2 border-b border-white/5">
                <div className="font-bold text-white">{currentUser.name}</div>
                <div className="text-[11px] text-slate-400 truncate">{currentUser.email}</div>
              </div>
              <button
                onClick={() => {
                  onOpenOffer();
                  setShowProfileMenu(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-left"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Upgrade to Plus</span>
              </button>
              <button
                onClick={() => setShowProfileMenu(false)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-left"
              >
                <Settings className="w-3.5 h-3.5 text-slate-400" />
                <span>Settings</span>
              </button>
              <button
                onClick={() => setShowProfileMenu(false)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-left text-rose-400 hover:text-rose-300"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log out</span>
              </button>
            </div>
          )}

          {/* User Row */}
          <div
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center justify-between p-1.5 rounded-xl hover:bg-[#212121] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full bg-blue-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                {currentUser.initials}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white truncate">
                  {currentUser.name}
                </div>
                <div className="text-[11px] text-slate-400">{currentUser.plan}</div>
              </div>
            </div>
          </div>

          {/* Claim Offer Button */}
          <button
            onClick={onOpenOffer}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg border border-white/10 bg-[#212121] hover:bg-[#2a2a2a] text-xs font-medium text-white transition-colors cursor-pointer"
          >
            <Gift className="w-3.5 h-3.5 text-amber-400" />
            <span>Claim offer</span>
          </button>
        </div>
      </aside>

      {/* Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-[#262626] border border-white/10 shadow-2xl p-4 space-y-3">
            <div className="flex items-center gap-2.5 border-b border-white/10 pb-3">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
              />
              <button onClick={() => setShowSearchModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-64 overflow-y-auto space-y-1">
              {filteredSearchChats.map((c) => (
                <div
                  key={c.id}
                  onClick={() => {
                    onSelectConversation(c.id);
                    setShowSearchModal(false);
                  }}
                  className="px-3 py-2 rounded-lg hover:bg-white/10 text-xs text-slate-200 cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center gap-2 truncate">
                    <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{c.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 shrink-0">{c.updatedAt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
