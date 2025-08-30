import { describe, it, beforeEach, mock } from 'node:test';
import assert from 'node:assert';
import { ProcessEventUseCase } from './process-event';
import { ApplicationError } from '../shared/error';

describe('ProcessEventUseCase', () => {
  let mockAccountRepository: any;
  let useCase: ProcessEventUseCase;

  beforeEach(() => {
    mockAccountRepository = {
      saveAccount: mock.fn(),
      findOrCreateAccount: mock.fn(),
      findAccount: mock.fn()
    };

    useCase = new ProcessEventUseCase({ accountRepository: mockAccountRepository } as any);
  });

  it('should throw an error for amount less than or equal to 0', () => {
    assert.throws(() => useCase.execute({ type: 'deposit', amount: 0, destination: '1' }), {
      message: 'amount must be higher than 0'
    });
  });

  it('should throw an error for an invalid event type', () => {
    assert.throws(() => useCase.execute({ type: 'invalid' as any, amount: 10 }), { message: 'invalid event type' });
  });

  describe('deposit', () => {
    it('should throw an error if destination is not provided', () => {
      assert.throws(() => useCase.execute({ type: 'deposit', amount: 10 }), { message: 'deposit without destination' });
    });

    it('should deposit into a new account', () => {
      mockAccountRepository.findOrCreateAccount.mock.mockImplementationOnce((id: string) => ({
        id,
        balance: 0,
        events: []
      }));

      const output = useCase.execute({ type: 'deposit', amount: 10, destination: '100' });

      assert.deepStrictEqual(output, {
        destination: { id: '100', balance: 10 }
      });

      assert.strictEqual(mockAccountRepository.saveAccount.mock.callCount(), 1);
    });

    it('should deposit into an existing account', () => {
      mockAccountRepository.findOrCreateAccount.mock.mockImplementationOnce((id: string) => ({
        id,
        balance: 5,
        events: []
      }));

      const output = useCase.execute({ type: 'deposit', amount: 10, destination: '100' });

      assert.deepStrictEqual(output, {
        destination: { id: '100', balance: 15 }
      });
    });
  });

  describe('withdraw', () => {
    it('should throw an error if origin is not provided', () => {
      assert.throws(() => useCase.execute({ type: 'withdraw', amount: 10 }), { message: 'withdraw without origin' });
    });

    it('should throw a not found error if origin account does not exist', () => {
      mockAccountRepository.findAccount.mock.mockImplementationOnce(() => null);

      assert.throws(
        () => useCase.execute({ type: 'withdraw', amount: 10, origin: 'non-existent' }),
        (err) => {
          assert(err instanceof ApplicationError);
          assert.strictEqual(err.message, 'account not found');
          return true;
        }
      );
    });

    it('should withdraw from an existing account', () => {
      mockAccountRepository.findAccount.mock.mockImplementationOnce((id: string) => ({ id, balance: 20, events: [] }));

      const output = useCase.execute({ type: 'withdraw', amount: 10, origin: '100' });

      assert.deepStrictEqual(output, {
        origin: { id: '100', balance: 10 }
      });
      assert.strictEqual(mockAccountRepository.saveAccount.mock.callCount(), 1);
    });
  });

  describe('transfer', () => {
    it('should throw an error if origin or destination is not provided', () => {
      assert.throws(() => useCase.execute({ type: 'transfer', amount: 10, origin: '100' }), {
        message: 'transfer without destination or origin'
      });
    });

    it('should throw an error if origin and destination are the same', () => {
      assert.throws(() => useCase.execute({ type: 'transfer', amount: 10, origin: '100', destination: '100' }), {
        message: 'origin and destination must not be the same'
      });
    });

    it('should throw an error if origin account is not found during transfer', () => {
      mockAccountRepository.findAccount.mock.mockImplementationOnce(() => null);

      assert.throws(
        () => useCase.execute({ type: 'transfer', amount: 10, origin: 'non-existent', destination: '200' }),
        { message: 'account not found' }
      );
    });

    it('should transfer between two existing accounts', () => {
      mockAccountRepository.findAccount.mock.mockImplementationOnce((id: string) => ({ id, balance: 50, events: [] }));
      mockAccountRepository.findOrCreateAccount.mock.mockImplementationOnce((id: string) => ({
        id,
        balance: 10,
        events: []
      }));

      const output = useCase.execute({ type: 'transfer', amount: 15, origin: '100', destination: '200' });

      assert.deepStrictEqual(output, {
        origin: { id: '100', balance: 35 },
        destination: { id: '200', balance: 25 }
      });

      assert.strictEqual(mockAccountRepository.saveAccount.mock.callCount(), 2);
    });
  });
});
