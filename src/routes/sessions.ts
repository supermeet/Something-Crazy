import { Router } from 'express';
import { verifyFirebaseToken } from '../middleware/auth';
import {
  createSession,
  getUserSessions,
  getSession,
  updateSession,
  deleteSession,
} from '../controllers/sessionController';

const router = Router();

// All session routes require authentication
router.use(verifyFirebaseToken);

// Session routes
router.post('/', createSession);
router.get('/', getUserSessions);
router.get('/:id', getSession);
router.put('/:id', updateSession);
router.delete('/:id', deleteSession);

export default router;
