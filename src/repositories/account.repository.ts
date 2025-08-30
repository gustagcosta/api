import { boolean } from 'zod';
import { Account } from '../entities/account';

export interface IAccountRepository {
  findAccount(accountId: string): Account | null;
  saveAccount(account: Account): void;
  findOrCreateAccount(accountId: string): Account;
  reset(): void;
}

export class AccountRepository implements IAccountRepository {
  private accounts: Account[];

  constructor() {
    this.accounts = [];
  }

  public reset() {
    this.accounts = [];
  }

  public findAccount(accountId: string): Account | null {
    const account = this.accounts.find((acc) => acc.id === accountId);

    if (!account) {
      return null;
    }

    return account;
  }

  public saveAccount(account: Account): void {
    const accountIndex = this.accounts.findIndex((acc) => acc.id === account.id);

    if (accountIndex > -1) {
      this.accounts[accountIndex] = account;
    } else {
      this.accounts.push(account);
    }
  }

  public findOrCreateAccount(accountId: string): Account {
    const account = this.findAccount(accountId);

    if (account) {
      return account;
    }

    return { id: accountId, balance: 0, events: [] };
  }
}
