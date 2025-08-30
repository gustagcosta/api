import { randomUUID } from 'node:crypto';
import { AppContainer } from '../container';
import { Event, EventType } from '../entities/event';
import { IAccountRepository } from '../repositories/account.repository';
import { ApplicationError, ErrorTypes } from '../shared/error';

export type ProcessEventInput = {
  type: EventType;
  amount: number;
  origin?: string;
  destination?: string;
};

export type ProcessEventOutput = {
  origin?: {
    id: string;
    balance: number;
  };
  destination?: {
    id: string;
    balance: number;
  };
};

export class ProcessEventUseCase {
  private accountRepository: IAccountRepository;

  constructor(params: AppContainer) {
    this.accountRepository = params.accountRepository;
  }

  public execute(input: ProcessEventInput): ProcessEventOutput {
    if (input.amount <= 0) {
      throw new Error('amount must be higher than 0');
    }

    switch (input.type) {
      case 'deposit':
        return this.deposit(input);
      case 'withdraw':
        return this.withdraw(input);
      case 'transfer':
        return this.transfer(input);
      default:
        throw new Error('invalid event type');
    }
  }

  private deposit(input: ProcessEventInput, eventId?: string): ProcessEventOutput {
    if (!input.destination) {
      throw new Error('deposit without destination');
    }

    const account = this.accountRepository.findOrCreateAccount(input.destination);

    account.balance = account.balance + input.amount;

    const event: Event = {
      id: randomUUID() || eventId,
      account_id: account.id,
      account_role: 'destination',
      amout: input.amount,
      type: input.type,
      created_at: new Date()
    };

    account.events.push(event);

    this.accountRepository.saveAccount(account);

    return { destination: { id: input.destination, balance: account.balance } };
  }

  private withdraw(input: ProcessEventInput, eventId?: string) {
    if (!input.origin) {
      throw new Error('withdraw without origin');
    }

    const account = this.accountRepository.findAccount(input.origin);

    if (!account) {
      throw new ApplicationError('account not found', ErrorTypes.NotFoundError);
    }

    account.balance = account.balance - input.amount;

    const event: Event = {
      id: randomUUID() || eventId,
      account_id: account.id,
      account_role: 'origin',
      amout: input.amount,
      type: input.type,
      created_at: new Date()
    };

    account.events.push(event);

    this.accountRepository.saveAccount(account);

    return { origin: { id: input.origin, balance: account.balance } };
  }

  private transfer(input: ProcessEventInput) {
    if (!input.destination || !input.origin) {
      throw new Error('transfer without destination or origin');
    }

    if (input.destination === input.origin) {
      throw new Error('origin and destination must not be the same');
    }

    const eventId = randomUUID();

    return { ...this.withdraw(input, eventId), ...this.deposit(input, eventId) };
  }
}
