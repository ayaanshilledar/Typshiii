'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { TypingEngine } from '@/lib/typing/engine';
import { TypingState, TestMode } from '@/lib/typing/types';
import { saveSession } from '@/lib/storage/sessions';
import { TestHeader } from './TestHeader';
import { TypingText } from './TypingText';
import { LiveMetrics } from './LiveMetrics';
import { TestControls } from './TestControls';

import { SettingsModal, SettingsState } from '@/components/settings/SettingsModal';
import { playKeyClick, setSoundEnabled } from '@/lib/audio/sound';

export function TypingTest() {
  const router = useRouter();
  const engineRef = useRef<TypingEngine | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<TypingState | null>(null);
  const [isFocused, setIsFocused] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Initialize typing engine once
  useEffect(() => {
    const engine = new TypingEngine('time', 30);
    engineRef.current = engine;

    const unsubscribe = engine.subscribe((newState) => {
      setState(newState);
    });

    const unsubscribeFinish = engine.onFinish((session) => {
      saveSession(session);
      setTimeout(() => {
        router.push('/results');
      }, 250);
    });

    // Auto-focus typing input
    if (inputRef.current) {
      inputRef.current.focus();
    }

    // Initialize sound preference (default on, or user setting)
    try {
      const data = localStorage.getItem('typeshii_settings_v1');
      if (data) {
        const parsed = JSON.parse(data);
        if (typeof parsed.soundEnabled === 'boolean') {
          setSoundEnabled(parsed.soundEnabled);
        } else {
          setSoundEnabled(true);
        }
      } else {
        setSoundEnabled(true);
      }
    } catch {
      setSoundEnabled(true);
    }

    const handleOpenSettingsEvent = () => {
      setIsSettingsOpen(true);
    };

    window.addEventListener('open-settings', handleOpenSettingsEvent);

    return () => {
      window.removeEventListener('open-settings', handleOpenSettingsEvent);
      unsubscribe();
      unsubscribeFinish();
      engine.destroy();
    };
  }, [router]);

  // Restart / Reset handler
  const handleRestart = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.reset();
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, []);

  // Mode and limit change handler
  const handleConfigChange = useCallback((mode: TestMode, limit: number) => {
    if (engineRef.current) {
      engineRef.current.setConfig(mode, limit);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, []);

  // Global key listener for shortcuts (Tab, Esc, Ctrl+Shift+P, 1-4) & focus handling
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Shift+P opens settings / command modal
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        setIsSettingsOpen(true);
        return;
      }

      // If modal is open, let modal handle keys (Esc closes modal)
      if (isSettingsOpen) {
        if (e.key === 'Escape') {
          e.preventDefault();
          setIsSettingsOpen(false);
          inputRef.current?.focus();
        }
        return;
      }

      // Tab key restarts the test
      if (e.key === 'Tab') {
        e.preventDefault();
        handleRestart();
        return;
      }

      // Esc key resets the test
      if (e.key === 'Escape') {
        e.preventDefault();
        handleRestart();
        return;
      }

      // Quick number toggles when idle
      if (state && state.status === 'idle') {
        if (e.key === '1') {
          e.preventDefault();
          handleConfigChange(state.mode, state.mode === 'time' ? 15 : 10);
          return;
        }
        if (e.key === '2') {
          e.preventDefault();
          handleConfigChange(state.mode, state.mode === 'time' ? 30 : 25);
          return;
        }
        if (e.key === '3') {
          e.preventDefault();
          handleConfigChange(state.mode, state.mode === 'time' ? 60 : 50);
          return;
        }
        if (e.key === '4') {
          e.preventDefault();
          handleConfigChange(state.mode, state.mode === 'time' ? 120 : 100);
          return;
        }
      }

      // Auto-refocus hidden input if user presses any typing key
      if (inputRef.current && document.activeElement !== inputRef.current && !isSettingsOpen) {
        inputRef.current.focus();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [handleRestart, handleConfigChange, state, isSettingsOpen]);

  const handleContainerClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
      setIsFocused(true);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!engineRef.current) return;

    if (e.key === ' ') {
      playKeyClick('space');
    } else if (e.key === 'Backspace') {
      playKeyClick('backspace');
    } else if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
      playKeyClick('char');
    }

    const handled = engineRef.current.handleKeyDown(e.nativeEvent);
    if (handled) {
      e.preventDefault();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!val || !engineRef.current) return;

    for (const char of val) {
      if (char === ' ') {
        playKeyClick('space');
        engineRef.current.handleSpace();
      } else {
        playKeyClick('char');
        engineRef.current.handleChar(char);
      }
    }
    e.target.value = '';
  };

  const handleBeforeInput = (e: React.FormEvent<HTMLInputElement>) => {
    const nativeEvt = e.nativeEvent as InputEvent;
    if (!engineRef.current) return;

    if (nativeEvt.inputType === 'deleteContentBackward') {
      playKeyClick('backspace');
      engineRef.current.handleBackspace();
      e.preventDefault();
      return;
    }

    if (nativeEvt.data) {
      for (const char of nativeEvt.data) {
        if (char === ' ') {
          playKeyClick('space');
          engineRef.current.handleSpace();
        } else {
          playKeyClick('char');
          engineRef.current.handleChar(char);
        }
      }
      e.preventDefault();
    }
  };

  if (!state) return null;

  return (
    <div
      onClick={handleContainerClick}
      className="w-full py-3 sm:py-8 md:py-12 flex flex-col items-center justify-center cursor-default outline-none select-none relative min-h-[340px] sm:min-h-[440px]"
    >
      {/* Top Test Configuration (Time/Words options) */}
      <TestHeader
        mode={state.mode}
        limit={state.mode === 'time' ? state.timeLimit : state.wordLimit}
        disabled={state.status === 'running'}
        onConfigChange={handleConfigChange}
      />

      {/* Live Timer & Live WPM Counter */}
      <div className="w-full px-1 sm:px-4">
        <LiveMetrics state={state} />
      </div>

      {/* Typing Surface */}
      <div className="w-full px-1 sm:px-4 relative group">
        {/* Invisible transparent input placed over typing surface for touch & keyboard focus */}
        <input
          ref={inputRef}
          type="text"
          value=""
          onChange={handleInputChange}
          onBeforeInput={handleBeforeInput}
          onKeyDown={handleInputKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-text text-base"
          autoFocus
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          inputMode="text"
          tabIndex={0}
        />

        <TypingText state={state} />

        {/* Unfocused notification indicator */}
        {!isFocused && state.status !== 'finished' && (
          <div
            onClick={handleContainerClick}
            className="absolute inset-0 bg-background/80 backdrop-blur-[2px] flex items-center justify-center cursor-pointer z-20 rounded-lg transition-opacity p-4 text-center"
          >
            <span className="text-xs sm:text-sm font-sans font-medium text-accent bg-surface/90 px-4 py-2 rounded-full border border-subtle/80 shadow-md">
              tap here or press any key to focus
            </span>
          </div>
        )}
      </div>

      {/* Test Controls (Restart & Shortcuts) */}
      <TestControls
        onRestart={handleRestart}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Center Modal Popup for Settings */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onSettingsChange={(newSettings) => {
          setSoundEnabled(newSettings.soundEnabled);
        }}
        onClose={() => {
          setIsSettingsOpen(false);
          inputRef.current?.focus();
        }}
      />
    </div>
  );
}
