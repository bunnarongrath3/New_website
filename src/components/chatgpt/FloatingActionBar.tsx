import React from 'react';
import { MessageSquare, Download, Trash2, MoreHorizontal, X } from 'lucide-react';

interface FloatingActionBarProps {
  selectedCount: number;
  onStartChat: () => void;
  onDownloadSelected: () => void;
  onDeleteSelected: () => void;
  onClearSelection: () => void;
}

export const FloatingActionBar: React.FC<FloatingActionBarProps> = ({
  selectedCount,
  onStartChat,
  onDownloadSelected,
  onDeleteSelected,
  onClearSelection
}) => {
  if (selectedCount <= 0) return null;

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3.5 bg-[#212121] text-white px-6 py-3 rounded-full shadow-2xl border border-white/10 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-200"
    >
      {/* Count */}
      <div className="text-sm font-medium text-slate-200 shrink-0 tabular-nums pr-1">
        {selectedCount} selected
      </div>

      {/* Start Chat Button (Primary White) */}
      <button
        onClick={onStartChat}
        className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-slate-100 text-[#1f1f1f] text-xs font-semibold shadow-md transition-colors cursor-pointer shrink-0"
      >
        <MessageSquare className="w-3.5 h-3.5" />
        <span>Start chat</span>
      </button>

      {/* Download Button */}
      <button
        onClick={onDownloadSelected}
        className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#2f2f2f] hover:bg-[#383838] text-white text-xs font-medium transition-colors cursor-pointer shrink-0"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Download</span>
      </button>

      {/* Delete Button */}
      <button
        onClick={onDeleteSelected}
        className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-rose-500/50 text-rose-400 hover:bg-rose-500/15 text-xs font-medium transition-colors cursor-pointer shrink-0"
      >
        <Trash2 className="w-3.5 h-3.5" />
        <span>Delete</span>
      </button>

      {/* More actions */}
      <button
        type="button"
        className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
        title="More bulk actions"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {/* Clear selection */}
      <button
        type="button"
        onClick={onClearSelection}
        className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
        title="Clear selection"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
