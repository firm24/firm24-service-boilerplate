import { createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

export const SessionDecorator = createParamDecorator((data: any, req: Request) => {
  return (req as any).session;
});
