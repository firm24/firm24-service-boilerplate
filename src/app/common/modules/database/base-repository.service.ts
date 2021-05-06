import { DocumentType, ReturnModelType } from '@typegoose/typegoose';
import { ModelPopulateOptions, QueryFindOneAndUpdateOptions } from 'mongoose';

export abstract class BaseRepositoryService<T> {

  abstract get populate(): ModelPopulateOptions[];

  constructor(
    // @ts-ignore
    protected readonly model: ReturnModelType<typeof T>
  ) { }

  new(data: Partial<T>): DocumentType<T> {
    return new this.model(data).initialize();
  }

  async save(doc: DocumentType<T>): Promise<DocumentType<T>> {
    // @ts-ignore
    return (await doc.save())
      .populate(this.populate)
      .execPopulate();
  }

  async find(filter: any): Promise<DocumentType<T>> {
    const result = await this.model.findOne(filter)
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

    let result = await this.model.find(query)
      .sort(sort)
      .limit(Number(limit))
      .skip(Number(skip))
      .populate(this.populate);

    if (search && result.length === 0) {
      query = {
        $and: [
          { $text: { $search: search } },
          filter,
        ]
      };

      result = await this.model.find(query)
        .sort(sort)
        .limit(Number(limit))
        .skip(Number(skip))
        .populate(this.populate);
    }

    return result.map((item) => item.initialize());
  }

  findAllRaw(
    filter: any,
    populate?: ModelPopulateOptions[]
  ) {
    const query = this.model.find(filter);

    if (populate) {
      query.populate(populate);
    }

    return query;
  }

  async findOneAndUpdate(
    filter: any,
    update: any,
    options: QueryFindOneAndUpdateOptions = { new: true },
  ): Promise<DocumentType<T>> {
    return this.model.findOneAndUpdate(
      filter,
      update,
      options,
    ).populate(this.populate);
  }

  async count(filter: any, search?: string): Promise<number> {
    let query = {
      $and: [
        this.getSubpartsQuery(search),
        filter,
      ]
    };
    let result = await this.model.countDocuments({ ...query });
    if (search && !result) {
      query = {
        $and: [
          { $text: { $search: search } },
          filter,
        ]
      };
      result = await this.model.countDocuments({ ...query });
    }
    return result;
  }

  async exists(filter: any): Promise<boolean> {
    return this.model.exists(filter);
  }

  async delete(filter: any): Promise<boolean> {
    const result = await this.model.deleteOne(filter);
    return Boolean(result.ok);
  }

  async deleteAll(filter: any): Promise<boolean> {
    const result = await this.model.deleteMany(filter);
    return Boolean(result.ok);
  }

  async aggregate(aggregations: any[]) {
    const result = await this.model.aggregate(aggregations);

    return this.model.populate(result, this.populate);
  }

  protected getSubpartsQuery(search?: string): any {
    if (!search) {
      return {};
    }

    const query = this.buildSearchQuery(search, this.model.schema.obj);

    if (query.$or.length === 0) {
      delete query.$or;
    }

    return query;
  }

  protected buildSearchQuery(search: string, obj: object, fieldParent?: string, query = { $or: [] }) {
    for (const [name, field] of Object.entries<any>(obj)) {
      const key = fieldParent ? `${fieldParent}.${name}` : name;

      if (field.text) {
        query.$or.push({
          [key]: new RegExp(search, 'gi')
        });
      }

      if (field.type?.obj) {
        this.buildSearchQuery(search, field.type.obj, key, query);
      }
    }

    return query;
  }
}
