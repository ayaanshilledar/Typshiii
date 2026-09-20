'use client';

import React, { useState, useRef, useEffect } from 'react';
import { WordResult } from '@/lib/typing/types';
import { playKeyClick } from '@/lib/audio/sound';
import { Check, X, RotateCcw, ArrowRight } from 'lucide-react';

interface MistakeReplayProps {
  mistakes: WordResult[];
  onClose: () => void;
}

export function MistakeReplay({ mistakes, onClose }: MistakeReplayProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentMistake = mistakes[currentIndex];
  const targetWord = currentMistake ? currentMistake.word : '';
  const originalTyped = currentMistake ? currentMistake.typed || '(missed)' : '';

  // Focus input automatically
  useEffect(() => {
    inputRef.current?.focus();
  }, [currentIndex, isCompleted]);

  // Keep input focused when clicking the container
  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trimStart();
    setInput(value);

    // Audio feedback
    if (value.length > input.length) {
      const lastChar = value[value.length - 1];
      const targetChar = targetWord[value.length - 1];
      if (lastChar === targetChar) {
        playKeyClick('char');
      } else {
        playKeyClick('error');
      }
    }

    // Check if word is typed completely and correctly
    if (value === targetWord) {
      handleWordCorrect();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      playKeyClick('backspace');
    } else if (e.key === ' ' || e.key === 'Enter') {
      if (input.trim() === targetWord) {
        e.preventDefault();
        handleWordCorrect();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  const handleWordCorrect = () => {
    playKeyClick('space');
    setInput('');

    if (currentIndex + 1 < mistakes.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setInput('');
    setIsCompleted(false);
  };

  if (mistakes.length === 0) return null;

  return (
    <div
      onClick={handleContainerClick}
      className="w-full bg-surface border border-subtle/90 rounded-xl p-5 sm:p-6 flex flex-col gap-4 font-poppins relative shadow-lg"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-subtle/40 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-accent font-poppins">
            Mistake Replay
          </span>
          {!isCompleted && (
            <span className="text-xs font-mono text-muted bg-background/60 px-2 py-0.5 rounded border border-subtle/50">
              {currentIndex + 1} / {mistakes.length}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close replay"
          className="p-1 rounded-md text-muted hover:text-foreground hover:bg-subtle/50 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {isCompleted ? (
        /* Completion Summary */
        <div className="py-6 flex flex-col items-center justify-center text-center gap-4 animate-in fade-in duration-150">
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Check className="w-5 h-5" />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground font-poppins">
              All {mistakes.length} {mistakes.length === 1 ? 'mistake' : 'mistakes'} reviewed and corrected!
            </h3>
            <p className="text-xs text-muted mt-1">
              Muscle memory updated. Great job practicing your accuracy.
            </p>
          </div>

          <div className="flex items-center gap-2.5 mt-2">
            <button
              type="button"
              onClick={handleRestart}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-surface border border-subtle text-xs font-medium text-muted hover:text-foreground hover:border-subtle/90 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Review Again</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-accent text-background text-xs font-semibold hover:bg-accent-hover transition-colors"
            >
              <span>Back to Results</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* Active Word Retype Interface */
        <div className="flex flex-col items-center justify-center py-4 gap-4 text-center">
          {/* Target Word with Real-time Character Coloring */}
          <div className="font-mono text-2xl sm:text-3xl tracking-wide select-none">
            {targetWord.split('').map((char, i) => {
              let color = 'text-muted/60';
              if (i < input.length) {
                color = input[i] === char ? 'text-accent font-semibold' : 'text-error font-semibold underline';
              }
              return (
                <span key={i} className={color}>
                  {char}
                </span>
              );
            })}
            {/* Show extra characters typed if any */}
            {input.length > targetWord.length && (
              <span className="text-error underline opacity-80 font-mono">
                {input.slice(targetWord.length)}
              </span>
            )}
          </div>

          {/* Original Typo Comparison */}
          <div className="flex items-center gap-2 text-xs font-mono text-muted">
            <span>you typed:</span>
            <span className="text-error/90 bg-error/10 px-2 py-0.5 rounded border border-error/20">
              {originalTyped}
            </span>
          </div>

          {/* Retype Input Box */}
          <div className="w-full max-w-xs mt-1">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="type the word..."
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              className="w-full px-3 py-2 rounded-lg bg-background/80 border border-subtle focus:border-accent text-center font-mono text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-accent/40 placeholder:text-muted/40 transition-all"
            />
          </div>

          <span className="text-[11px] text-muted/60 font-mono">
            type correctly to advance • press esc to exit
          </span>
        </div>
      )}
    </div>
  );
}
