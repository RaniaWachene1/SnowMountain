import { Subscription } from './subscription.model';
import { Piste } from './piste.model';
import { Registration } from './registration.model';

export interface Skier {
  numSkier: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string; // You may use a date picker for this
  city: string;
  subscription: Subscription;
  pistes: Piste[];
  registrations: Registration[];
}
