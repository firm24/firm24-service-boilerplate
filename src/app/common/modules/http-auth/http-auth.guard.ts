import { HttpAuthResultInterface } from './interfaces/auth-result.interface';
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class HttpAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request;
    const result = (request as any).authorization as HttpAuthResultInterface;

    if (!result || !result.authorized) {
      throw new UnauthorizedException('not authenticated');
    }

    return true;
  }
}
