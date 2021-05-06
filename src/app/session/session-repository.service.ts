import { Injectable, Inject } from '@nestjs/common';
import { MODEL_SESSION } from '../constants';
import { SessionModel, SessionDocumentType, SessionReturnModelType } from './models/session.model';
import { ModelPopulateOptions } from 'mongoose';
import { BaseRepositoryService } from '../common/modules/database/base-repository.service';

@Injectable()
export class SessionRepositoryService extends BaseRepositoryService<SessionModel>{
  constructor(
    @Inject(MODEL_SESSION)
    model: SessionReturnModelType,
  ) {
    super(model);
  }

  get populate(): ModelPopulateOptions[] {
    return [
      { path: 'user' },
      { path: 'role' },
      { path: 'organization' },
      { path: 'organization',
        populate: { path: 'members.role' }
      },
    ]
  }
}
