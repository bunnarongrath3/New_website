import React, { useState } from 'react';
import { ArtifactItem } from '../../types/chatgpt';
import { 
  FileText, Star, MoreHorizontal, Download, Trash2, Check, 
  ExternalLink, Eye, Folder, Sparkles 
} from 'lucide-react';

interface LibraryTableProps {
  items: ArtifactItem[];
  selectedIds: string[];
  onToggleSelect: (id: string, e?: React.MouseEvent) => void;
  onSelectAll: (select: boolean) => void;
  onOpenItem: (item: ArtifactItem) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onDeleteItem: (id: string, e: React.MouseEvent) => void;
  onDownloadItem: (item: ArtifactItem, e: React.MouseEvent) => void;
  viewMode: 'list' | 'grid';
}

export const LibraryTable: React.FC<LibraryTableProps> = ({
  items,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onOpenItem,
  onToggleFavorite,
  onDeleteItem,
  onDownloadItem,
  viewMode
}) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const isAllSelected = items.length > 0 && selectedIds.length === items.length;
  const isPartiallySelected = selectedIds.length > 0 && selectedIds.length < items.length;

  if (items.length === 0) {
    return (
      <div className="max-w-[840px] mx-auto px-6 py-20 text-center text-slate-500">
        <Sparkles className="w-10 h-10 mx-auto mb-3 opacity-40" />
        <h3 className="text-base font-medium text-slate-300 mb-1">No items found</h3>
        <p className="text-xs">Upload images, documents, or create artifacts in conversations to see them here.</p>
      </div>
    );
  }

  if (viewMode === 'grid') {
    return (
      <div className="max-w-[840px] mx-auto px-6 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.map((item) => {
            const isSelected = selectedIds.includes(item.id);

            return (
              <div
                key={item.id}
                onClick={() => onOpenItem(item)}
                className={`group relative rounded-2xl bg-[#171717] border overflow-hidden cursor-pointer transition-all duration-150 ${
                  isSelected
                    ? 'border-white ring-1 ring-white shadow-lg'
                    : 'border-white/5 hover:border-white/20 hover:bg-[#212121]'
                }`}
              >
                {/* Thumbnail / Preview Area */}
                <div className="relative aspect-square w-full bg-[#121212] overflow-hidden flex items-center justify-center">
                  {item.thumbnailUrl ? (
                    <img
                      src={item.thumbnailUrl}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : item.type === 'folder' ? (
                    <Folder className="w-12 h-12 text-slate-400" />
                  ) : (
                    <FileText className="w-12 h-12 text-blue-500" />
                  )}

                  {/* Top-left Checkbox */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSelect(item.id, e);
                    }}
                    className={`absolute top-2 left-2 z-10 w-5 h-5 rounded-[4px] border flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-white border-white text-black'
                        : 'border-white/30 bg-black/40 text-transparent opacity-0 group-hover:opacity-100 hover:border-white'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>

                  {/* Top-right Favorite Star */}
                  {item.isFavorite && (
                    <div className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                    </div>
                  )}
                </div>

                {/* Card Title & Info */}
                <div className="p-3">
                  <span className="text-xs font-medium text-white truncate block" title={item.name}>
                    {item.name}
                  </span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    {item.modifiedText}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // List View (Default Matching ChatGPT HTML Screenshot)
  return (
    <div className="max-w-[840px] mx-auto px-6 pb-28">
      {/* Table Header Row */}
      <div className="grid grid-cols-12 items-center py-2.5 px-3 border-b border-white/5 text-xs text-slate-400 font-medium select-none">
        {/* Checkbox column (1 col) */}
        <div className="col-span-1 flex items-center">
          <button
            type="button"
            onClick={() => onSelectAll(!isAllSelected)}
            className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors cursor-pointer ${
              isAllSelected
                ? 'bg-white border-white text-black'
                : isPartiallySelected
                ? 'bg-white border-white text-black'
                : 'border-white/20 bg-transparent hover:border-white/40'
            }`}
          >
            {isAllSelected && <Check className="w-3 h-3 stroke-[3]" />}
            {isPartiallySelected && <span className="w-2 h-0.5 bg-black" />}
          </button>
        </div>

        {/* Name column (7 cols) */}
        <div className="col-span-7 sm:col-span-7 flex items-center gap-1 font-medium">
          <span>Name</span>
        </div>

        {/* Last activity column (3 cols) */}
        <div className="col-span-3 hidden sm:flex items-center">
          <span>Last activity</span>
        </div>

        {/* Actions column (1 col) */}
        <div className="col-span-4 sm:col-span-1 text-right">
          <span className="sr-only">Actions</span>
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-white/5">
        {items.map((item) => {
          const isSelected = selectedIds.includes(item.id);

          return (
            <div
              key={item.id}
              onClick={() => onOpenItem(item)}
              className={`group grid grid-cols-12 items-center py-2 px-3 rounded-xl transition-colors cursor-pointer relative ${
                isSelected
                  ? 'bg-white/10 hover:bg-white/[0.12]'
                  : 'hover:bg-white/5'
              }`}
            >
              {/* Checkbox */}
              <div
                className="col-span-1 flex items-center z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSelect(item.id, e);
                }}
              >
                <button
                  type="button"
                  className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-white border-white text-black'
                      : 'border-white/20 bg-transparent group-hover:border-white/40'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </button>
              </div>

              {/* Name & Icon */}
              <div className="col-span-7 sm:col-span-7 flex items-center gap-3 min-w-0 pr-2">
                <div className="w-8 h-8 rounded-lg border border-white/10 bg-[#171717] overflow-hidden flex items-center justify-center shrink-0">
                  {item.thumbnailUrl ? (
                    <img
                      src={item.thumbnailUrl}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : item.type === 'folder' ? (
                    <Folder className="w-4 h-4 text-slate-300" />
                  ) : (
                    <FileText className="w-4 h-4 text-blue-400" />
                  )}
                </div>

                <div className="min-w-0 flex-1 flex items-center gap-1.5">
                  <span className="text-sm font-medium text-white truncate hover:underline" title={item.name}>
                    {item.name}
                  </span>

                  {item.isFavorite && (
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                  )}
                </div>
              </div>

              {/* Last activity */}
              <div className="col-span-3 hidden sm:flex items-center text-xs text-slate-400 truncate">
                <span>{item.modifiedText}</span>
              </div>

              {/* Row Actions Menu */}
              <div className="col-span-4 sm:col-span-1 flex items-center justify-end gap-1 relative">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenuId(activeMenuId === item.id ? null : item.id);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Actions"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>

                {activeMenuId === item.id && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-0 top-full mt-1 w-44 rounded-xl bg-[#262626] border border-white/10 shadow-2xl p-1.5 z-40 text-xs text-slate-200 space-y-0.5"
                  >
                    <button
                      onClick={(e) => {
                        onToggleFavorite(item.id, e);
                        setActiveMenuId(null);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-left"
                    >
                      <Star className="w-3.5 h-3.5 text-amber-400" />
                      <span>{item.isFavorite ? 'Unfavorite' : 'Add to Favorites'}</span>
                    </button>
                    <button
                      onClick={(e) => {
                        onDownloadItem(item, e);
                        setActiveMenuId(null);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/10 text-left"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-400" />
                      <span>Download</span>
                    </button>
                    <button
                      onClick={(e) => {
                        onDeleteItem(item.id, e);
                        setActiveMenuId(null);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-rose-950/40 text-rose-400 text-left"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
