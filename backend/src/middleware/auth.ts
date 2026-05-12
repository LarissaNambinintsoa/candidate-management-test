import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  // Mode développement - Désactiver l'authentification
  if (process.env.NODE_ENV === 'development') {
    req.user = { id: 'dev-user', role: 'admin' };
    return next();
  }
  
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const generateTestToken = () => {
  return jwt.sign({ id: 'test-user', role: 'admin' }, process.env.JWT_SECRET!);
};