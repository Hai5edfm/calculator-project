import { describe, expect, it } from 'vitest';
import {
  appendInput,
  deleteOperand,
  evaluateExpression,
  evaluationToState,
  formatResult,
  resetCalculator,
} from './calculator';

describe('calculator input', () => {
  it('normalizes leading decimal input for either operand and ignores extra decimals', () => {
    let numbers = { n1: '0', n2: null };
    numbers = appendInput(numbers, 'n1', '.');
    expect(numbers.n1).toBe('0.');
    numbers = appendInput(numbers, 'n1', '2');
    numbers = appendInput(numbers, 'n1', '.');
    expect(numbers.n1).toBe('0.2');

    numbers = appendInput(numbers, 'n2', '.');
    numbers = appendInput(numbers, 'n2', '3');
    numbers = appendInput(numbers, 'n2', '.');
    numbers = appendInput(numbers, 'n2', '4');
    expect(numbers.n2).toBe('0.34');
  });

  it.each(['n1', 'n2'])('enforces fractional limits for %s', (operand) => {
    const start = { n1: '1', n2: '1' };
    const enterFraction = (limit, digits) => {
      let numbers = { ...start };
      numbers = appendInput(numbers, operand, '.', limit);
      for (const digit of digits) numbers = appendInput(numbers, operand, digit, limit);
      return numbers;
    };

    expect(appendInput(start, operand, '.', 0)).toBe(start);
    expect(enterFraction(1, '12')[operand]).toBe('1.1');
    expect(enterFraction(12, '1234567890123')[operand]).toBe('1.123456789012');
    expect(enterFraction(null, '1234567890123')[operand]).toBe('1.1234567890123');
  });

  it.each(['n1', 'n2'])('blocks further fractional input after lowering the limit for %s', (operand) => {
    let numbers = { n1: '1', n2: '1' };
    numbers = appendInput(numbers, operand, '.', null);
    numbers = appendInput(numbers, operand, '2', null);
    numbers = appendInput(numbers, operand, '3', null);
    const enteredValue = numbers[operand];

    expect(appendInput(numbers, operand, '4', 1)).toBe(numbers);
    numbers = deleteOperand(numbers, operand);
    expect(numbers[operand]).toBe(enteredValue.slice(0, -1));
    expect(appendInput(numbers, operand, '4', 1)).toBe(numbers);
    numbers = deleteOperand(numbers, operand);
    numbers = appendInput(numbers, operand, '.', 1);
    expect(appendInput(numbers, operand, '4', 1)[operand]).toBe('1.4');
  });

  it('does not accept malformed decimal values during evaluation', () => {
    expect(evaluateExpression({
      numbers: { n1: '2.3.4', n2: '1' },
      operation: '+',
    })).toEqual({ ok: false, value: 'Error' });
  });

  it('deletes an empty second operand safely and preserves first-operand deletion', () => {
    const numbers = { n1: '12', n2: null };
    expect(deleteOperand(numbers, 'n2')).toBe(numbers);
    expect(deleteOperand(numbers, 'n1')).toEqual({ n1: '1', n2: null });
    expect(deleteOperand({ n1: '1', n2: null }, 'n1')).toEqual({ n1: '0', n2: null });
  });

  it('resets all visible calculator state, including the result', () => {
    expect(resetCalculator()).toEqual({
      numbers: { n1: '0', n2: null },
      operation: null,
      numberEditing: 'n1',
      result: 0,
    });
  });
});

describe('calculator evaluation state transitions', () => {
  it('commits a successful evaluation as the next first operand', () => {
    expect(evaluationToState(
      { ok: true, value: 5 },
      {
        numbers: { n1: '2', n2: '3' },
        operation: '+',
        numberEditing: 'n2',
        result: 0,
      },
    )).toEqual({
      result: 5,
      numbers: { n1: '5', n2: null },
      operation: null,
      numberEditing: 'n1',
    });
  });

  it('shows an evaluation error while preserving the expression being edited', () => {
    const currentState = {
      numbers: { n1: '1', n2: '0' },
      operation: '/',
      numberEditing: 'n2',
      result: 0,
    };
    expect(evaluationToState({ ok: false, value: 'Error' }, currentState)).toEqual({
      ...currentState,
      result: 'Error',
    });
  });
});

describe('calculator evaluation', () => {
  it.each([
    ['+', { n1: '5', n2: '3' }, 8],
    ['-', { n1: '5', n2: '3' }, 2],
    ['*', { n1: '5', n2: '3' }, 15],
    ['/', { n1: '5', n2: '2' }, 2.5],
    ['%', { n1: '5', n2: '2' }, 1],
    ['^', { n1: '2', n2: '3' }, 8],
    ['√', { n1: '9', n2: null }, 3],
    ['²', { n1: '4', n2: null }, 16],
  ])('keeps the %s keypad operation available', (operation, numbers, value) => {
    expect(evaluateExpression({ numbers, operation })).toEqual({ ok: true, value });
  });

  it('formats with configurable maximum precision and trims trailing zeroes', () => {
    expect(formatResult(1.678, 0)).toBe('2');
    expect(formatResult(1.678, 2)).toBe('1.68');
    expect(formatResult(1.2, 5)).toBe('1.2');
    expect(formatResult(1.23456)).toBe('1.235');
  });

  it('retains full precision across chained operations while formatting only the display', () => {
    const quotient = evaluateExpression({
      numbers: { n1: '2', n2: '3' },
      operation: '/',
    });
    expect(quotient.ok).toBe(true);
    expect(quotient.value).toBe(2 / 3);

    const nextState = evaluationToState(quotient, {
      numbers: { n1: '2', n2: '3' },
      operation: '/',
      numberEditing: 'n2',
      result: 0,
    });
    expect(formatResult(nextState.result, 0)).toBe('1');

    const product = evaluateExpression({
      numbers: { n1: nextState.numbers.n1, n2: '3' },
      operation: '*',
    });
    expect(product).toEqual({ ok: true, value: 2 });
  });

  it.each([
    ['division by zero', { n1: '1', n2: '0' }, '/'],
    ['negative square root', { n1: '-4', n2: null }, '√'],
    ['incomplete binary expression', { n1: '1', n2: null }, '+'],
    ['missing operation', { n1: '1', n2: '2' }, null],
    ['non-finite operand', { n1: 'Infinity', n2: '2' }, '+'],
  ])('returns a visible error for %s', (_case, numbers, operation) => {
    expect(evaluateExpression({ numbers, operation })).toEqual({
      ok: false,
      value: 'Error',
    });
  });
});
