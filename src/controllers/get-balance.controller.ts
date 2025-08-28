import { z } from 'zod';
import { GetBalanceUseCase } from '../usecases/get-balance';

export class GetBalanceController {
  constructor(private readonly getBalanceUseCase: GetBalanceUseCase) {}

  public execute(input: any) {
    console.log('Get balance input', { input });

    const accountId = z.string().parse(input);

    const output = this.getBalanceUseCase.execute(accountId);

    console.log('Get balance output', { output });

    return output;
  }
}
