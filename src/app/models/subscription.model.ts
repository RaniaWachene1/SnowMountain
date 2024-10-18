import { TypeSubscription } from './type-subscription.enum';

export interface Subscription {
  numSub: number;
  startDate: string; // Format appropriately
  endDate: string;
  price: number;
  typeSub: TypeSubscription;
}
