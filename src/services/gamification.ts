import { XPCalculation } from '../types';

/**
 * Calculate XP based on lap time performance vs track par time
 * 
 * @param lapTime - User's lap time in seconds
 * @param trackParTime - Track's par/benchmark time in seconds
 * @returns XPCalculation object with breakdown
 */
export const calculateXP = (lapTime: number, trackParTime: number): XPCalculation => {
  // Base XP for completing a lap
  const baseXP = 100;

  // Calculate performance ratio
  const performanceRatio = trackParTime / lapTime;

  let performanceBonus = 0;

  if (performanceRatio >= 1.2) {
    // Exceptional performance (20% faster than par time)
    performanceBonus = 500;
  } else if (performanceRatio >= 1.1) {
    // Excellent performance (10-20% faster than par time)
    performanceBonus = 300;
  } else if (performanceRatio >= 1.05) {
    // Great performance (5-10% faster than par time)
    performanceBonus = 200;
  } else if (performanceRatio >= 1.0) {
    // Good performance (meeting or beating par time)
    performanceBonus = 100;
  } else if (performanceRatio >= 0.95) {
    // Decent performance (within 5% of par time)
    performanceBonus = 50;
  } else if (performanceRatio >= 0.9) {
    // Average performance (within 10% of par time)
    performanceBonus = 25;
  }
  // Below 90% of par time gets no bonus

  const totalXP = baseXP + performanceBonus;

  return {
    baseXP,
    performanceBonus,
    totalXP,
  };
};

/**
 * Calculate user level based on total XP
 * Uses a progressive level system where each level requires more XP
 * 
 * @param totalXP - User's total XP
 * @returns Current level
 */
export const calculateLevel = (totalXP: number): number => {
  // Level formula: sqrt(totalXP / 100)
  // Level 1: 100 XP
  // Level 2: 400 XP
  // Level 3: 900 XP
  // Level 4: 1600 XP
  // etc.
  return Math.floor(Math.sqrt(totalXP / 100)) + 1;
};

/**
 * Calculate XP required for next level
 * 
 * @param currentLevel - Current user level
 * @returns XP required to reach next level
 */
export const getXPForNextLevel = (currentLevel: number): number => {
  const nextLevel = currentLevel + 1;
  return Math.pow(nextLevel - 1, 2) * 100;
};

/**
 * Get performance category based on lap time vs par time
 * 
 * @param lapTime - User's lap time in seconds
 * @param trackParTime - Track's par/benchmark time in seconds
 * @returns Performance category string
 */
export const getPerformanceCategory = (lapTime: number, trackParTime: number): string => {
  const performanceRatio = trackParTime / lapTime;

  if (performanceRatio >= 1.2) return 'Exceptional';
  if (performanceRatio >= 1.1) return 'Excellent';
  if (performanceRatio >= 1.05) return 'Great';
  if (performanceRatio >= 1.0) return 'Good';
  if (performanceRatio >= 0.95) return 'Decent';
  if (performanceRatio >= 0.9) return 'Average';
  return 'Below Average';
};
