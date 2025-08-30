import { createContainer, asClass, AwilixContainer } from 'awilix';

import { GetBalanceController } from './controllers/get-balance.controller';
import { ProcessEventController } from './controllers/process-event.controller';
import { AccountRepository, IAccountRepository } from './repositories/account.repository';
import { GetBalanceUseCase } from './usecases/get-balance';
import { ProcessEventUseCase } from './usecases/process-event';

export type AppContainer = {
  accountRepository: IAccountRepository;
  processEventUseCase: ProcessEventUseCase;
  getBalanceUseCase: GetBalanceUseCase;
  processEventController: ProcessEventController;
  getBalanceController: GetBalanceController;
};

export function setupContainer(): AwilixContainer<AppContainer> {
  const container = createContainer<AppContainer>();

  container.register({
    accountRepository: asClass(AccountRepository).singleton(),
    processEventUseCase: asClass(ProcessEventUseCase).scoped(),
    getBalanceUseCase: asClass(GetBalanceUseCase).scoped(),
    processEventController: asClass(ProcessEventController).scoped(),
    getBalanceController: asClass(GetBalanceController).scoped()
  });

  return container;
}
