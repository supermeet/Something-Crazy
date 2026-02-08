import { Request, Response } from 'express';
import { AuthRequest, Track } from '../types';
import { dataStore } from '../models/dataStore';

/**
 * Get all tracks
 * GET /api/tracks
 */
export const getAllTracks = async (_req: Request, res: Response): Promise<void> => {
  try {
    const tracks = dataStore.getAllTracks();

    res.status(200).json({
      count: tracks.length,
      tracks,
    });
  } catch (error) {
    console.error('Error fetching tracks:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch tracks',
    });
  }
};

/**
 * Get a specific track by ID
 * GET /api/tracks/:id
 */
export const getTrack = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const track = dataStore.getTrack(id);

    if (!track) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Track not found',
      });
      return;
    }

    res.status(200).json(track);
  } catch (error) {
    console.error('Error fetching track:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch track',
    });
  }
};

/**
 * Create a new track (admin only)
 * POST /api/tracks
 */
export const createTrack = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, location, parTime, length, difficulty } = req.body;

    // Validate required fields
    if (!name || !location || !parTime || !length || !difficulty) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'All fields (name, location, parTime, length, difficulty) are required',
      });
      return;
    }

    // Validate difficulty
    if (!['easy', 'medium', 'hard'].includes(difficulty)) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Difficulty must be one of: easy, medium, hard',
      });
      return;
    }

    const track: Track = {
      id: `track-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      name,
      location,
      parTime,
      length,
      difficulty,
    };

    const createdTrack = dataStore.createTrack(track);

    res.status(201).json(createdTrack);
  } catch (error) {
    console.error('Error creating track:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create track',
    });
  }
};

/**
 * Get leaderboard for a specific track
 * Returns top 100 unique users by fastest time
 * GET /api/tracks/:id/leaderboard
 */
export const getLeaderboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;

    // Validate limit
    if (limit < 1 || limit > 100) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Limit must be between 1 and 100',
      });
      return;
    }

    // Check if track exists
    const track = dataStore.getTrack(id);
    if (!track) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Track not found',
      });
      return;
    }

    // Get leaderboard
    const leaderboard = dataStore.getLeaderboard(id, limit);

    res.status(200).json({
      trackId: id,
      trackName: track.name,
      parTime: track.parTime,
      count: leaderboard.length,
      leaderboard: leaderboard.map((entry, index) => ({
        rank: index + 1,
        ...entry,
      })),
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch leaderboard',
    });
  }
};

/**
 * Update a track (admin only)
 * PUT /api/tracks/:id
 */
export const updateTrack = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const track = dataStore.getTrack(id);

    if (!track) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Track not found',
      });
      return;
    }

    // Prevent updating ID
    delete updates.id;

    // Validate difficulty if provided
    if (updates.difficulty && !['easy', 'medium', 'hard'].includes(updates.difficulty)) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Difficulty must be one of: easy, medium, hard',
      });
      return;
    }

    const updatedTrack = dataStore.updateTrack(id, updates);

    res.status(200).json(updatedTrack);
  } catch (error) {
    console.error('Error updating track:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update track',
    });
  }
};
