import { AddUserPayload } from './api/add-user.api';
import { UserRepositoryService } from './user-repository.service';
import { EmitterService } from './../common/modules/emitter/emitter.service';
import { LoggerService } from './../common/modules/logger/logger.service';
import { ConfigService } from './../common/modules/config/config.service';
import { Injectable } from '@nestjs/common';
import { UserEvents, UserEventsReturnType } from './user.events';
import { UserDocumentType } from './models/user.model';
import { ObjectId } from 'bson';
import { HasherService } from '../common/modules/hasher/hasher.service';

@Injectable()
export class UserService {
  constructor(
    private readonly config: ConfigService,
    private readonly logger: LoggerService,
    private readonly hasher: HasherService,
    private readonly emitter: EmitterService<UserEventsReturnType>,
    private readonly userRepository: UserRepositoryService,
  ) { }

  async getUsers(
    filter: {},
    options: {
      sort?: string,
      limit?: number | string,
      skip?: number | string,
      search?: string,
    } = {},
  ): Promise<{ result: UserDocumentType[], total: number }> {
    const result = await this.userRepository
      .findAll(filter, options.sort, options.limit, options.skip, options.search);
    const total = await this.userRepository.count(filter, options.search);

    return { result, total };
  }

  getUsersCursor(
    filter: any,
  ) {
    return this.userRepository.findAllRaw(filter).cursor();
  }

  async saveUser(user: UserDocumentType): Promise<UserDocumentType> {
    return await this.userRepository.save(user);
  }

  getUserById(id: string): Promise<UserDocumentType | null> {
    return this.userRepository.find({ _id: id });
  }

  getUserByEmail(email: string): Promise<UserDocumentType | null> {
    return this.userRepository.find({ email });
  }

  getUserByIdOrEmail(id: string): Promise<UserDocumentType | null> {
    if (ObjectId.isValid(id) && id.length === 24) {
      return this.getUserById(id);
    }

    return this.getUserByEmail(id);
  }

  async addUser(
    data: AddUserPayload | Partial<UserDocumentType>,
  ): Promise<UserDocumentType> {
    const user = await this.userRepository.new(data);
    await this.setPassword(user, data.password);

    const saved = await this.userRepository.save(user);

    this.emitter.emit(UserEvents.UserAdded, {
      user: saved,
    });

    return saved;
  }

  async setPassword(user: UserDocumentType, password: string) {
    if (password) {
      user.setPassword(await this.hasher.hash(password));
    }
  }

  async verifyPassword(user: UserDocumentType, password: string): Promise<boolean> {
    return this.hasher.verify(password, user.password);
  }
}
