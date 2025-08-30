export type Event = {
  id: string;
  account_id: string;
  account_role: 'destination' | 'origin';
  type: EventType;
  amout: number;
  created_at: Date;
};

export type EventType = 'withdraw' | 'deposit' | 'transfer';
