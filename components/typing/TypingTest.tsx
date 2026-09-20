'use client';

import React, { useEffect, useState } from 'react';
import { useTypingEngine } from '@/lib/typing/useTypingEngine';
import { TestHeader } from './TestHeader';
import { TypingText } from './TypingText';
import { LiveMetrics } from './LiveMetrics';
import { TestControls } from './TestControls';
import { SettingsModal } from '@/components/settings/SettingsModal';
import { setSoundEnabled } from '@/lib/audio/sound';

export function TypingTest() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const {
    state,
    isFocused,
    inputRef,
    handleRestart,
    handleConfigChange,
    handleContainerClick,
    handleInputKeyDown,
    handleInputChange,
    handleBeforeInput,
    focusInput,
    setIsFocused,
  } = useTypingEngine();

  // Global custom event for opening settings
  useEffect(() => {
    const handleOpenSettingsEvent = () => {
      setIsSettingsOpen(true);
    };

    window.addEventListener('open-settings', handleOpenSettingsEvent);
    return () => window.removeEventListener('open-settings', handleOpenSettingsEvent);
  }, []);

  // Global shortcut listeners (Esc, Ctrl+Shift+P, Tab, 1-4 presets)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Shift+P opens settings / command modal
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        setIsSettingsOpen(true);
        return;
      }

      // Modal handles its own escape
      if (isSettingsOpen) {
        if (e.key === 'Escape') {
          e.preventDefault();
          setIsSettingsOpen(false);
          focusInput();
        }
        return;
      }

      // Tab restarts the test
      if (e.key === 'Tab') {
        e.preventDefault();
        handleRestart();
        return;
      }

      // Esc resets the test
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

      // Auto-refocus input if typing key pressed
      if (inputRef.current && document.activeElement !== inputRef.current && !isSettingsOpen) {
        inputRef.current.focus();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [handleRestart, handleConfigChange, state, isSettingsOpen, focusInput, inputRef]);

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
          focusInput();
        }}
      />
    </div>
  );
}
