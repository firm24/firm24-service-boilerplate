import { prop, DocumentType, ReturnModelType } from '@typegoose/typegoose';
import { UserRoleEnum } from '../enums/role.enum';
import { AddressModel } from '../../common/modules/address/models/address.model';
import { GenderEnum } from '../../common/modules/gender/enums/gender.enum';
import { Locale } from 'locale-enum';

export type UserDocumentType = DocumentType<UserModel>;
export type UserReturnModelType = ReturnModelType<typeof UserModel>;

export class UserModel {
  @prop({ default: '' })
  readonly first_name: string;

  @prop({ default: '' })
  readonly last_name: string;

  @prop({ default: '' })
  readonly display_name: string;

  @prop()
  readonly gender?: GenderEnum;

  @prop({ lowercase: true })
  readonly email?: string;

  @prop()
  readonly password?: string;

  @prop()
  readonly phone?: string;

  @prop({ required: true, default: [UserRoleEnum.User], type: String })
  readonly roles: UserRoleEnum[];

  @prop({ default: 0 })
  readonly login_attempts: number;

  @prop({ _id: false })
  readonly address?: AddressModel;

  @prop()
  readonly locale?: Locale;

  @prop()
  readonly birth_date?: Date;

  @prop()
  readonly birth_country?: string;

  @prop()
  readonly bsn?: string;

  @prop({ required: true, default: Date.now })
  readonly created: Date;

  initialize(this: Mod.Writeable<UserDocumentType>): UserDocumentType {
    return this;
  }

  is(user: UserDocumentType | string): boolean {
    const current = (String)((this as any)._id);
    return user && (current === user as string ||
      current === (String)((user as UserDocumentType)._id));
  }

  isInstanceOf(c: { new() }) {
    return c.name === UserModel.name;
  }

  getName() {
    return `${this.first_name} ${this.last_name}`;
  }

  setPassword(this: Mod.Writeable<UserModel>, password: string) {
    this.password = password;
  }

  attemptLogin(this: Mod.Writeable<UserModel>): boolean {
    return ++this.login_attempts > 3;
  }

  clearLoginAttempts(this: Mod.Writeable<UserModel>): void {
    this.login_attempts = 0;
  }

  addRoles(this: Mod.Writeable<UserModel>, roles: UserRoleEnum[]) {
    this.roles = Array.from(new Set([...this.roles, ...roles]));
  }

  hasRoles(roles: UserRoleEnum[]) {
    return roles.find((role) => this.roles.includes(role));
  }

  setValues(this: Mod.Writeable<UserModel>, user: Partial<UserModel>) {
    const data = Object.assign({}, user) as Mod.Writeable<UserModel>;

    delete data.password;

    Object.assign(this, data);
  }

  compact(this: UserDocumentType) {
    return {
      id: this._id,
      email: this.email,
      first_name: this.first_name,
      last_name: this.last_name,
      phone: this.phone,
      locale: this.locale,
    };
  }

  toJSON() {
    const data = Object.assign({}, (this as any)._doc) as Mod.Writeable<UserDocumentType>;

    data.id = data._id;
    delete data._id;
    delete data.password;
    delete data.login_attempts;

    return data;
  }

  toData() {
    const data = Object.assign({}, (this as any)._doc) as Mod.Writeable<UserDocumentType>;

    return {
      _id: data._id,
      email: data.email,
      first_name: this.first_name,
      last_name: this.last_name,
      display_name: this.display_name,
      phone: this.phone,
      locale: data.locale,
    }
  }
}
