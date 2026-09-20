import { TypingSession } from '../typing/types';

const STORAGE_KEY = 'typeshii_sessions_v1';
const LATEST_SESSION_KEY = 'typeshii_latest_session_v1';
const LEGACY_STORAGE_KEY = 'monkeytyping_sessions_v1';
const LEGACY_LATEST_KEY = 'monkeytyping_latest_session_v1';

export type UserStats = {
  totalTests: number;
  bestWpm: number;
  averageWpm: number;
  averageAccuracy: number;
  totalTimeSeconds: number;
};

/**
 * Saves a completed session to localStorage.
 */
export function saveSession(session: TypingSession): void {
  if (typeof window === 'undefined') return;

  try {
    const existing = getSavedSessions();
    const updated = [session, ...existing];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    localStorage.setItem(LATEST_SESSION_KEY, JSON.stringify(session));
  } catch (error) {
    console.error('Failed to save session to localStorage:', error);
  }
}

/**
 * Retrieves all saved sessions from localStorage.
 */
export function getSavedSessions(): TypingSession[] {
  if (typeof window === 'undefined') return [];

  try {
    const data =
      localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to load sessions from localStorage:', error);
    return [];
  }
}

/**
 * Retrieves the most recently completed session.
 */
export function getLatestSession(): TypingSession | null {
  if (typeof window === 'undefined') return null;

  try {
    const data =
      localStorage.getItem(LATEST_SESSION_KEY) || localStorage.getItem(LEGACY_LATEST_KEY);
    if (data) return JSON.parse(data);

    const sessions = getSavedSessions();
    return sessions.length > 0 ? sessions[0] : null;
  } catch (error) {
    console.error('Failed to get latest session:', error);
    return null;
  }
}

/**
 * Computes all-time summary statistics from saved sessions.
 */
export function calculateOverallStats(sessions: TypingSession[]): UserStats {
  if (!sessions || sessions.length === 0) {
    return {
      totalTests: 0,
      bestWpm: 0,
      averageWpm: 0,
      averageAccuracy: 0,
      totalTimeSeconds: 0,
    };
  }

  let totalWpm = 0;
  let totalAcc = 0;
  let bestWpm = 0;
  let totalTime = 0;

  for (const s of sessions) {
    totalWpm += s.wpm;
    totalAcc += s.accuracy;
    if (s.wpm > bestWpm) bestWpm = s.wpm;
    totalTime += s.duration;
  }

  const count = sessions.length;
  return {
    totalTests: count,
    bestWpm: Math.round(bestWpm * 10) / 10,
    averageWpm: Math.round((totalWpm / count) * 10) / 10,
    averageAccuracy: Math.round((totalAcc / count) * 10) / 10,
    totalTimeSeconds: totalTime,
  };
}

/**
 * Clears all saved test history.
 */
export function clearHistory(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LATEST_SESSION_KEY);
    localStorage.removeItem(LEGACY_STORAGE_KEY);
    localStorage.removeItem(LEGACY_LATEST_KEY);
  } catch (error) {
    console.error('Failed to clear session history:', error);
  }
}
