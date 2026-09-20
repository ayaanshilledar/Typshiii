/**
 * Pure metrics calculation functions for Typeshii
 */

/**
 * Standard Net WPM calculation:
 * (correct characters typed / 5) / (seconds / 60)
 */
export function calculateWpm(correctChars: number, seconds: number): number {
  if (seconds <= 0 || correctChars <= 0) return 0;
  const minutes = seconds / 60;
  const words = correctChars / 5;
  return Math.max(0, Math.round((words / minutes) * 10) / 10);
}

/**
 * Raw WPM calculation:
 * (all typed characters / 5) / (seconds / 60)
 */
export function calculateRawWpm(totalChars: number, seconds: number): number {
  if (seconds <= 0 || totalChars <= 0) return 0;
  const minutes = seconds / 60;
  const words = totalChars / 5;
  return Math.max(0, Math.round((words / minutes) * 10) / 10);
}

/**
 * Accuracy percentage:
 * (correct characters / total characters) * 100
 */
export function calculateAccuracy(correctChars: number, totalChars: number): number {
  if (totalChars <= 0) return 100;
  const acc = (correctChars / totalChars) * 100;
  return Math.min(100, Math.max(0, Math.round(acc * 10) / 10));
}

/**
 * Consistency calculation:
 * Based on the variance / standard deviation of per-second WPM.
 * Returns percentage (0 - 100%).
 */
export function calculateConsistency(wpmTimeline: number[]): number {
  if (wpmTimeline.length < 2) return 100;

  const validWpms = wpmTimeline.filter((w) => w > 0);
  if (validWpms.length < 2) return 100;

  const mean = validWpms.reduce((a, b) => a + b, 0) / validWpms.length;
  if (mean === 0) return 100;

  const variance =
    validWpms.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / validWpms.length;
  const stdDev = Math.sqrt(variance);

  const coefficientOfVariation = (stdDev / mean) * 100;
  const consistency = Math.max(0, Math.min(100, 100 - coefficientOfVariation));

  return Math.round(consistency * 10) / 10;
}
