import { z } from 'zod';
import { ProcessEventUseCase } from '../usecases/process-event';
import { AppContainer } from '../container';

export const eventSchema = z.object({
  type: z.enum(['withdraw', 'deposit', 'transfer']),
  amount: z.number().positive(),
  origin: z.string().optional(),
  destination: z.string().optional()
});

export class ProcessEventController {
  private processEventUseCase: ProcessEventUseCase;

  constructor(params: AppContainer) {
    this.processEventUseCase = params.processEventUseCase;
  }

  public execute(input: any) {
    console.log('Process event input', { input });

    const processEventInput = eventSchema.parse(input);

    const output = this.processEventUseCase.execute(processEventInput);

    console.log('Process event output', { output });

    return output;
  }
}
