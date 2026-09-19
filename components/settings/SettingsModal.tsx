'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Sliders, X, Check, Volume2, VolumeX, Eye, EyeOff } from 'lucide-react';

export interface SettingsState {
  caretStyle: 'line' | 'block' | 'underline';
  showLiveWpm: boolean;
  showLiveAcc: boolean;
  soundEnabled: boolean;
}

export const DEFAULT_SETTINGS: SettingsState = {
  caretStyle: 'line',
  showLiveWpm: true,
  showLiveAcc: true,
  soundEnabled: true,
};

export const SETTINGS_KEY = 'typeshii_settings_v1';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsChange?: (newSettings: SettingsState) => void;
}

export function SettingsModal({ isOpen, onClose, onSettingsChange }: SettingsModalProps) {
  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      if (data) {
        setSettings(JSON.parse(data));
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
    if (onSettingsChange) {
      onSettingsChange(updated);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 1200);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className="w-full max-w-lg bg-surface border border-subtle/90 rounded-xl shadow-2xl p-6 flex flex-col gap-6 font-poppins relative animate-in zoom-in-95 duration-150 select-none"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-subtle/50">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-4 h-4 text-accent" />
            <h2 className="text-base font-semibold text-foreground tracking-tight">settings</h2>
            {saved && (
              <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium ml-2 transition-all">
                <Check className="w-3.5 h-3.5" />
                <span>saved</span>
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-muted hover:text-foreground hover:bg-subtle/50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Options list */}
        <div className="flex flex-col gap-4">
          {/* Caret Style */}
          <div className="p-3.5 rounded-lg bg-background/50 border border-subtle/60 flex items-center justify-between gap-3">
            <div>
              <span className="text-sm font-medium text-foreground block">Caret Style</span>
              <span className="text-xs text-muted">Appearance of cursor on words</span>
            </div>

            <div className="flex items-center gap-1.5">
              {(['line', 'block', 'underline'] as const).map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => updateSetting('caretStyle', style)}
                  className={`px-3 py-1 text-xs rounded uppercase font-medium transition-all ${
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
          <div className="p-3.5 rounded-lg bg-background/50 border border-subtle/60 flex items-center justify-between gap-3">
            <div>
              <span className="text-sm font-medium text-foreground block">Live WPM Indicator</span>
              <span className="text-xs text-muted">Show speed in real-time while typing</span>
            </div>

            <button
              type="button"
              onClick={() => updateSetting('showLiveWpm', !settings.showLiveWpm)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                settings.showLiveWpm ? 'bg-accent justify-end' : 'bg-subtle justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-background shadow" />
            </button>
          </div>

          {/* Live Accuracy Indicator */}
          <div className="p-3.5 rounded-lg bg-background/50 border border-subtle/60 flex items-center justify-between gap-3">
            <div>
              <span className="text-sm font-medium text-foreground block">Live Accuracy</span>
              <span className="text-xs text-muted">Show live percentage accuracy</span>
            </div>

            <button
              type="button"
              onClick={() => updateSetting('showLiveAcc', !settings.showLiveAcc)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                settings.showLiveAcc ? 'bg-accent justify-end' : 'bg-subtle justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-background shadow" />
            </button>
          </div>

          {/* Sound toggle */}
          <div className="p-3.5 rounded-lg bg-background/50 border border-subtle/60 flex items-center justify-between gap-3">
            <div>
              <span className="text-sm font-medium text-foreground block">Keystroke Sound</span>
              <span className="text-xs text-muted">Mechanical switch click audio</span>
            </div>

            <button
              type="button"
              onClick={() => updateSetting('soundEnabled', !settings.soundEnabled)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                settings.soundEnabled ? 'bg-accent justify-end' : 'bg-subtle justify-start'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-background shadow" />
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-2 flex items-center justify-between text-xs text-muted/60 border-t border-subtle/30 font-mono">
          <span>press esc to close</span>
          <span>changes auto-saved</span>
        </div>
      </div>
    </div>
  );
}
