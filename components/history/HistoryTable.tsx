'use client';

import { TypingSession } from '@/lib/typing/types';
import { Trash2 } from 'lucide-react';

interface HistoryTableProps {
  sessions: TypingSession[];
  onClear: () => void;
}

export function HistoryTable({ sessions, onClear }: HistoryTableProps) {
  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const isToday = date.toDateString() === now.toDateString();

      if (isToday) {
        return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      }

      return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 font-mono">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-widest text-muted">
          session log ({sessions.length})
        </span>

        {sessions.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="flex items-center gap-1.5 text-xs text-muted hover:text-error transition-colors px-2 py-1 rounded hover:bg-error/10"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {sessions.length === 0 ? (
        <div className="w-full py-12 text-center bg-surface/30 border border-subtle/50 rounded text-xs text-muted">
          No test sessions recorded yet. Start a test on the home page!
        </div>
      ) : (
        <div className="w-full overflow-x-auto border border-subtle/80 rounded-lg bg-surface/30 shadow-inner">
          <table className="w-full min-w-[420px] text-left text-xs">
            <thead className="bg-surface border-b border-subtle text-muted text-[10px] sm:text-[11px] uppercase tracking-wider">
              <tr>
                <th className="py-2.5 sm:py-3 px-2.5 sm:px-4 font-semibold">wpm</th>
                <th className="py-2.5 sm:py-3 px-2.5 sm:px-4 font-semibold">raw</th>
                <th className="py-2.5 sm:py-3 px-2.5 sm:px-4 font-semibold">acc</th>
                <th className="py-2.5 sm:py-3 px-2.5 sm:px-4 font-semibold">mode</th>
                <th className="py-2.5 sm:py-3 px-2.5 sm:px-4 font-semibold">errors</th>
                <th className="py-2.5 sm:py-3 px-2.5 sm:px-4 font-semibold">date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-subtle/40">
              {sessions.map((item) => (
                <tr key={item.id} className="hover:bg-subtle/20 transition-colors">
                  <td className="py-2.5 sm:py-3 px-2.5 sm:px-4 font-bold text-accent text-xs sm:text-sm">
                    {Math.round(item.wpm)}
                  </td>
                  <td className="py-2.5 sm:py-3 px-2.5 sm:px-4 text-muted">{item.rawWpm}</td>
                  <td className="py-2.5 sm:py-3 px-2.5 sm:px-4 font-semibold text-foreground">{item.accuracy}%</td>
                  <td className="py-2.5 sm:py-3 px-2.5 sm:px-4 text-muted">{item.mode}</td>
                  <td className="py-2.5 sm:py-3 px-2.5 sm:px-4 text-muted">
                    <span className={item.errors > 0 ? 'text-error' : 'text-emerald-500'}>
                      {item.errors}
                    </span>
                  </td>
                  <td className="py-2.5 sm:py-3 px-2.5 sm:px-4 text-muted/70 text-[11px] sm:text-xs whitespace-nowrap">
                    {formatDate(item.date)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
