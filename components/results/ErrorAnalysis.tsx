'use client';

import { TypingSession } from '@/lib/typing/types';
import { Crosshair, ArrowRight } from 'lucide-react';

interface ErrorAnalysisProps {
  session: TypingSession;
}

export function ErrorAnalysis({ session }: ErrorAnalysisProps) {
  const { errors, backspaces, characters, commonMistakes } = session;

  return (
    <div className="w-full flex flex-col gap-6 py-6 border-t border-subtle">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-widest text-muted font-mono">
          keystroke & error analysis
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
        <div className="bg-surface/50 border border-subtle rounded p-4">
          <span className="text-xs text-muted block mb-1">Total Errors</span>
          <span className="text-2xl font-bold text-error">{errors}</span>
        </div>

        <div className="bg-surface/50 border border-subtle rounded p-4">
          <span className="text-xs text-muted block mb-1">Incorrect Characters</span>
          <span className="text-2xl font-bold text-foreground">
            {characters.incorrect + characters.extra}
          </span>
        </div>

        <div className="bg-surface/50 border border-subtle rounded p-4">
          <span className="text-xs text-muted block mb-1">Backspaces Pressed</span>
          <span className="text-2xl font-bold text-foreground">{backspaces}</span>
        </div>
      </div>

      {/* Common Mistake Pairs */}
      <div className="bg-surface/40 border border-subtle rounded p-4 font-mono">
        <div className="flex items-center gap-2 text-xs text-muted mb-3 font-semibold">
          <Crosshair className="w-3.5 h-3.5 text-accent" />
          <span>Common Mistakes (Expected → Typed)</span>
        </div>

        {commonMistakes.length === 0 ? (
          <p className="text-xs text-muted">No repeated mistakes recorded. Flawless accuracy!</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {commonMistakes.map((entry, idx) => (
              <div
                key={`mistake-${idx}`}
                className="flex items-center justify-between px-3 py-2 rounded bg-surface border border-subtle/80 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="text-foreground font-semibold">
                    {entry.expected === ' ' ? '␣' : entry.expected}
                  </span>
                  <ArrowRight className="w-3 h-3 text-muted" />
                  <span className="text-error font-semibold">
                    {entry.typed === ' ' ? '␣' : entry.typed}
                  </span>
                </div>
                <span className="text-xs text-accent font-medium">{entry.count}x</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
