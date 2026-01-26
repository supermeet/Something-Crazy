import { Response } from 'express';
import { AuthRequest, Session } from '../types';
import { dataStore } from '../models/dataStore';
import { calculateXP } from '../services/gamification';

/**
 * Create a new session
 * POST /api/sessions
 */
export const createSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { trackId, lapTime, vehicleType, weather } = req.body;

    // Validate required fields
    if (!trackId || !lapTime) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'trackId and lapTime are required',
      });
      return;
    }

    if (typeof lapTime !== 'number' || lapTime <= 0) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'lapTime must be a positive number',
      });
      return;
    }

    // Check if track exists
    const track = dataStore.getTrack(trackId);
    if (!track) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Track not found',
      });
      return;
    }

    // Calculate XP for this session
    const xpCalculation = calculateXP(lapTime, track.parTime);

    // Create session
    const session: Session = {
      id: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: req.user!.uid,
      trackId,
      lapTime,
      timestamp: new Date(),
      vehicleType,
      weather,
      xpEarned: xpCalculation.totalXP,
    };

    const createdSession = dataStore.createSession(session);

    // Update user's total XP
    let user = dataStore.getUser(req.user!.uid);
    if (!user) {
      // Create user if doesn't exist
      user = dataStore.createUser({
        uid: req.user!.uid,
        email: req.user!.email || '',
        name: req.user!.name || 'Unknown User',
        totalXP: 0,
        level: 1,
        createdAt: new Date(),
      });
    }

    const updatedUser = dataStore.updateUser(req.user!.uid, {
      totalXP: user.totalXP + xpCalculation.totalXP,
    });

    res.status(201).json({
      session: createdSession,
      xpEarned: xpCalculation,
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create session',
    });
  }
};

/**
 * Get all sessions for the authenticated user
 * GET /api/sessions
 */
export const getUserSessions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const sessions = dataStore.getSessionsByUser(req.user!.uid);

    res.status(200).json({
      count: sessions.length,
      sessions,
    });
  } catch (error) {
    console.error('Error fetching user sessions:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch sessions',
    });
  }
};

/**
 * Get a specific session by ID
 * GET /api/sessions/:id
 */
export const getSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const session = dataStore.getSession(id);

    if (!session) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Session not found',
      });
      return;
    }

    // Check if user owns this session
    if (session.userId !== req.user!.uid) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have permission to access this session',
      });
      return;
    }

    res.status(200).json(session);
  } catch (error) {
    console.error('Error fetching session:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch session',
    });
  }
};

/**
 * Update a session
 * PUT /api/sessions/:id
 */
export const updateSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const session = dataStore.getSession(id);

    if (!session) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Session not found',
      });
      return;
    }

    // Check if user owns this session
    if (session.userId !== req.user!.uid) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have permission to update this session',
      });
      return;
    }

    // Prevent updating critical fields
    delete updates.id;
    delete updates.userId;

    const updatedSession = dataStore.updateSession(id, updates);

    res.status(200).json(updatedSession);
  } catch (error) {
    console.error('Error updating session:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update session',
    });
  }
};

/**
 * Delete a session
 * DELETE /api/sessions/:id
 */
export const deleteSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const session = dataStore.getSession(id);

    if (!session) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Session not found',
      });
      return;
    }

    // Check if user owns this session
    if (session.userId !== req.user!.uid) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have permission to delete this session',
      });
      return;
    }

    const deleted = dataStore.deleteSession(id);

    if (deleted) {
      res.status(204).send();
    } else {
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to delete session',
      });
    }
  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete session',
    });
  }
};
