'use client';

import { TypingState } from '@/lib/typing/types';
import { calculateWpm, calculateAccuracy } from '@/lib/typing/metrics';

interface LiveMetricsProps {
  state: TypingState;
}

export function LiveMetrics({ state }: LiveMetricsProps) {
  const { mode, timeLimit, wordLimit, currentWordIndex, elapsedTime, correctChars, incorrectChars, extraChars, status } = state;

  const remainingTime = Math.max(0, timeLimit - elapsedTime);
  const totalTyped = correctChars + incorrectChars + extraChars;
  const currentWpm = calculateWpm(correctChars, elapsedTime);
  const currentAcc = calculateAccuracy(correctChars, totalTyped);

  return (
    <div className="w-full flex items-center justify-between font-poppins mb-2 sm:mb-4 text-xs sm:text-sm select-none">
      {/* Primary Counter (Time remaining or Words progress) */}
      <div className="flex items-center gap-2 sm:gap-3">
        <span className="text-2xl sm:text-4xl font-bold text-accent tracking-tight">
          {mode === 'time'
            ? status === 'idle'
              ? timeLimit
              : remainingTime
            : `${currentWordIndex} / ${wordLimit}`}
        </span>
      </div>

      {/* Live WPM & Accuracy (Visible when test is running) */}
      <div
        className={`flex items-center gap-2.5 sm:gap-4 text-xs sm:text-sm text-muted transition-opacity duration-200 ${
          status === 'running' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex items-center gap-1">
          <span className="font-semibold text-foreground">{currentWpm}</span>
          <span>wpm</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-semibold text-foreground">{currentAcc}%</span>
          <span>acc</span>
        </div>
      </div>
    </div>
  );
}
