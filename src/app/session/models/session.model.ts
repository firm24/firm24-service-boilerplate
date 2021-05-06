import { UserDocumentType, UserModel } from './../../user/models/user.model';
import { prop, DocumentType, ReturnModelType, Ref } from '@typegoose/typegoose';
import nanoid from 'nanoid';

export type SessionDocumentType = DocumentType<SessionModel>;
export type SessionReturnModelType = ReturnModelType<typeof SessionModel>;

export class SessionModel {
  @prop({ default: nanoid })
  readonly _id: string;

  @prop({ required: true, ref: UserModel })
  readonly user: Ref<UserModel>;

  @prop({ required: false })
  readonly ip?: string;

  @prop({ required: true, default: Date.now, expires: '24h' })
  readonly created: Date;

  initialize(this: Mod.Writeable<SessionDocumentType>): SessionDocumentType {
    return this;
  }

  is(session: SessionDocumentType | string): boolean {
    return session &&
      (session as string) === ((String)(this._id)) ||
      (session as SessionDocumentType)._id === this._id;
  }

  setValues(this: Mod.Writeable<SessionModel>, session: Partial<SessionDocumentType>) {
    const data = Object.assign({}, session) as Mod.Writeable<SessionModel>;
    Object.assign(this, data);
  }

  compact(this: SessionDocumentType) {
    return {
      id: this._id,
      user: (this.user as UserDocumentType)?.compact?.(),
      ip: this.ip,
      created: this.created,
    };
  }

  toJSON() {
    const data = Object.assign({}, (this as any)._doc) as Mod.Writeable<SessionDocumentType>;

    data.id = data._id;
    delete data._id;

    return data;
  }
}
