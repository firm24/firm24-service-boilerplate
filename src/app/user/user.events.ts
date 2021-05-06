import { UserDocumentType } from './models/user.model';

export interface UserEventsReturnType {
  UserAdded: { user: UserDocumentType };
  UserUpdated: { user: UserDocumentType };
}

export const UserEvents: { [P in keyof UserEventsReturnType]: P } = {
  UserAdded: 'UserAdded',
  UserUpdated: 'UserUpdated',
};
