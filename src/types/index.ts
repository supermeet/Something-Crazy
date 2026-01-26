import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    uid: string;
    email?: string;
    name?: string;
  };
}

export interface Session {
  id: string;
  userId: string;
  trackId: string;
  lapTime: number; // in seconds
  timestamp: Date;
  vehicleType?: string;
  weather?: string;
  xpEarned?: number;
}

export interface Track {
  id: string;
  name: string;
  location: string;
  parTime: number; // in seconds - benchmark time for the track
  length: number; // in meters
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface User {
  uid: string;
  email: string;
  name: string;
  totalXP: number;
  level: number;
  createdAt: Date;
}

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  fastestTime: number;
  trackId: string;
  sessionId: string;
  timestamp: Date;
}

export interface XPCalculation {
  baseXP: number;
  performanceBonus: number;
  totalXP: number;
}
