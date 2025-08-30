import { Event } from './event';

export type Account = {
  id: string;
  balance: number;
  events: Event[];
};
