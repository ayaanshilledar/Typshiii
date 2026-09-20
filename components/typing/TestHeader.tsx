'use client';

import React, { useRef, useState, useEffect } from 'react';
import { TestMode } from '@/lib/typing/types';
import { Clock, Type } from 'lucide-react';

interface TestHeaderProps {
  mode: TestMode;
  limit: number;
  disabled?: boolean;
  onConfigChange: (mode: TestMode, limit: number) => void;
}

export function TestHeader({
  mode,
  limit,
  disabled = false,
  onConfigChange,
}: TestHeaderProps) {
  const timeOptions = [15, 30, 60, 120];
  const wordOptions = [10, 25, 50, 100];

  // Refs for tracking button positions for smooth sliding animation
  const timeBtnRef = useRef<HTMLButtonElement>(null);
  const wordsBtnRef = useRef<HTMLButtonElement>(null);
  const limitRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [modePillStyle, setModePillStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const [limitPillStyle, setLimitPillStyle] = useState({ left: 0, width: 0, opacity: 0 });

  // Update mode sliding pill
  useEffect(() => {
    const updatePills = () => {
      const activeRef = mode === 'time' ? timeBtnRef.current : wordsBtnRef.current;
      if (activeRef) {
        setModePillStyle({
          left: activeRef.offsetLeft,
          width: activeRef.offsetWidth,
          opacity: 1,
        });
      }

      const options = mode === 'time' ? timeOptions : wordOptions;
      const activeIndex = options.indexOf(limit);
      const activeLimitRef = limitRefs.current[activeIndex];
      if (activeLimitRef) {
        setLimitPillStyle({
          left: activeLimitRef.offsetLeft,
          width: activeLimitRef.offsetWidth,
          opacity: 1,
        });
      }
    };

    updatePills();
    window.addEventListener('resize', updatePills);
    return () => window.removeEventListener('resize', updatePills);
  }, [mode, limit]);

  return (
    <div className="w-full flex items-center justify-center my-3 sm:my-6 px-1">
      {/* Square roundish container */}
      <div className="flex flex-wrap xs:flex-nowrap items-center justify-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 rounded-xl bg-surface/90 border border-subtle/80 shadow-md backdrop-blur-sm text-[11px] sm:text-xs font-poppins select-none max-w-full">
        {/* Mode Selector with animated sliding pill */}
        <div className="relative flex items-center bg-background/50 p-0.5 sm:p-1 rounded-lg border border-subtle/40">
          {/* Smooth Sliding Pill Indicator */}
          <div
            className="absolute top-0.5 bottom-0.5 sm:top-1 sm:bottom-1 rounded-md bg-accent/15 border border-accent/30 pointer-events-none transition-all duration-200 ease-out"
            style={{
              left: `${modePillStyle.left}px`,
              width: `${modePillStyle.width}px`,
              opacity: modePillStyle.opacity,
            }}
          />

          <button
            ref={timeBtnRef}
            type="button"
            disabled={disabled}
            onClick={() => onConfigChange('time', 30)}
            className={`relative z-10 flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md transition-colors duration-150 ${
              mode === 'time'
                ? 'text-accent font-semibold'
                : 'text-muted hover:text-foreground'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>time</span>
          </button>

          <button
            ref={wordsBtnRef}
            type="button"
            disabled={disabled}
            onClick={() => onConfigChange('words', 50)}
            className={`relative z-10 flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md transition-colors duration-150 ${
              mode === 'words'
                ? 'text-accent font-semibold'
                : 'text-muted hover:text-foreground'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Type className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>words</span>
          </button>
        </div>

        {/* Divider */}
        <div className="hidden xs:block w-[1px] h-4 sm:h-5 bg-subtle/80 mx-0.5" />

        {/* Limits Selector with animated sliding pill */}
        <div className="relative flex items-center bg-background/50 p-0.5 sm:p-1 rounded-lg border border-subtle/40">
          {/* Smooth Sliding Pill Indicator */}
          <div
            className="absolute top-0.5 bottom-0.5 sm:top-1 sm:bottom-1 rounded-md bg-accent/15 border border-accent/30 pointer-events-none transition-all duration-200 ease-out"
            style={{
              left: `${limitPillStyle.left}px`,
              width: `${limitPillStyle.width}px`,
              opacity: limitPillStyle.opacity,
            }}
          />

          {(mode === 'time' ? timeOptions : wordOptions).map((opt, idx) => (
            <button
              key={opt}
              ref={(el) => {
                limitRefs.current[idx] = el;
              }}
              type="button"
              disabled={disabled}
              onClick={() => onConfigChange(mode, opt)}
              className={`relative z-10 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md transition-colors duration-150 ${
                limit === opt
                  ? 'text-accent font-semibold'
                  : 'text-muted hover:text-foreground'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {opt}{mode === 'time' ? 's' : ''}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
