'use client';

import { WordResult } from '@/lib/typing/types';
import { getFastestWords, getMostProblematicWords } from '@/lib/typing/word-analysis';
import { Zap, AlertTriangle, Check, X } from 'lucide-react';

interface WordAnalysisProps {
  words: WordResult[];
}

export function WordAnalysis({ words }: WordAnalysisProps) {
  const fastest = getFastestWords(words, 4);
  const problematic = getMostProblematicWords(words, 4);

  return (
    <div className="w-full flex flex-col gap-4 sm:gap-6 py-4 sm:py-6 border-t border-subtle">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-widest text-muted font-mono">
          word performance
        </span>
        <span className="text-xs text-muted font-mono">{words.length} words completed</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Fastest Words */}
        <div className="bg-surface/50 border border-subtle rounded p-4 font-mono">
          <div className="flex items-center gap-2 text-xs text-accent mb-3 font-semibold">
            <Zap className="w-3.5 h-3.5" />
            <span>Fastest Words</span>
          </div>

          {fastest.length === 0 ? (
            <p className="text-xs text-muted">No clean words recorded.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {fastest.map((item, idx) => (
                <div key={`fast-${idx}`} className="flex items-center justify-between text-xs py-1 border-b border-subtle/40 last:border-none">
                  <span className="text-foreground">{item.word}</span>
                  <span className="text-accent/90">{item.durationMs}ms</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Most Problematic Words */}
        <div className="bg-surface/50 border border-subtle rounded p-4 font-mono">
          <div className="flex items-center gap-2 text-xs text-error mb-3 font-semibold">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Most Errors / Revisions</span>
          </div>

          {problematic.length === 0 ? (
            <p className="text-xs text-muted">Zero mistakes on recorded words!</p>
          ) : (
            <div className="flex flex-col gap-2">
              {problematic.map((item, idx) => (
                <div key={`prob-${idx}`} className="flex items-center justify-between text-xs py-1 border-b border-subtle/40 last:border-none">
                  <span className="text-foreground">{item.word}</span>
                  <div className="flex items-center gap-2 text-xs">
                    {item.errors > 0 && (
                      <span className="text-error">{item.errors} errors</span>
                    )}
                    {item.backspaces > 0 && (
                      <span className="text-muted">{item.backspaces} bksp</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Full Word Stream Breakdown */}
      <div className="bg-surface/30 border border-subtle/60 rounded p-4 font-mono">
        <span className="text-xs text-muted block mb-3">words typed log</span>
        <div className="flex flex-wrap gap-2 text-xs max-h-36 overflow-y-auto pr-1">
          {words.map((item, idx) => (
            <div
              key={`word-log-${idx}`}
              className={`inline-flex items-center gap-1.5 px-2 py-1 rounded border text-xs ${
                item.correct
                  ? 'border-subtle bg-surface text-foreground'
                  : 'border-error/40 bg-error/10 text-error'
              }`}
            >
              <span>{item.word}</span>
              {item.correct ? (
                <Check className="w-3 h-3 text-emerald-500" />
              ) : (
                <X className="w-3 h-3 text-error" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
