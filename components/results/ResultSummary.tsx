'use client';

import { TypingSession } from '@/lib/typing/types';

interface ResultSummaryProps {
  session: TypingSession;
}

export function ResultSummary({ session }: ResultSummaryProps) {
  const { wpm, rawWpm, accuracy, consistency, duration, characters, errors, backspaces } = session;

  return (
    <div className="w-full flex flex-col md:flex-row items-baseline justify-between gap-8 pb-8 border-b border-subtle">
      {/* Hero Primary Metric: WPM and Accuracy */}
      <div className="flex items-baseline gap-8">
        <div>
          <span className="text-xs uppercase tracking-widest text-muted font-mono block">wpm</span>
          <span className="text-6xl sm:text-7xl font-bold font-mono text-accent tracking-tighter">
            {Math.round(wpm)}
          </span>
        </div>

        <div>
          <span className="text-xs uppercase tracking-widest text-muted font-mono block">acc</span>
          <span className="text-5xl sm:text-6xl font-bold font-mono text-foreground tracking-tighter">
            {accuracy}%
          </span>
        </div>
      </div>

      {/* Secondary Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 font-mono text-sm">
        <div>
          <span className="text-xs text-muted block mb-0.5">test type</span>
          <span className="text-foreground font-medium">{session.mode}</span>
        </div>

        <div>
          <span className="text-xs text-muted block mb-0.5">raw wpm</span>
          <span className="text-foreground font-medium">{rawWpm}</span>
        </div>

        <div>
          <span className="text-xs text-muted block mb-0.5">characters</span>
          <span className="text-foreground font-medium">
            <span className="text-foreground">{characters.correct}</span>
            <span className="text-muted"> / </span>
            <span className="text-error">{characters.incorrect + characters.extra}</span>
          </span>
        </div>

        <div>
          <span className="text-xs text-muted block mb-0.5">consistency</span>
          <span className="text-foreground font-medium">{consistency}%</span>
        </div>

        <div>
          <span className="text-xs text-muted block mb-0.5">time</span>
          <span className="text-foreground font-medium">{duration}s</span>
        </div>

        <div>
          <span className="text-xs text-muted block mb-0.5">errors</span>
          <span className="text-error font-medium">{errors}</span>
        </div>

        <div>
          <span className="text-xs text-muted block mb-0.5">backspaces</span>
          <span className="text-foreground font-medium">{backspaces}</span>
        </div>

        <div>
          <span className="text-xs text-muted block mb-0.5">accuracy</span>
          <span className="text-foreground font-medium">{accuracy}%</span>
        </div>
      </div>
    </div>
  );
}
