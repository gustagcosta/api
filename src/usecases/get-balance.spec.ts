import { describe, it, beforeEach, mock } from 'node:test';
import assert from 'node:assert';
import { GetBalanceUseCase } from './get-balance';

describe('ProcessEventUseCase', () => {
  let mockGateway: any;
  let useCase: GetBalanceUseCase;

  beforeEach(() => {
    mockGateway = {
      saveAccount: mock.fn(),
      findOrCreateAccount: mock.fn(),
      findAccount: mock.fn()
    };

    useCase = new GetBalanceUseCase({ accountRepository: mockGateway } as any);
  });

  it('should throw an error if account not found', () => {
    assert.throws(() => useCase.execute('1'), { message: 'account not found' });
  });

  it('should get the balance', () => {
    mockGateway.findAccount.mock.mockImplementationOnce(() => {
      return { id: '1', balance: 10 };
    });

    const output = useCase.execute('1');

    assert.deepStrictEqual(output, 10);
  });
});
