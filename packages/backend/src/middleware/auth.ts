import { Request, Response, NextFunction } from 'express';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ success: false, error: 'Authentication required' });
};

export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  // Continue regardless of authentication status
  next();
};
