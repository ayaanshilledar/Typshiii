import { WordResult, TypingError, MistakeEntry } from './types';

/**
 * Analyzes word results to retrieve the fastest successfully completed words.
 */
export function getFastestWords(words: WordResult[], limit = 5): WordResult[] {
  return words
    .filter((w) => w.correct && w.durationMs > 50)
    .sort((a, b) => a.durationMs - b.durationMs)
    .slice(0, limit);
}

/**
 * Identifies words that had the most errors or backspaces.
 */
export function getMostProblematicWords(words: WordResult[], limit = 5): WordResult[] {
  return words
    .filter((w) => w.errors > 0 || !w.correct || w.backspaces > 0)
    .sort((a, b) => b.errors + b.backspaces - (a.errors + a.backspaces))
    .slice(0, limit);
}

/**
 * Aggregates common character-level keystroke mistakes (e.g., pressed 'r' instead of 'e').
 */
export function aggregateMistakes(errors: TypingError[]): MistakeEntry[] {
  const map = new Map<string, number>();

  for (const err of errors) {
    if (!err.expected || !err.typed) continue;
    const key = `${err.expected}→${err.typed}`;
    map.set(key, (map.get(key) || 0) + 1);
  }

  const entries: MistakeEntry[] = [];
  map.forEach((count, key) => {
    const [expected, typed] = key.split('→');
    entries.push({ expected, typed, count });
  });

  return entries.sort((a, b) => b.count - a.count).slice(0, 8);
}
