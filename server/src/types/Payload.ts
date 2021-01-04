export interface Payload {
  email: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
  isSuperUser: boolean;
  isProfileAdded: boolean;
  vaccinationDate?: string;
}
