import React, { useState } from 'react';
import { ArtifactItem } from '../../types/chatgpt';
import { 
  X, Download, Star, MessageSquare, Trash2, ExternalLink, 
  ZoomIn, ZoomOut, RotateCcw, Copy, Check, FileText 
} from 'lucide-react';

interface ArtifactLightboxProps {
  item: ArtifactItem;
  onClose: () => void;
  onStartChat: (item: ArtifactItem) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onDelete: (id: string) => void;
  onOpenConversation?: (convoId: string) => void;
}

export const ArtifactLightbox: React.FC<ArtifactLightboxProps> = ({
  item,
  onClose,
  onStartChat,
  onToggleFavorite,
  onDelete,
  onOpenConversation
}) => {
  const [zoom, setZoom] = useState(1);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (item.content) {
      navigator.clipboard.writeText(item.content);
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (item.thumbnailUrl) {
      const a = document.createElement('a');
      a.href = item.thumbnailUrl;
      a.download = item.name;
      a.click();
    } else if (item.content) {
      const blob = new Blob([item.content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = item.name.endsWith('.md') ? item.name : `${item.name}.md`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md">
      {/* Top action header */}
      <div className="absolute top-0 inset-x-0 h-14 px-6 flex items-center justify-between border-b border-white/10 bg-[#171717]/80 z-20">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-sm font-semibold text-white truncate max-w-md">
            {item.name}
          </span>
          <span className="text-xs text-slate-400">· {item.modifiedText}</span>
        </div>

        <div className="flex items-center gap-2">
          {item.type === 'image' && (
            <div className="flex items-center gap-1 bg-[#262626] rounded-lg px-2 py-1 border border-white/5 mr-2">
              <button
                onClick={() => setZoom(prev => Math.max(0.5, prev - 0.25))}
                className="p-1 text-slate-400 hover:text-white"
                title="Zoom out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-[11px] text-slate-300 font-mono w-10 text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => setZoom(prev => Math.min(2.5, prev + 0.25))}
                className="p-1 text-slate-400 hover:text-white"
                title="Zoom in"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoom(1)}
                className="p-1 text-slate-400 hover:text-white ml-1"
                title="Reset zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <button
            onClick={(e) => onToggleFavorite(item.id, e)}
            className={`p-2 rounded-lg transition-colors ${
              item.isFavorite ? 'text-amber-400 bg-amber-950/40' : 'text-slate-400 hover:text-white hover:bg-white/10'
            }`}
            title="Toggle favorite"
          >
            <Star className={`w-4 h-4 ${item.isFavorite ? 'fill-amber-400' : ''}`} />
          </button>

          <button
            onClick={handleDownload}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Download file"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={() => onStartChat(item)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-[#1f1f1f] text-xs font-semibold hover:bg-slate-100 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Start chat</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="w-full h-full pt-14 flex items-center justify-center p-6 overflow-hidden">
        {item.type === 'image' && item.thumbnailUrl ? (
          <div className="relative max-w-4xl max-h-[80vh] flex items-center justify-center overflow-auto">
            <img
              src={item.thumbnailUrl}
              alt={item.name}
              referrerPolicy="no-referrer"
              style={{ transform: `scale(${zoom})`, transition: 'transform 0.15s ease-out' }}
              className="max-h-[75vh] w-auto object-contain rounded-xl shadow-2xl"
            />
          </div>
        ) : (
          <div className="w-full max-w-2xl max-h-[80vh] bg-[#171717] rounded-2xl border border-white/10 p-6 overflow-y-auto space-y-4 text-xs text-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                <span className="font-semibold text-white">{item.name}</span>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="whitespace-pre-wrap font-mono text-[13px] leading-relaxed text-slate-300">
              {item.content || 'No text content available'}
            </pre>
          </div>
        )}
      </div>

      {/* Bottom details strip */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-[#171717]/90 border border-white/10 text-xs text-slate-400 flex items-center gap-4 backdrop-blur-md">
        {item.fileSize && <span>Size: <strong className="text-white">{item.fileSize}</strong></span>}
        {item.dimensions && <span>Dimensions: <strong className="text-white">{item.dimensions}</strong></span>}
        {item.originChat && (
          <button
            onClick={() => {
              if (onOpenConversation) onOpenConversation(item.originChat!.id);
              onClose();
            }}
            className="flex items-center gap-1 text-cyan-400 hover:underline"
          >
            <span>From: {item.originChat.title}</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};
