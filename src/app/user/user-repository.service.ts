import { LoggerService } from './../common/modules/logger/logger.service';
import { ConfigService } from './../common/modules/config/config.service';
import { UserReturnModelType, UserModel } from './models/user.model';
import { Injectable, Inject } from '@nestjs/common';
import { MODEL_USER } from '../constants';
import { ModelPopulateOptions } from 'mongoose';
import { BaseRepositoryService } from '../common/modules/database/base-repository.service';

@Injectable()
export class UserRepositoryService extends BaseRepositoryService<UserModel> {
  constructor(
    private readonly config: ConfigService,
    private readonly logger: LoggerService,
    @Inject(MODEL_USER)
    model: UserReturnModelType,
  ) {
    super(model);
  }

  get populate(): ModelPopulateOptions[] {
    return [];
  }

  findAllRaw(
    filter: any
  ): any {
    return this.model.find(filter);
  }
}
