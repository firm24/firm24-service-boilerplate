import { prop } from '@typegoose/typegoose';

export class AddressModel {

  @prop()
  readonly street?: string;

  @prop()
  readonly postal_code?: string;

  @prop()
  readonly number?: string;

  @prop()
  readonly addition?: string;

  @prop()
  readonly city?: string;

  @prop()
  readonly province?: string;

  @prop()
  readonly country?: string;
}
