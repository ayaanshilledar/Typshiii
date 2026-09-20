import {
  TypingState,
  TypingStatus,
  TestMode,
  TypingError,
  MetricPoint,
  WordResult,
  TypingSession,
} from './types';
import { calculateWpm, calculateRawWpm, calculateAccuracy, calculateConsistency } from './metrics';
import { generateWords } from '../words/word-bank';
import { aggregateMistakes } from './word-analysis';

export class TypingEngine {
  private state: TypingState;
  private listeners: Set<(state: TypingState) => void> = new Set();
  private finishListeners: Set<(session: TypingSession) => void> = new Set();
  private lastSession: TypingSession | null = null;
  private timerInterval: any = null;
  private wordStartTime: number = 0;
  private currentWordErrors: number = 0;
  private currentWordBackspaces: number = 0;

  constructor(mode: TestMode = 'time', limit: number = 30) {
    this.state = this.createInitialState(mode, limit);
  }

  public getState(): TypingState {
    return { ...this.state };
  }

  public subscribe(listener: (state: TypingState) => void): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  public onFinish(listener: (session: TypingSession) => void): () => void {
    this.finishListeners.add(listener);
    return () => {
      this.finishListeners.delete(listener);
    };
  }

  private notify() {
    const currentState = this.getState();
    this.listeners.forEach((listener) => listener(currentState));
  }

  private createInitialState(mode: TestMode, limit: number): TypingState {
    const wordCount = mode === 'words' ? limit : Math.max(120, Math.ceil(limit * 4));
    const words = generateWords(wordCount);

    return {
      status: 'idle',
      mode,
      timeLimit: mode === 'time' ? limit : 30,
      wordLimit: mode === 'words' ? limit : 50,
      words,
      currentWordIndex: 0,
      currentInput: '',
      history: [],
      wordResults: [],
      startTime: null,
      elapsedTime: 0,
      correctChars: 0,
      incorrectChars: 0,
      extraChars: 0,
      backspaces: 0,
      errors: [],
      timeline: [],
    };
  }

  public setConfig(mode: TestMode, limit: number) {
    this.reset(mode, limit);
  }

  public start() {
    if (this.state.status !== 'idle') return;

    const now = Date.now();
    this.state.status = 'running';
    this.state.startTime = now;
    this.state.elapsedTime = 0;
    this.wordStartTime = now;
    this.currentWordErrors = 0;
    this.currentWordBackspaces = 0;

    this.clearInterval();
    this.timerInterval = setInterval(() => {
      this.tick();
    }, 1000);

    this.notify();
  }

  public tick() {
    if (this.state.status !== 'running' || !this.state.startTime) return;

    this.state.elapsedTime += 1;

    // Capture timeline point
    const currentWpm = calculateWpm(this.state.correctChars, this.state.elapsedTime);
    const currentRawWpm = calculateRawWpm(
      this.state.correctChars + this.state.incorrectChars + this.state.extraChars,
      this.state.elapsedTime
    );
    const currentAcc = calculateAccuracy(
      this.state.correctChars,
      this.state.correctChars + this.state.incorrectChars + this.state.extraChars
    );

    this.state.timeline.push({
      second: this.state.elapsedTime,
      wpm: currentWpm,
      rawWpm: currentRawWpm,
      accuracy: currentAcc,
      errors: this.state.errors.length,
    });

    if (this.state.mode === 'time' && this.state.elapsedTime >= this.state.timeLimit) {
      this.finish();
      return;
    }

    this.notify();
  }

  public handleKeyDown(e: KeyboardEvent): boolean {
    const { key, ctrlKey, altKey, metaKey } = e;

    // Disregard function keys and navigation shortcuts
    if (
      key === 'Tab' ||
      key === 'Escape' ||
      key === 'Enter' ||
      key.startsWith('F') ||
      key.startsWith('Arrow') ||
      key === 'CapsLock' ||
      key === 'Shift' ||
      key === 'Control' ||
      key === 'Alt' ||
      key === 'Meta'
    ) {
      return false;
    }

    // Disregard browser shortcuts (Ctrl+C, Ctrl+V, etc.), except Ctrl+Backspace
    if ((ctrlKey || altKey || metaKey) && key !== 'Backspace') {
      return false;
    }

    if (this.state.status === 'finished') {
      return false;
    }

    // Handle Backspace
    if (key === 'Backspace') {
      return this.handleBackspace(Boolean(ctrlKey || altKey));
    }

    // Handle Space (Word submission)
    if (key === ' ') {
      return this.handleSpace();
    }

    // Handle single printable characters
    if (key.length === 1) {
      return this.handleChar(key);
    }

    return false;
  }

  public handleBackspace(ctrlOrAlt: boolean = false): boolean {
    if (this.state.status === 'finished') return false;
    if (this.state.status === 'idle') this.start();

    this.state.backspaces += 1;
    this.currentWordBackspaces += 1;

    if (ctrlOrAlt) {
      this.state.currentInput = '';
    } else if (this.state.currentInput.length > 0) {
      this.state.currentInput = this.state.currentInput.slice(0, -1);
    } else if (this.state.currentWordIndex > 0) {
      const prevIndex = this.state.currentWordIndex - 1;
      const prevWordHistory = this.state.history[prevIndex];
      if (prevWordHistory) {
        this.state.currentWordIndex = prevIndex;
        this.state.currentInput = prevWordHistory.typed;
        this.state.history.pop();
        if (this.state.wordResults.length > 0) {
          this.state.wordResults.pop();
        }
      }
    }

    this.notify();
    return true;
  }

