import { AppContainer } from '../container';
import { IAccountRepository } from '../repositories/account.repository';
import { ApplicationError, ErrorTypes } from '../shared/error';

export class GetBalanceUseCase {
  private accountRepository: IAccountRepository;

  constructor(params: AppContainer) {
    this.accountRepository = params.accountRepository;
  }

  public execute(accountId: string): number {
    const account = this.accountRepository.findAccount(accountId);

    if (!account) {
      throw new ApplicationError('account not found', ErrorTypes.NotFoundError);
    }

    return account.balance;
  }
}
