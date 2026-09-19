'use client';

import React, { useEffect, useRef, useState } from 'react';
import { TypingState } from '@/lib/typing/types';

interface TypingTextProps {
  state: TypingState;
}

export function TypingText({ state }: TypingTextProps) {
  const { words, currentWordIndex, currentInput, history, status } = state;

  const containerRef = useRef<HTMLDivElement>(null);
  const activeCharRef = useRef<HTMLSpanElement>(null);
  const activeWordRef = useRef<HTMLSpanElement>(null);

  const [caretPos, setCaretPos] = useState<{ left: number; top: number; height: number }>({
    left: 0,
    top: 0,
    height: 32,
  });

  // Calculate Caret position whenever current word, input, or window resizes
  useEffect(() => {
    const updateCaret = () => {
      if (!containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();

      if (activeCharRef.current) {
        const charRect = activeCharRef.current.getBoundingClientRect();
        setCaretPos({
          left: charRect.left - containerRect.left,
          top: charRect.top - containerRect.top + containerRef.current.scrollTop,
          height: charRect.height || 32,
        });
      } else if (activeWordRef.current) {
        const wordRect = activeWordRef.current.getBoundingClientRect();
        // If caret is at the end of the word or beyond
        setCaretPos({
          left: wordRect.right - containerRect.left,
          top: wordRect.top - containerRect.top + containerRef.current.scrollTop,
          height: wordRect.height || 32,
        });
      }
    };

    updateCaret();

    // Auto-scroll container to keep active word in view
    if (activeWordRef.current && containerRef.current) {
      const container = containerRef.current;
      const activeWord = activeWordRef.current;

      const offsetTop = activeWord.offsetTop;
      const lineHeight = 52; // line height for comfortable reading

      // If active word is on line 2 or lower, scroll smoothly
      if (offsetTop > lineHeight) {
        container.scrollTo({
          top: offsetTop - lineHeight,
          behavior: 'smooth',
        });
      } else {
        container.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }
    }

    window.addEventListener('resize', updateCaret);
    return () => window.removeEventListener('resize', updateCaret);
  }, [currentWordIndex, currentInput, words]);

  return (
    <div
      ref={containerRef}
      style={{ fontFamily: "'Poppins', sans-serif" }}
      className="relative w-full max-h-[168px] overflow-hidden select-none font-poppins text-2xl sm:text-3xl leading-[52px] tracking-wide focus:outline-none transition-opacity duration-200"
    >
      {/* Dynamic Animated Caret */}
      {status !== 'finished' && (
        <div
          className={`absolute w-[3px] bg-accent rounded-full pointer-events-none caret-smooth z-10 ${
            status === 'idle' ? 'animate-blink' : ''
          }`}
          style={{
            left: `${caretPos.left}px`,
            top: `${caretPos.top + 6}px`,
            height: `${caretPos.height - 12}px`,
          }}
        />
      )}

      {/* Words Stream */}
      <div className="flex flex-wrap gap-x-3.5 gap-y-1">
        {words.map((word, wIdx) => {
          const isPast = wIdx < currentWordIndex;
          const isCurrent = wIdx === currentWordIndex;
          const isFuture = wIdx > currentWordIndex;

          if (isPast) {
            const hist = history[wIdx];
            const typed = hist ? hist.typed : '';
            const isWordCorrect = typed === word;

            return (
              <span
                key={`word-${wIdx}`}
                className={`inline-flex whitespace-nowrap transition-colors ${
                  !isWordCorrect ? 'border-b border-error/50' : ''
                }`}
              >
                {word.split('').map((char, cIdx) => {
                  const typedChar = typed[cIdx];
                  const isCharCorrect = typedChar === char;

                  return (
                    <span
                      key={`past-${wIdx}-${cIdx}`}
                      className={
                        typedChar === undefined
                          ? 'text-muted/50'
                          : isCharCorrect
                          ? 'text-foreground'
                          : 'text-error'
                      }
                    >
                      {char}
                    </span>
                  );
                })}
                {/* Any extra characters typed in the past word */}
                {typed.length > word.length &&
                  typed
                    .slice(word.length)
                    .split('')
                    .map((extraChar, eIdx) => (
                      <span
                        key={`extra-past-${wIdx}-${eIdx}`}
                        className="text-error-extra opacity-80"
                      >
                        {extraChar}
                      </span>
                    ))}
              </span>
            );
          }

          if (isCurrent) {
            const extraChars =
              currentInput.length > word.length
                ? currentInput.slice(word.length).split('')
                : [];

            return (
              <span
                key={`word-${wIdx}`}
                ref={activeWordRef}
                className="inline-flex whitespace-nowrap relative"
              >
                {word.split('').map((char, cIdx) => {
                  const isTyped = cIdx < currentInput.length;
                  const isCurrentCaret = cIdx === currentInput.length;
                  const isCharCorrect = isTyped && currentInput[cIdx] === char;

                  let charClass = 'char-untyped';
                  if (isTyped) {
                    charClass = isCharCorrect ? 'char-correct' : 'char-incorrect';
                  }

                  return (
                    <span
                      key={`cur-${wIdx}-${cIdx}`}
                      ref={isCurrentCaret ? activeCharRef : null}
                      className={`${charClass} transition-colors duration-75`}
                    >
                      {char}
                    </span>
                  );
                })}

                {/* Extra characters typed in the current word */}
                {extraChars.map((extraChar, eIdx) => {
                  const isCurrentCaret =
                    word.length + eIdx + 1 === currentInput.length;

                  return (
                    <span
                      key={`cur-extra-${wIdx}-${eIdx}`}
                      ref={isCurrentCaret ? activeCharRef : null}
                      className="char-extra"
                    >
                      {extraChar}
                    </span>
                  );
                })}
              </span>
            );
          }

          // Future words
          return (
            <span
              key={`word-${wIdx}`}
              className="inline-flex whitespace-nowrap text-muted/60 transition-colors"
            >
              {word}
            </span>
          );
        })}
      </div>
    </div>
  );
}
