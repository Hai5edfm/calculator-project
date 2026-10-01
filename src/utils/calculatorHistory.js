import { formatResult } from './calculator';

export const HISTORY_STORAGE_KEY = 'calculator.history.v1';
export const MAX_HISTORY_ENTRIES = 10;

const generatedNumber = String.raw`-?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?`;
const binaryExpression = new RegExp(String.raw`^(${generatedNumber}) (\+|-|×|÷|mod|\^) (${generatedNumber})$`, 'i');
const squareRootExpression = new RegExp(String.raw`^√\((${generatedNumber})\)$`, 'i');
const squareExpression = new RegExp(`^(${generatedNumber})²$`, 'i');

const formatGeneratedOperand = (operand, decimalPlaces) => {
  const value = Number(operand);
  return Number.isFinite(value) ? formatResult(value, decimalPlaces) : operand;
};

export const formatHistoryExpression = (expression, decimalPlaces = 3) => {
  if (typeof expression !== 'string') return expression;

  const binaryMatch = expression.match(binaryExpression);
  if (binaryMatch) {
    const [, first, operation, second] = binaryMatch;
    return `${formatGeneratedOperand(first, decimalPlaces)} ${operation} ${formatGeneratedOperand(second, decimalPlaces)}`;
  }

  const squareRootMatch = expression.match(squareRootExpression);
  if (squareRootMatch) {
    return `√(${formatGeneratedOperand(squareRootMatch[1], decimalPlaces)})`;
  }

  const squareMatch = expression.match(squareExpression);
  if (squareMatch) {
    return `${formatGeneratedOperand(squareMatch[1], decimalPlaces)}²`;
  }

  return expression;
};

const isHistoryEntry = (value) =>
  value !== null &&
  typeof value === 'object' &&
  !Array.isArray(value) &&
  typeof value.expression === 'string' &&
  typeof value.result === 'number' &&
  Number.isFinite(value.result);

export const validateHistory = (value) => {
  if (!Array.isArray(value)) return [];

  return value
    .filter(isHistoryEntry)
    .slice(0, MAX_HISTORY_ENTRIES)
    .map(({ expression, result }) => ({ expression, result }));
};

export const prependHistory = (entry, history) =>
  validateHistory([entry, ...(Array.isArray(history) ? history : [])]);

const resolveStorage = (storage) =>
  storage === undefined ? globalThis.localStorage : storage;

export const loadHistory = (storage) => {
  try {
    const storageApi = resolveStorage(storage);
    if (!storageApi || typeof storageApi.getItem !== 'function') return [];

    const serialized = storageApi.getItem(HISTORY_STORAGE_KEY);
    if (serialized == null || serialized === '') return [];
    return validateHistory(JSON.parse(serialized));
  } catch {
    return [];
  }
};

export const saveHistory = (value, storage) => {
  try {
    const storageApi = resolveStorage(storage);
    if (!storageApi || typeof storageApi.setItem !== 'function') return false;

    storageApi.setItem(HISTORY_STORAGE_KEY, JSON.stringify(validateHistory(value)));
    return true;
  } catch {
    return false;
  }
};
