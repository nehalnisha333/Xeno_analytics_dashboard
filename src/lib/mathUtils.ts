/**
 * Utility functions for safe mathematical operations
 * Prevents NaN, Infinity, and handles edge cases
 */

/**
 * Safe division that returns 0 if divisor is 0, undefined, or NaN
 */
export function safeDivide(numerator: number, denominator: number, defaultValue: number = 0): number {
  if (!denominator || denominator === 0 || isNaN(denominator) || isNaN(numerator)) {
    return defaultValue;
  }
  const result = numerator / denominator;
  return isFinite(result) ? result : defaultValue;
}

/**
 * Safe percentage calculation
 */
export function safePercentage(part: number, whole: number, defaultValue: number = 0): number {
  return safeDivide(part, whole, defaultValue / 100) * 100;
}

/**
 * Ensure a number is valid, otherwise return default
 */
export function safeNumber(value: number, defaultValue: number = 0): number {
  if (value === undefined || value === null || isNaN(value) || !isFinite(value)) {
    return defaultValue;
  }
  return value;
}

/**
 * Format number safely for display
 */
export function formatNumber(value: number, decimals: number = 2): string {
  const safe = safeNumber(value, 0);
  return safe.toFixed(decimals);
}

/**
 * Convert to millions with safe handling
 */
export function toMillions(value: number, decimals: number = 2): number {
  return safeNumber(value / 1000000, 0);
}

/**
 * Convert to thousands with safe handling
 */
export function toThousands(value: number, decimals: number = 0): number {
  return safeNumber(value / 1000, 0);
}
