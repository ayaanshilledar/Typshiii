export type TestMode = 'time' | 'words';

export type TypingStatus = 'idle' | 'running' | 'finished';

export type MetricPoint = {
  second: number;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  errors: number;
};

export type TypingError = {
  index: number;
  expected: string;
  typed: string;
  timestamp: number;
};

export type WordResult = {
  word: string;
  typed: string;
  correct: boolean;
  durationMs: number;
  errors: number;
  backspaces: number;
};

export type MistakeEntry = {
  expected: string;
  typed: string;
  count: number;
};

export type TypingState = {
  status: TypingStatus;
  mode: TestMode;
  timeLimit: number; // in seconds (15, 30, 60, 120)
  wordLimit: number; // in words (10, 25, 50, 100)
  words: string[];
  currentWordIndex: number;
  currentInput: string;
  history: { word: string; typed: string }[];
  wordResults: WordResult[];
  startTime: number | null;
  elapsedTime: number; // in seconds
  correctChars: number;
  incorrectChars: number;
  extraChars: number;
  backspaces: number;
  errors: TypingError[];
  timeline: MetricPoint[];
};

export type TypingSession = {
  id: string;
  date: string;
  mode: string;
  duration: number; // seconds
  wpm: number;
  rawWpm: number;
  accuracy: number;
  consistency: number;
  errors: number;
  backspaces: number;
  characters: {
    correct: number;
    incorrect: number;
    extra: number;
    total: number;
  };
  timeline: MetricPoint[];
  words: WordResult[];
  commonMistakes: MistakeEntry[];
};
