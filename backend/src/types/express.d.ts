
import { User as PrismaUser } from '@prisma/client';

declare module 'express-serve-static-core' {
  interface Request {
    id?: string;
    user?: {
      userId: string;
      tenantId: string;
      role: PrismaUser['role'];
    };
    tenant?: {
      id: string;
    };
  }
}
