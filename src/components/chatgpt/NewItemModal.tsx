import React, { useState } from 'react';
import { X, Upload, Folder, FileText, Check } from 'lucide-react';
import { ArtifactItem } from '../../types/chatgpt';

interface NewItemModalProps {
  action: 'upload' | 'folder' | 'note';
  onClose: () => void;
  onCreate: (item: Partial<ArtifactItem>) => void;
}

export const NewItemModal: React.FC<NewItemModalProps> = ({ action, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (action === 'folder') {
      if (!name.trim()) return;
      onCreate({
        id: `folder-${Date.now()}`,
        name: name.trim(),
        type: 'folder',
        modifiedText: 'Created just now',
        modifiedTimestamp: Date.now(),
        isFavorite: false
      });
    } else if (action === 'note') {
      if (!name.trim()) return;
      onCreate({
        id: `note-${Date.now()}`,
        name: name.endsWith('.md') ? name.trim() : `${name.trim()}.md`,
        type: 'markdown',
        modifiedText: 'Created just now',
        modifiedTimestamp: Date.now(),
        isFavorite: false,
        content: content.trim(),
        fileSize: `${Math.max(1, Math.round(content.length / 1024))} KB`
      });
    } else if (action === 'upload') {
      const fileName = name.trim() || (selectedFile ? selectedFile.name : 'Uploaded-Image.png');
      onCreate({
        id: `file-${Date.now()}`,
        name: fileName,
        type: fileName.endsWith('.md') ? 'markdown' : 'image',
        modifiedText: 'Uploaded just now',
        modifiedTimestamp: Date.now(),
        isFavorite: false,
        fileSize: selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB` : '1.2 MB'
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-3xl bg-[#1e1e1e] border border-white/10 p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            {action === 'upload' && <Upload className="w-5 h-5 text-cyan-400" />}
            {action === 'folder' && <Folder className="w-5 h-5 text-amber-400" />}
            {action === 'note' && <FileText className="w-5 h-5 text-blue-400" />}
            <span>
              {action === 'upload' ? 'Upload to Library' : action === 'folder' ? 'Create New Folder' : 'New Markdown Document'}
            </span>
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {action === 'upload' && (
            <div className="p-6 rounded-2xl border-2 border-dashed border-white/20 hover:border-white/40 text-center cursor-pointer transition-colors relative">
              <input
                type="file"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setSelectedFile(e.target.files[0]);
                    setName(e.target.files[0].name);
                  }
                }}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <Upload className="w-8 h-8 mx-auto text-slate-400 mb-2" />
              <span className="text-white font-medium block">
                {selectedFile ? selectedFile.name : 'Click or drag files to upload'}
              </span>
              <span className="text-[10px] text-slate-500">PNG, JPG, PDF, MD up to 25MB</span>
            </div>
          )}

          <div>
            <label className="block text-slate-300 font-medium mb-1">
              {action === 'folder' ? 'Folder Name' : 'File Name'}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={action === 'folder' ? 'e.g. Esports UI Designs' : 'e.g. Prompt Architecture.md'}
              className="w-full px-3 py-2.5 rounded-xl bg-[#171717] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-white/40"
            />
          </div>

          {action === 'note' && (
            <div>
              <label className="block text-slate-300 font-medium mb-1">Markdown Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="# Document Title..."
                className="w-full h-32 px-3 py-2.5 rounded-xl bg-[#171717] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-white/40 font-mono text-[11px]"
              />
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-white hover:bg-slate-100 text-[#1f1f1f] font-bold"
            >
              {action === 'upload' ? 'Upload' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
