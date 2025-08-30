import { z } from 'zod';
import { GetBalanceUseCase } from '../usecases/get-balance';
import { AppContainer } from '../container';

export class GetBalanceController {
  private getBalanceUseCase: GetBalanceUseCase;

  constructor(params: AppContainer) {
    this.getBalanceUseCase = params.getBalanceUseCase;
  }

  public execute(input: any) {
    console.log('Get balance input', { input });

    const accountId = z.string().parse(input);

    const output = this.getBalanceUseCase.execute(accountId);

    console.log('Get balance output', { output });

    return output;
  }
}
