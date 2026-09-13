import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Circular } from '../../types';
import { Search, X, FileText, ArrowRight, Sparkles, Filter } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  circulars: Circular[];
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, circulars }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled by parent state
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = circulars.filter(
    (c) =>
      c.refNo.toLowerCase().includes(query.toLowerCase()) ||
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.category.toLowerCase().includes(query.toLowerCase()) ||
      c.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
  );

  const handleSelect = (circularId: string) => {
    navigate(`/circulars/${circularId}`);
    onClose();
    setQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-indigo-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search circulars by Ref No (e.g. CIRC-2026-089), title, tag, or policy..."
            className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 rounded bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-800/50">
          {filtered.length > 0 ? (
            filtered.map((circ) => (
              <div
                key={circ.id}
                onClick={() => handleSelect(circ.id)}
                className="p-3 rounded-xl hover:bg-slate-800/70 transition-colors cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0 mt-0.5">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-indigo-400">
                        {circ.refNo}
                      </span>
                      <StatusBadge status={circ.status} size="sm" />
                      <span className="text-[10px] text-slate-500 font-mono">v{circ.version}</span>
                    </div>
                    <h4 className="text-sm font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors">
                      {circ.title}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{circ.summary}</p>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-slate-500 text-sm">
              No circulars found matching "<span className="text-slate-300">{query}</span>"
            </div>
          )}
        </div>

        {/* Command Palette Footer */}
        <div className="p-3 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500 font-mono">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">↑</kbd> <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">↓</kbd> Navigate</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">ESC</kbd> Close</span>
          </div>
          <span className="flex items-center gap-1 text-indigo-400 font-sans font-medium">
            <Sparkles className="w-3.5 h-3.5" /> CircularFlow AI Search
          </span>
        </div>
      </div>
    </div>
  );
};
