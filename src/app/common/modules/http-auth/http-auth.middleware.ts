import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { HttpAuthService } from './http-auth.service';

@Injectable()
export class HttpAuthMiddleware implements NestMiddleware {
  constructor(private readonly httpAuth: HttpAuthService) { }

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.header('authorization');

    if (token) {
      (req as any).authorization = this.httpAuth.validate(token);
    }

    next();
  }
}
