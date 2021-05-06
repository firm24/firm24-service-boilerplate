import { DocumentType, ReturnModelType } from '@typegoose/typegoose';
import { BaseRepositoryService } from './base-repository.service';

export abstract class BaseSoftDeleteRepositoryService<T> extends BaseRepositoryService<T> {
  constructor(
    // @ts-ignore
    model: ReturnModelType<typeof T>
  ) {
    super(model);
  }

  get filter(): object {
    return { _deleted: { $ne: true } };
  }

  async find(filter: any): Promise<DocumentType<T>> {
    const result = await this.model.findOne({ ...this.filter, ...filter })
      .populate(this.populate);

    return result && result.initialize();
  }

  async findAll(
    filter: any,
    sort: any = '-created',
    limit: number | string = 25,
    skip: number | string = 0,
    search?: string,
  ): Promise<DocumentType<T>[]> {
    let query = filter;
    if (search) {
      query = {
        $and: [
          this.getSubpartsQuery(search),
          filter,
        ]
      };
    }

    let result = await this.model.find({ ...this.filter, ...query })
      .sort(sort)
      .limit(Number(limit))
      .skip(Number(skip))
      .populate(this.populate);

    if (search && result.length === 0) {
      query = {
        $and: [
          { $text :{ $search: search }},
          filter,
        ]
      };

      result = await this.model.find({ ...this.filter, ...query })
        .sort(sort)
        .limit(Number(limit))
        .skip(Number(skip))
        .populate(this.populate);
    }

    return result.map((item) => item.initialize());
  }

  async count(filter: any, search?: string): Promise<number> {
    if (search) {
      filter.$text = { $search: search };
    }

    return await this.model.countDocuments({ ...this.filter, ...filter });
  }

  async exists(filter: any): Promise<boolean> {
    return this.model.exists({ ...this.filter, ...filter });
  }

  async softdelete(filter: any): Promise<DocumentType<T>> {
    const result = await this.model.findOneAndUpdate(filter, { _deleted: true }, { new: true })
      .populate(this.populate);

    return result && result.initialize();
  }

  async restore(filter: any): Promise<DocumentType<T>> {
    const result = await this.model.findOneAndUpdate(filter, { _deleted: false }, { new: true })
      .populate(this.populate);

    return result && result.initialize();
  }
}
