'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { TypingEngine } from './engine';
import { TypingState, TestMode, TypingSession } from './types';
import { saveSession } from '@/lib/storage/sessions';
import { playKeyClick, setSoundEnabled } from '@/lib/audio/sound';

export interface UseTypingEngineOptions {
  initialMode?: TestMode;
  initialLimit?: number;
  onFinish?: (session: TypingSession) => void;
}

export interface UseTypingEngineReturn {
  state: TypingState | null;
  isFocused: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  handleRestart: () => void;
  handleConfigChange: (mode: TestMode, limit: number) => void;
  handleContainerClick: () => void;
  handleInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBeforeInput: (e: React.FormEvent<HTMLInputElement>) => void;
  focusInput: () => void;
  setIsFocused: (focused: boolean) => void;
}

/**
 * Custom React hook that encapsulates the TypingEngine instance lifecycle,
 * state subscription, keyboard sound synthesis, and input event dispatching.
 */
export function useTypingEngine(options: UseTypingEngineOptions = {}): UseTypingEngineReturn {
  const { initialMode = 'time', initialLimit = 30, onFinish } = options;
  const router = useRouter();

  const engineRef = useRef<TypingEngine | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [state, setState] = useState<TypingState | null>(null);
  const [isFocused, setIsFocused] = useState(true);

  // Focus helper
  const focusInput = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      setIsFocused(true);
    }
  }, []);

  // Initialize engine & subscriptions
  useEffect(() => {
    const engine = new TypingEngine(initialMode, initialLimit);
    engineRef.current = engine;

    const unsubscribeState = engine.subscribe((newState) => {
      setState(newState);
    });

    const unsubscribeFinish = engine.onFinish((session) => {
      saveSession(session);
      if (onFinish) {
        onFinish(session);
      } else {
        setTimeout(() => {
          router.push('/results');
        }, 250);
      }
    });

    // Auto-focus on mount
    focusInput();

    // Sync sound preference
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

    return () => {
      unsubscribeState();
      unsubscribeFinish();
      engine.destroy();
    };
  }, [initialMode, initialLimit, onFinish, router, focusInput]);

  // Restart / Reset handler
  const handleRestart = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.reset();
      focusInput();
    }
  }, [focusInput]);

  // Mode and limit change handler
  const handleConfigChange = useCallback(
    (mode: TestMode, limit: number) => {
      if (engineRef.current) {
        engineRef.current.setConfig(mode, limit);
        focusInput();
      }
    },
    [focusInput]
  );

  // Click container to refocus
  const handleContainerClick = useCallback(() => {
    focusInput();
  }, [focusInput]);

  // Desktop physical keyboard handler
  const handleInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
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
  }, []);

  // Mobile virtual keyboard input change handler
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
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
  }, []);

  // Mobile beforeinput handler for backspace & text insertion
  const handleBeforeInput = useCallback((e: React.FormEvent<HTMLInputElement>) => {
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
  }, []);

  return {
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
  };
}
