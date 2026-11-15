import type { Request } from 'express';
import type { Role } from '../../generated/prisma/enums.js';

export interface JwtPayload {
  sub: number;
  role: Role;
}

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}