  public handleSpace(): boolean {
    if (this.state.status === 'finished') return false;
    if (this.state.status === 'idle') this.start();

    if (this.state.currentInput.length === 0) {
      return true;
    }

    const targetWord = this.state.words[this.state.currentWordIndex];
    const typedWord = this.state.currentInput;
    const isCorrect = targetWord === typedWord;

    if (isCorrect) {
      this.state.correctChars += 1;
    } else {
      this.state.incorrectChars += 1;
    }

    const now = Date.now();
    const wordDuration = Math.max(50, now - this.wordStartTime);

    this.state.wordResults.push({
      word: targetWord,
      typed: typedWord,
      correct: isCorrect,
      durationMs: wordDuration,
      errors: this.currentWordErrors,
      backspaces: this.currentWordBackspaces,
    });

    this.state.history.push({
      word: targetWord,
      typed: typedWord,
    });

    this.state.currentWordIndex += 1;
    this.state.currentInput = '';
    this.wordStartTime = now;
    this.currentWordErrors = 0;
    this.currentWordBackspaces = 0;

    if (
      this.state.mode === 'words' &&
      this.state.currentWordIndex >= this.state.wordLimit
    ) {
      this.finish();
      return true;
    }

    if (this.state.currentWordIndex + 20 >= this.state.words.length) {
      this.state.words.push(...generateWords(50));
    }

    this.notify();
    return true;
  }

  public handleChar(char: string): boolean {
    if (this.state.status === 'finished') return false;
    if (this.state.status === 'idle') this.start();

    const targetWord = this.state.words[this.state.currentWordIndex];
    const charIndex = this.state.currentInput.length;
    const expectedChar = charIndex < targetWord.length ? targetWord[charIndex] : '';

    this.state.currentInput += char;

    if (charIndex < targetWord.length) {
      if (char === expectedChar) {
        this.state.correctChars += 1;
      } else {
        this.state.incorrectChars += 1;
        this.currentWordErrors += 1;
        this.state.errors.push({
          index: charIndex,
          expected: expectedChar,
          typed: char,
          timestamp: Date.now(),
        });
      }
    } else {
      this.state.extraChars += 1;
      this.currentWordErrors += 1;
      this.state.errors.push({
        index: charIndex,
        expected: ' ',
        typed: char,
        timestamp: Date.now(),
      });
    }

    if (
      this.state.mode === 'words' &&
      this.state.currentWordIndex === this.state.wordLimit - 1 &&
      this.state.currentInput.length === targetWord.length
    ) {
      const isCorrect = targetWord === this.state.currentInput;
      this.state.wordResults.push({
        word: targetWord,
        typed: this.state.currentInput,
        correct: isCorrect,
        durationMs: Math.max(50, Date.now() - this.wordStartTime),
        errors: this.currentWordErrors,
        backspaces: this.currentWordBackspaces,
      });
      this.finish();
      return true;
    }

    this.notify();
    return true;
  }

    return false;
  }

  public finish(): TypingSession {
    if (this.state.status === 'finished' && this.lastSession) {
      return this.lastSession;
    }

    this.clearInterval();
    this.state.status = 'finished';

    // Wrap up current word if unfinished
    if (this.state.currentInput.length > 0) {
      const targetWord = this.state.words[this.state.currentWordIndex];
      const typedWord = this.state.currentInput;
      this.state.wordResults.push({
        word: targetWord,
        typed: typedWord,
        correct: targetWord === typedWord,
        durationMs: Math.max(50, Date.now() - this.wordStartTime),
        errors: this.currentWordErrors,
        backspaces: this.currentWordBackspaces,
      });
    }

    const duration = Math.max(1, this.state.elapsedTime);
    const totalTyped =
      this.state.correctChars + this.state.incorrectChars + this.state.extraChars;

    const wpm = calculateWpm(this.state.correctChars, duration);
    const rawWpm = calculateRawWpm(totalTyped, duration);
    const accuracy = calculateAccuracy(this.state.correctChars, totalTyped);
    const consistency = calculateConsistency(this.state.timeline.map((p) => p.wpm));

    // Ensure final timeline point exists
    if (
      this.state.timeline.length === 0 ||
      this.state.timeline[this.state.timeline.length - 1].second !== duration
    ) {
      this.state.timeline.push({
        second: duration,
        wpm,
        rawWpm,
        accuracy,
        errors: this.state.errors.length,
      });
    }

    const session: TypingSession = {
      id: 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      date: new Date().toISOString(),
      mode: `${this.state.mode} ${this.state.mode === 'time' ? this.state.timeLimit + 's' : this.state.wordLimit}`,
      duration,
      wpm,
      rawWpm,
      accuracy,
      consistency,
      errors: this.state.errors.length,
      backspaces: this.state.backspaces,
      characters: {
        correct: this.state.correctChars,
        incorrect: this.state.incorrectChars,
        extra: this.state.extraChars,
        total: totalTyped,
      },
      timeline: this.state.timeline,
      words: this.state.wordResults,
      commonMistakes: aggregateMistakes(this.state.errors),
    };

    this.lastSession = session;
    this.notify();
    this.finishListeners.forEach((listener) => listener(session));
    return session;
  }

  public reset(mode?: TestMode, limit?: number) {
    this.clearInterval();
    this.lastSession = null;
    const targetMode = mode || this.state.mode;
    const targetLimit =
      limit !== undefined
        ? limit
        : targetMode === 'time'
        ? this.state.timeLimit
        : this.state.wordLimit;

    this.state = this.createInitialState(targetMode, targetLimit);
    this.wordStartTime = 0;
    this.currentWordErrors = 0;
    this.currentWordBackspaces = 0;
    this.notify();
  }

  private clearInterval() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  public destroy() {
    this.clearInterval();
    this.listeners.clear();
    this.finishListeners.clear();
  }
}
