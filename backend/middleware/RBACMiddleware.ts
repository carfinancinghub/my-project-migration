import { Request, Response, NextFunction } from 'express';
import { User } from '@models/User';

interface AuthenticatedRequest extends Request {
  user?: User;
}

export const checkRoles = (roles: string[]) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      if (!user || !user.roles.some(role => roles.includes(role))) {
        return res.status(403).send('Forbidden');
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
