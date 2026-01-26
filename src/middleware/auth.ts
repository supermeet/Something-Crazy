import { Response, NextFunction } from 'express';
import { admin } from '../config/firebase';
import { AuthRequest } from '../types';

/**
 * Middleware to verify Firebase ID tokens
 * Extracts the token from Authorization header and verifies it
 */
export const verifyFirebaseToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'No token provided. Please provide a Bearer token in Authorization header.',
      });
      return;
    }

    const idToken = authHeader.split('Bearer ')[1];

    if (!idToken) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid token format.',
      });
      return;
    }

    // Verify the ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // Attach user information to request object
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name,
    };

    next();
  } catch (error) {
    console.error('Error verifying Firebase token:', error);
    
    if (error instanceof Error) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired token.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      });
    } else {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Token verification failed.',
      });
    }
  }
};

/**
 * Optional auth middleware - allows requests to proceed without token
 * but attaches user info if valid token is provided
 */
export const optionalAuth = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      next();
      return;
    }

    const idToken = authHeader.split('Bearer ')[1];

    if (idToken) {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
        name: decodedToken.name,
      };
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};
