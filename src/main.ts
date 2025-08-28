import express, { Request, Response } from 'express';
import { AccountRepository } from './repositories/account.repository';
import { ProcessEventUseCase } from './usecases/process-event';
import { ProcessEventController } from './controllers/process-event.controller';
import { ZodError } from 'zod';
import { ApplicationError } from './shared/error';
import { GetBalanceController } from './controllers/get-balance.controller';
import { GetBalanceUseCase } from './usecases/get-balance';

const accountRepository = new AccountRepository();

const processEventUseCase = new ProcessEventUseCase(accountRepository);
const getBalanceUseCase = new GetBalanceUseCase(accountRepository);

const processEventController = new ProcessEventController(processEventUseCase);
const getBalanceController = new GetBalanceController(getBalanceUseCase);

const app = express();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  return res.send('ok');
});

app.post('/reset', (req: Request, res: Response) => {
  accountRepository.reset();

  return res.sendStatus(200);
});

app.post('/event', (req: Request, res: Response) => {
  try {
    const output = processEventController.execute(req.body);

    return res.status(201).json(output);
  } catch (error) {
    return handleError(error, res);
  }
});

app.get('/balance', (req: Request, res: Response) => {
  try {
    const output = getBalanceController.execute(req.query['account_id']);

    return res.status(201).json(output);
  } catch (error) {
    return handleError(error, res);
  }
});

const handleError = (error: any, res: Response) => {
  if (error instanceof ZodError) {
    return res.status(400).send({ error: error.errors });
  }

  if (error instanceof ApplicationError) {
    return res.status(error.code).send();
  }

  return res.sendStatus(500);
};

app.listen(3333);
