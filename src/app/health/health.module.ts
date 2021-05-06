import { Module } from '@nestjs/common';
import { healthProviders } from './health.providers';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule],
  controllers: [HealthController],
  providers: [
    HealthService,
    ...healthProviders,
  ],
  exports: [
    HealthService,
    ...healthProviders,
  ],
})
export class HealthModule { }
