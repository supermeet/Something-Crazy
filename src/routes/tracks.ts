import { Router } from 'express';
import { verifyFirebaseToken, optionalAuth } from '../middleware/auth';
import {
  getAllTracks,
  getTrack,
  createTrack,
  getLeaderboard,
  updateTrack,
} from '../controllers/trackController';

const router = Router();

// Public routes (no auth required)
router.get('/', getAllTracks);
router.get('/:id', getTrack);
router.get('/:id/leaderboard', getLeaderboard);

// Protected routes (auth required)
router.post('/', verifyFirebaseToken, createTrack);
router.put('/:id', verifyFirebaseToken, updateTrack);

export default router;
