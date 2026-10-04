import React, { useState } from 'react';
import { ChatConversation, ArtifactItem } from '../../types/chatgpt';
import { 
  ArrowUp, Paperclip, Mic, Sparkles, Share2, 
  Check, Copy, RefreshCw, X, FileText, Image 
} from 'lucide-react';

interface ChatViewProps {
  conversation: ChatConversation;
  attachedArtifact?: ArtifactItem | null;
  onClearAttachment?: () => void;
  onSendMessage: (text: string) => void;
  onNewChat: () => void;
  onOpenLibrary: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  conversation,
  attachedArtifact,
  onClearAttachment,
  onSendMessage,
  onNewChat,
  onOpenLibrary
}) => {
  const [inputText, setInputText] = useState('');
  const [isCopied, setIsCopied] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const copyMessage = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(id);
    setTimeout(() => setIsCopied(null), 2000);
  };

  return (
    <div className="flex-1 h-full flex flex-col bg-[#212121] text-slate-100 overflow-hidden relative">
      {/* Top Bar */}
      <div className="h-14 px-6 flex items-center justify-between border-b border-white/5 bg-[#212121]/90 backdrop-blur-sm z-10 shrink-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm text-white">
            {conversation.title}
          </span>
          <span className="text-[10px] text-slate-400 bg-white/10 px-2 py-0.5 rounded-full font-medium">
            GPT-4o
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenLibrary}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            Library
          </button>
          <button
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Share chat"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {conversation.messages.length === 0 ? (
            <div className="text-center py-20 space-y-3">
              <div className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-cyan-400" />
              </div>
              <h2 className="text-xl font-bold text-white">What can I help with today?</h2>
              <p className="text-xs text-slate-400">
                Ask anything, analyze documents, or remix artifacts from your library.
              </p>
            </div>
          ) : (
            conversation.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                    ✦
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#2f2f2f] text-white'
                      : 'bg-transparent text-slate-200'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>

                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-2 mt-2 pt-1 text-slate-500">
                      <button
                        onClick={() => copyMessage(msg.content, msg.id)}
                        className="hover:text-white transition-colors"
                        title="Copy text"
                      >
                        {isCopied === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Bottom Composer Box */}
      <div className="p-4 bg-gradient-to-t from-[#212121] via-[#212121] to-transparent shrink-0">
        <div className="max-w-2xl mx-auto">
          {/* Attached Artifact preview */}
          {attachedArtifact && (
            <div className="mb-2 flex items-center gap-2 p-2 rounded-xl bg-[#2a2a2a] border border-white/10 w-fit">
              {attachedArtifact.thumbnailUrl ? (
                <img
                  src={attachedArtifact.thumbnailUrl}
                  alt={attachedArtifact.name}
                  className="w-7 h-7 rounded object-cover"
                />
              ) : (
                <FileText className="w-5 h-5 text-blue-400" />
              )}
              <span className="text-xs text-white font-medium max-w-xs truncate">
                {attachedArtifact.name}
              </span>
              {onClearAttachment && (
                <button onClick={onClearAttachment} className="p-1 hover:text-white text-slate-400">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 bg-[#2f2f2f] rounded-3xl p-2 pl-4 border border-white/5 focus-within:border-white/20 transition-all shadow-lg"
          >
            <button
              type="button"
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Attach files"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Message ChatGPT..."
              className="flex-1 bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
            />

            <button
              type="button"
              className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Voice mode"
            >
              <Mic className="w-4 h-4" />
            </button>

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2 rounded-full bg-white text-black disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-200 transition-colors"
              title="Send message"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </form>

          <p className="text-[11px] text-center text-slate-500 mt-2">
            ChatGPT can make mistakes. Check important info.
          </p>
        </div>
      </div>
    </div>
  );
};
