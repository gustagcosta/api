import { IAccountRepository } from '../repositories/account.repository';
import { ApplicationError, ErrorTypes } from '../shared/error';

export type ProcessEventInput = {
  type: 'withdraw' | 'deposit' | 'transfer';
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
  constructor(private readonly accountRepository: IAccountRepository) {}

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

  private deposit(input: ProcessEventInput): ProcessEventOutput {
    if (!input.destination) {
      throw new Error('deposit without destination');
    }

    const account = this.accountRepository.findOrCreateAccount(input.destination);

    account.balance = account.balance + input.amount;

    this.accountRepository.saveAccount(account);

    return { destination: { id: input.destination, balance: account.balance } };
  }

  private withdraw(input: ProcessEventInput) {
    if (!input.origin) {
      throw new Error('withdraw without origin');
    }

    const account = this.accountRepository.findAccount(input.origin);

    if (!account) {
      throw new ApplicationError('account not found', ErrorTypes.NotFoundError);
    }

    account.balance = account.balance - input.amount;

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

    return { ...this.withdraw(input), ...this.deposit(input) };
  }
}
