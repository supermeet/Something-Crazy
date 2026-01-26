import { Router } from 'express';
import sessionRoutes from './sessions';
import trackRoutes from './tracks';

const router = Router();

// Mount routes
router.use('/sessions', sessionRoutes);
router.use('/tracks', trackRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'KartConnect API',
  });
});

export default router;
