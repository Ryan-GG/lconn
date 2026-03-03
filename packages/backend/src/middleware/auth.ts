import { Request, Response, NextFunction } from 'express';
import { auth } from '../config/auth';
import { fromNodeHeaders } from 'better-auth/node';

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    (req as any).user = session.user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ success: false, error: 'Authentication required' });
  }
};

export const optionalAuth = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (session) {
      (req as any).user = session.user;
    }
  } catch {
    // Continue without auth
  }
  next();
};
