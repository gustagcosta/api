import { IAccountRepository } from '../repositories/account.repository';
import { ApplicationError, ErrorTypes } from '../shared/error';

export class GetBalanceUseCase {
  constructor(private readonly accountRepository: IAccountRepository) {}

  public execute(accountId: string): number {
    const account = this.accountRepository.findAccount(accountId);

    if (!account) {
      throw new ApplicationError('account not found', ErrorTypes.NotFoundError);
    }

    return account.balance;
  }
}
