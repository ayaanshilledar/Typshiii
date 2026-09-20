'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Sliders, X } from 'lucide-react';
import {
  SoundTheme,
  setSoundEnabled,
  setSoundTheme,
  setSoundVolume,
  playKeyClick,
} from '@/lib/audio/sound';

export type { SoundTheme };

export interface SettingsState {
  caretStyle: 'line' | 'block' | 'underline';
  showLiveWpm: boolean;
  showLiveAcc: boolean;
  soundEnabled: boolean;
  soundTheme: SoundTheme;
  soundVolume: number; // 0 to 100
}

export const DEFAULT_SETTINGS: SettingsState = {
  caretStyle: 'line',
  showLiveWpm: true,
  showLiveAcc: true,
  soundEnabled: true,
  soundTheme: 'mechanical',
  soundVolume: 70,
};

export const SETTINGS_KEY = 'typeshii_settings_v1';

export const SOUND_THEMES: { id: SoundTheme; name: string }[] = [
  { id: 'mechanical', name: 'mechanical' },
  { id: 'thock', name: 'thock' },
  { id: 'creamy', name: 'creamy' },
  { id: 'typewriter', name: 'typewriter' },
  { id: 'pop', name: 'pop' },
];

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsChange?: (newSettings: SettingsState) => void;
}

export function SettingsModal({ isOpen, onClose, onSettingsChange }: SettingsModalProps) {
  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        const merged: SettingsState = {
          ...DEFAULT_SETTINGS,
          ...parsed,
          soundTheme: parsed.soundTheme || DEFAULT_SETTINGS.soundTheme,
          soundVolume: typeof parsed.soundVolume === 'number' ? parsed.soundVolume : DEFAULT_SETTINGS.soundVolume,
        };
        setSettings(merged);
        setSoundEnabled(merged.soundEnabled);
        setSoundTheme(merged.soundTheme);
        setSoundVolume(merged.soundVolume / 100);
      }
    } catch {
      // fallback
    }
  }, [isOpen]);

  // Handle escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const updateSetting = <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));

    // Sync active audio parameters immediately
    if (key === 'soundEnabled') {
      setSoundEnabled(value as boolean);
    } else if (key === 'soundTheme') {
      setSoundTheme(value as SoundTheme);
      // Play a preview click when switching themes so user can listen to it
      if (updated.soundEnabled) {
        playKeyClick('char', value as SoundTheme);
      }
    } else if (key === 'soundVolume') {
      setSoundVolume((value as number) / 100);
    }

    if (onSettingsChange) {
      onSettingsChange(updated);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className="w-full max-w-lg bg-surface border border-subtle/90 rounded-xl shadow-2xl p-4 sm:p-6 flex flex-col gap-4 sm:gap-6 font-poppins relative animate-in zoom-in-95 duration-150 select-none max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-subtle/50">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <Sliders className="w-4 h-4 text-accent" />
            <h2 className="text-base font-semibold text-foreground tracking-tight">settings</h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close settings"
            className="p-1.5 rounded-md text-muted hover:text-foreground hover:bg-subtle/50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Options list */}
        <div className="flex flex-col gap-3 sm:gap-4">
          {/* Caret Style */}
          <div className="p-3 sm:p-3.5 rounded-lg bg-background/50 border border-subtle/60 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2.5 sm:gap-3">
            <div>
              <span className="text-sm font-medium text-foreground block">Caret Style</span>
              <span className="text-xs text-muted">Appearance of cursor on words</span>
            </div>

            <div className="flex items-center gap-1 sm:gap-1.5 self-end xs:self-auto">
              {(['line', 'block', 'underline'] as const).map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => updateSetting('caretStyle', style)}
                  className={`px-2.5 sm:px-3 py-1 text-xs rounded uppercase font-medium transition-all ${
                    settings.caretStyle === style
                      ? 'bg-accent text-background font-bold shadow'
                      : 'bg-surface border border-subtle/80 text-muted hover:text-foreground'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* Live WPM Indicator */}
          <div className="p-3 sm:p-3.5 rounded-lg bg-background/50 border border-subtle/60 flex items-center justify-between gap-3">
            <div>
              <span className="text-sm font-medium text-foreground block">Live WPM Indicator</span>
              <span className="text-xs text-muted">Show speed in real-time while typing</span>
            </div>

            <button
              type="button"
              onClick={() => updateSetting('showLiveWpm', !settings.showLiveWpm)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors shrink-0 ${
                settings.showLiveWpm ? 'bg-accent justify-end' : 'bg-subtle justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-background shadow" />
            </button>
          </div>

          {/* Live Accuracy Indicator */}
          <div className="p-3 sm:p-3.5 rounded-lg bg-background/50 border border-subtle/60 flex items-center justify-between gap-3">
            <div>
              <span className="text-sm font-medium text-foreground block">Live Accuracy</span>
              <span className="text-xs text-muted">Show live percentage accuracy</span>
            </div>

            <button
              type="button"
              onClick={() => updateSetting('showLiveAcc', !settings.showLiveAcc)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors shrink-0 ${
                settings.showLiveAcc ? 'bg-accent justify-end' : 'bg-subtle justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-background shadow" />
            </button>
          </div>

          {/* Keystroke Sound - Minimal & Swipeable */}
          <div className="p-3 sm:p-3.5 rounded-lg bg-background/50 border border-subtle/60 flex flex-col gap-2.5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="text-sm font-medium text-foreground block">Keystroke Sound</span>
                <span className="text-xs text-muted">Acoustic mechanical switch click</span>
              </div>

              <button
                type="button"
                onClick={() => updateSetting('soundEnabled', !settings.soundEnabled)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors shrink-0 ${
                  settings.soundEnabled ? 'bg-accent justify-end' : 'bg-subtle justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-background shadow" />
              </button>
            </div>

            {/* Minimal sound profile swipeable bar */}
            {settings.soundEnabled && (
              <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {SOUND_THEMES.map((theme) => {
                  const isSelected = settings.soundTheme === theme.id;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => updateSetting('soundTheme', theme.id)}
                      className={`px-3 py-1 text-xs rounded uppercase font-medium whitespace-nowrap transition-all shrink-0 ${
                        isSelected
                          ? 'bg-accent text-background font-bold shadow'
                          : 'bg-surface border border-subtle/80 text-muted hover:text-foreground'
                      }`}
                    >
                      {theme.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-2 flex items-center justify-between text-xs text-muted/60 border-t border-subtle/30 font-mono">
          <span className="hidden xs:inline">press esc or tap outside to close</span>
          <span className="xs:hidden">tap outside to close</span>
          <span>auto-saved</span>
        </div>
      </div>
    </div>
  );
}
