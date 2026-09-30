import {
  add,
  subtract,
  multiply,
  divide,
  modulo,
  exponent,
  squareRoot,
  square,
} from './operations';

export const ERROR_RESULT = 'Error';

export const mapCalculatorKey = (key, { insideKeypad = false } = {}) => {
  if (/^(?:\d|\.)$/.test(key)) return { type: 'input', value: key };
  if (['+', '-', '*', '/'].includes(key)) return { type: 'operation', value: key };
  if (key === 'Enter') return insideKeypad ? { type: 'activate' } : { type: 'evaluate' };
  if (key === '=') return { type: 'evaluate' };
  if (key === 'Backspace') return { type: 'delete' };
  return null;
};

const isValidNumber = (value) =>
  typeof value === 'string' && /^-?\d+(?:\.\d*)?$/.test(value) && Number.isFinite(Number(value));

export const appendInput = (numbers, operand, input, maxInputFractionalDigits = null) => {
  if (!['n1', 'n2'].includes(operand) || !/^(?:\d|\.)$/.test(input)) return numbers;

  const current = numbers[operand];
  if (input === '.' && current?.includes('.')) return numbers;
  if (input === '.' && maxInputFractionalDigits === 0) return numbers;

  let nextValue;
  if (current == null || current === '') {
    nextValue = input === '.' ? '0.' : input;
  } else if (current === '0' && input !== '.') {
    nextValue = input === '0' ? current : input;
  } else {
    nextValue = current + input;
  }

  if (Number.isInteger(maxInputFractionalDigits) && maxInputFractionalDigits >= 0) {
    const fractionalDigits = nextValue.split('.')[1]?.length ?? 0;
    if (fractionalDigits > maxInputFractionalDigits) return numbers;
  }

  return { ...numbers, [operand]: nextValue };
};

export const deleteOperand = (numbers, operand) => {
  if (operand === 'n2' && (numbers.n2 == null || numbers.n2 === '')) return numbers;
  if (operand === 'n1' && (numbers.n1 == null || numbers.n1 === '')) {
    return { ...numbers, n1: '0' };
  }
  if (!['n1', 'n2'].includes(operand)) return numbers;

  const current = numbers[operand];
  if (current.length <= 1) {
    return { ...numbers, [operand]: operand === 'n1' ? '0' : null };
  }

  return { ...numbers, [operand]: current.slice(0, -1) };
};

const parseOperand = (value) => (isValidNumber(value) ? Number(value) : null);

export const evaluateExpression = ({ numbers, operation }) => {
  const first = parseOperand(numbers.n1);
  if (first == null || operation == null) return { ok: false, value: ERROR_RESULT };

  const unaryOperations = {
    '√': squareRoot,
    '²': square,
  };
  let value;

  if (Object.hasOwn(unaryOperations, operation)) {
    value = unaryOperations[operation](first);
  } else {
    const second = parseOperand(numbers.n2);
    if (second == null) return { ok: false, value: ERROR_RESULT };

    const binaryOperations = {
      '+': add,
      '-': subtract,
      '*': multiply,
      '/': divide,
      '%': modulo,
      '^': exponent,
    };
    const calculate = binaryOperations[operation];
    if (!calculate) return { ok: false, value: ERROR_RESULT };
    value = calculate(first, second);
  }

  return Number.isFinite(value)
    ? { ok: true, value }
    : { ok: false, value: ERROR_RESULT };
};

export const formatResult = (value, displayDecimalPlaces = 3) => {
  if (typeof value !== 'number' || !Number.isFinite(value)) return value;
  return Number(value.toFixed(displayDecimalPlaces)).toString();
};

export const formatExpressionOperand = (value, isEvaluatedResult, displayDecimalPlaces = 3) => {
  if (!isEvaluatedResult) return value;
  const numericValue = Number(value);
  return Number.isFinite(numericValue)
    ? formatResult(numericValue, displayDecimalPlaces)
    : value;
};

export const evaluationToState = (evaluation, currentState) => {
  if (!evaluation.ok) {
    return { ...currentState, result: ERROR_RESULT };
  }

  return {
    result: evaluation.value,
    numbers: { n1: String(evaluation.value), n2: null },
    operation: null,
    numberEditing: 'n1',
  };
};

export const resetCalculator = () => ({
  numbers: { n1: '0', n2: null },
  operation: null,
  numberEditing: 'n1',
  result: 0,
});
