'use client';

import React, { useEffect, useRef, useState, memo } from 'react';
import { TypingState } from '@/lib/typing/types';

interface TypingTextProps {
  state: TypingState;
}

/**
 * Memoized representation of an already typed past word.
 * Only re-renders if backspaced into or history is altered.
 */
const PastWordItem = memo(function PastWordItem({
  word,
  typed,
}: {
  word: string;
  typed: string;
}) {
  const isWordCorrect = typed === word;

  return (
    <span
      className={`inline-flex whitespace-nowrap transition-colors ${
        !isWordCorrect ? 'border-b border-error/50' : ''
      }`}
    >
      {word.split('').map((char, cIdx) => {
        const typedChar = typed[cIdx];
        const isCharCorrect = typedChar === char;

        return (
          <span
            key={`past-c-${cIdx}`}
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
      {typed.length > word.length &&
        typed
          .slice(word.length)
          .split('')
          .map((extraChar, eIdx) => (
            <span key={`extra-c-${eIdx}`} className="text-error-extra opacity-80">
              {extraChar}
            </span>
          ))}
    </span>
  );
});

/**
 * The currently active word being typed.
 * Attaches refs to track caret position and auto-scroll viewport offset.
 */
function ActiveWordItem({
  word,
  currentInput,
  wordRef,
  charRef,
}: {
  word: string;
  currentInput: string;
  wordRef: React.RefObject<HTMLSpanElement | null>;
  charRef: React.RefObject<HTMLSpanElement | null>;
}) {
  const extraChars =
    currentInput.length > word.length ? currentInput.slice(word.length).split('') : [];

  return (
    <span ref={wordRef} className="inline-flex whitespace-nowrap relative">
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
            key={`cur-c-${cIdx}`}
            ref={isCurrentCaret ? charRef : null}
            className={`${charClass} transition-colors duration-75`}
          >
            {char}
          </span>
        );
      })}

      {extraChars.map((extraChar, eIdx) => {
        const isCurrentCaret = word.length + eIdx + 1 === currentInput.length;

        return (
          <span
            key={`cur-extra-c-${eIdx}`}
            ref={isCurrentCaret ? charRef : null}
            className="char-extra"
          >
            {extraChar}
          </span>
        );
      })}
    </span>
  );
}

/**
 * Memoized upcoming word waiting to be typed.
 */
const FutureWordItem = memo(function FutureWordItem({ word }: { word: string }) {
  return (
    <span className="inline-flex whitespace-nowrap text-muted/60 transition-colors">
      {word}
    </span>
  );
});

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
    const updateCaretPosition = () => {
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
        setCaretPos({
          left: wordRect.right - containerRect.left,
          top: wordRect.top - containerRect.top + containerRef.current.scrollTop,
          height: wordRect.height || 32,
        });
      }
    };

    updateCaretPosition();

    // Auto-scroll container to keep active word in view
    if (activeWordRef.current && containerRef.current) {
      const container = containerRef.current;
      const activeWord = activeWordRef.current;

      const offsetTop = activeWord.offsetTop;
      const lineHeight = activeWord.offsetHeight || 42;

      // If active word is on line 2 or lower, scroll smoothly
      if (offsetTop > lineHeight * 0.8) {
        container.scrollTo({
          top: offsetTop - lineHeight * 0.8,
          behavior: 'smooth',
        });
      } else {
        container.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }
    }

    window.addEventListener('resize', updateCaretPosition);
    return () => window.removeEventListener('resize', updateCaretPosition);
  }, [currentWordIndex, currentInput, words]);

  return (
    <div
      ref={containerRef}
      style={{ fontFamily: "'Poppins', sans-serif" }}
      className="relative w-full max-h-[120px] xs:max-h-[136px] sm:max-h-[168px] overflow-hidden select-none font-poppins text-lg xs:text-xl sm:text-2xl md:text-3xl leading-[36px] xs:leading-[42px] sm:leading-[50px] tracking-wide focus:outline-none transition-opacity duration-200"
    >
      {/* Dynamic Animated Caret */}
      {status !== 'finished' && (
        <div
          className={`absolute w-[2.5px] sm:w-[3px] bg-accent rounded-full pointer-events-none caret-smooth z-10 ${
            status === 'idle' ? 'animate-blink' : ''
          }`}
          style={{
            left: `${caretPos.left}px`,
            top: `${caretPos.top + 3}px`,
            height: `${Math.max(22, caretPos.height - 6)}px`,
          }}
        />
      )}

      {/* Words Stream */}
      <div className="flex flex-wrap gap-x-2.5 sm:gap-x-3.5 gap-y-0.5 sm:gap-y-1">
        {words.map((word, wIdx) => {
          if (wIdx < currentWordIndex) {
            const hist = history[wIdx];
            return (
              <PastWordItem
                key={`word-p-${wIdx}`}
                word={word}
                typed={hist ? hist.typed : ''}
              />
            );
          }

          if (wIdx === currentWordIndex) {
            return (
              <ActiveWordItem
                key={`word-c-${wIdx}`}
                word={word}
                currentInput={currentInput}
                wordRef={activeWordRef}
                charRef={activeCharRef}
              />
            );
          }

          return <FutureWordItem key={`word-f-${wIdx}`} word={word} />;
        })}
      </div>
    </div>
  );
}
