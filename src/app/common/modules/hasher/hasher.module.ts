import { Module } from '@nestjs/common';
import { hasherProviders } from './hasher.providers';
import { HasherService } from './hasher.service';

export const HasherModuleConfig = {
  imports: [],
  controllers: [],
  providers: [
    ...hasherProviders,
    HasherService,
  ],
  exports: [
    ...hasherProviders,
    HasherService,
  ],
};

@Module(HasherModuleConfig)
export class HasherModule { }
