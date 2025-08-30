import express, { Request, Response } from 'express';
import { ZodError } from 'zod';
import { ApplicationError, ErrorTypes } from './shared/error';
import { setupContainer } from './container';

const container = setupContainer();

const app = express();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  return res.send('ok');
});

app.post('/reset', (req: Request, res: Response) => {
  const accountRepository = container.resolve('accountRepository');

  accountRepository.reset();

  return res.sendStatus(200);
});

app.post('/event', (req: Request, res: Response) => {
  try {
    const processEventController = container.resolve('processEventController');

    const output = processEventController.execute(req.body);

    return res.status(201).json(output);
  } catch (error) {
    return handleError(error, res);
  }
});

app.get('/balance', (req: Request, res: Response) => {
  try {
    const getBalanceController = container.resolve('getBalanceController');

    const output = getBalanceController.execute(req.query['account_id']);

    return res.status(200).json(output);
  } catch (error) {
    return handleError(error, res);
  }
});

const handleError = (error: any, res: Response) => {
  if (error instanceof ZodError) {
    return res.status(400).send({ error: error.errors });
  }

  if (error instanceof ApplicationError) {
    if (error.code === ErrorTypes.NotFoundError) {
      return res.status(error.code).send(0);
    }

    return res.status(error.code).json({ message: error.message });
  }

  console.error({ error });

  return res.sendStatus(500);
};

app.listen(3333);
