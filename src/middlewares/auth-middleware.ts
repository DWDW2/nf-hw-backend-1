import { NextFunction, Request, Response } from 'express';
import AuthService from '../auth/auth-service';

const authService = new AuthService();

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.cookies.accessToken;
  console.log(authHeader);
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }


  const payload = authService.verifyJwt(authHeader);

  if (!payload) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  (req as any).user = payload;
  next();
};
