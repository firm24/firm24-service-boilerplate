import { UserDocumentType } from './../../user/models/user.model';

export interface SessionContextInterface {
  user?: UserDocumentType;
  ip?: string;
}
