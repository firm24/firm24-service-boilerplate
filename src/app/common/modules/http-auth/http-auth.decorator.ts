import { createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

export const HttpAuthDecorator = createParamDecorator((data: any, req: Request) => {
  return (req as any).authorization;
});
