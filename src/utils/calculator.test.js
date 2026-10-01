import { describe, expect, it } from 'vitest';
import {
  appendInput,
  deleteOperand,
  evaluateExpression,
  evaluationToState,
  formatExpressionOperand,
  formatResult,
  mapCalculatorKey,
  resetCalculator,
  retainEvaluatedOperandDisplay,
} from './calculator';

describe('calculator keyboard mapping', () => {
  it.each(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'])('maps %s to operand input', (key) => {
    expect(mapCalculatorKey(key)).toEqual({ type: 'input', value: key });
  });

  it.each(['+', '-', '*', '/'])('maps %s to its arithmetic operation', (key) => {
    expect(mapCalculatorKey(key)).toEqual({ type: 'operation', value: key });
  });

  it('maps Enter to evaluation outside the keypad and native activation inside it', () => {
    expect(mapCalculatorKey('Enter')).toEqual({ type: 'evaluate' });
    expect(mapCalculatorKey('Enter', { insideKeypad: true })).toEqual({ type: 'activate' });
  });

  it('always maps = to evaluation, including inside the keypad', () => {
    expect(mapCalculatorKey('=', { insideKeypad: true })).toEqual({ type: 'evaluate' });
  });

  it('maps Backspace to one-character deletion', () => {
    expect(mapCalculatorKey('Backspace')).toEqual({ type: 'delete' });
  });

  it.each(['Escape', 'Delete', 'x', '%', '^', 'ArrowLeft'])('ignores unsupported key %s', (key) => {
    expect(mapCalculatorKey(key)).toBeNull();
  });
});

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

describe('computed operand display state', () => {
  it('retains rounded display state while the first operand is unchanged', () => {
    const computed = { n1: String(99 / 7), n2: null };
    const operationSelected = { ...computed, n2: null };
    const secondOperandEdited = { ...computed, n2: '3' };
    const secondOperandDeleted = { ...computed, n2: null };

    expect(retainEvaluatedOperandDisplay(true, computed, operationSelected)).toBe(true);
    expect(retainEvaluatedOperandDisplay(true, operationSelected, secondOperandEdited)).toBe(true);
    expect(retainEvaluatedOperandDisplay(true, secondOperandEdited, secondOperandDeleted)).toBe(true);
    expect(formatExpressionOperand(computed.n1, true, 2)).toBe('14.14');
    expect(computed.n1).toBe(String(99 / 7));
    expect(evaluateExpression({
      numbers: { n1: computed.n1, n2: '1' },
      operation: '+',
    })).toEqual({ ok: true, value: 99 / 7 + 1 });
  });

  it('clears rounded display state when the first operand changes or calculator resets', () => {
    const computed = { n1: String(99 / 7), n2: '3' };
    const editedFirstOperand = { n1: '14.1', n2: '3' };
    const reset = { n1: '0', n2: null };

    expect(retainEvaluatedOperandDisplay(true, computed, editedFirstOperand)).toBe(false);
    expect(retainEvaluatedOperandDisplay(true, computed, reset)).toBe(false);
    expect(retainEvaluatedOperandDisplay(true, { n1: '0' }, { n1: '0' }, { isReset: true })).toBe(false);
    expect(retainEvaluatedOperandDisplay(false, computed, computed)).toBe(false);
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

  it('formats only the evaluated expression operand and preserves precision for chained calculations', () => {
    const squareRoot = evaluateExpression({
      numbers: { n1: '99', n2: null },
      operation: '√',
    });
    expect(squareRoot).toEqual({ ok: true, value: Math.sqrt(99) });

    const evaluatedState = evaluationToState(squareRoot, {
      numbers: { n1: '99', n2: null },
      operation: '√',
      numberEditing: 'n1',
      result: 0,
    });
    expect(formatResult(evaluatedState.result)).toBe('9.95');
    expect(formatExpressionOperand(evaluatedState.numbers.n1, true)).toBe('9.95');
    expect(evaluatedState.numbers.n1).toBe(String(Math.sqrt(99)));

    const nextCalculation = evaluateExpression({
      numbers: { n1: evaluatedState.numbers.n1, n2: '1' },
      operation: '+',
    });
    expect(nextCalculation).toEqual({ ok: true, value: Math.sqrt(99) + 1 });
  });

  it('leaves manually entered and pending expression operands unchanged', () => {
    const manuallyEnteredOperand = '1.234567';
    const pendingExpressionOperand = '9.9498743710662';
    expect(formatExpressionOperand(manuallyEnteredOperand, false, 2)).toBe(manuallyEnteredOperand);
    expect(formatExpressionOperand(pendingExpressionOperand, false, 2)).toBe(pendingExpressionOperand);
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
    expect(nextState.numbers.n1).toBe(String(2 / 3));
    expect(formatExpressionOperand(nextState.numbers.n1, true, 0)).toBe('1');

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
