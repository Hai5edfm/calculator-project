import { describe, expect, it } from 'vitest';
import {
  HISTORY_STORAGE_KEY,
  MAX_HISTORY_ENTRIES,
  formatHistoryExpression,
  loadHistory,
  prependHistory,
  saveHistory,
} from './calculatorHistory';

const createStorage = (initialValues = {}) => {
  const values = new Map(Object.entries(initialValues));
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
};

const entry = (expression, result) => ({ expression, result });

describe('calculator history display formatting', () => {
  it('formats operands in calculator-generated binary expressions at the current precision', () => {
    expect(formatHistoryExpression('0.30000000000000004 + 0.123456789', 2))
      .toBe('0.3 + 0.12');
    expect(formatHistoryExpression('-1.2345 × 2.3456', 1)).toBe('-1.2 × 2.3');
  });

  it('formats calculator-generated unary expressions', () => {
    expect(formatHistoryExpression('√(2.3456)', 2)).toBe('√(2.35)');
    expect(formatHistoryExpression('-1.2345²', 1)).toBe('-1.2²');
  });

  it('supports generated scientific-notation operands and calculator operators', () => {
    expect(formatHistoryExpression('1e+21 mod 0.0001234', 2)).toBe('1e+21 mod 0');
    expect(formatHistoryExpression('1.2345 ^ 2', 1)).toBe('1.2 ^ 2');
  });

  it('leaves older or unrecognized expression formats visible unchanged', () => {
    expect(formatHistoryExpression('legacy operation: 1.2345', 2))
      .toBe('legacy operation: 1.2345');
    expect(formatHistoryExpression('not a generated expression', 2))
      .toBe('not a generated expression');
  });
});

describe('calculator history persistence', () => {
  it('returns an empty history when no saved entries exist', () => {
    expect(loadHistory(createStorage())).toEqual([]);
    expect(loadHistory(createStorage({ [HISTORY_STORAGE_KEY]: '' }))).toEqual([]);
  });

  it('keeps stored operands and results precise while formatting only their display', () => {
    const storage = createStorage();
    const preciseEntry = entry('0.30000000000000004 + 0.123456789', 0.42345678900000006);

    expect(saveHistory([preciseEntry], storage)).toBe(true);
    expect(loadHistory(storage)).toEqual([preciseEntry]);
    expect(formatHistoryExpression(preciseEntry.expression, 2)).toBe('0.3 + 0.12');
    expect(loadHistory(storage)[0].result).toBe(0.42345678900000006);
    expect(formatHistoryExpression(preciseEntry.expression, 5)).toBe('0.3 + 0.12346');
  });

  it('saves and loads valid entries under a versioned key without losing numeric precision', () => {
    const storage = createStorage();
    const history = [
      entry('0.1 + 0.2', 0.30000000000000004),
      entry('1 / 3', 1 / 3),
    ];

    expect(HISTORY_STORAGE_KEY).toMatch(/\.v\d+$/);
    expect(saveHistory(history, storage)).toBe(true);
    expect(storage.getItem(HISTORY_STORAGE_KEY)).toBe(JSON.stringify(history));
    expect(loadHistory(storage)).toEqual(history);
    expect(loadHistory(storage)[0].result).toBe(0.30000000000000004);
    expect(loadHistory(storage)[1].result).toBe(1 / 3);
  });

  it('discards invalid persisted entries while keeping valid records in their original order', () => {
    const storage = createStorage({
      [HISTORY_STORAGE_KEY]: JSON.stringify([
        entry('2 + 2', 4),
        null,
        entry(5, 5),
        entry('3 / 0', Infinity),
        entry('missing result', undefined),
        [],
        entry('1 + 1', 2),
      ]),
    });

    expect(loadHistory(storage)).toEqual([entry('2 + 2', 4), entry('1 + 1', 2)]);
  });

  it.each([
    ['malformed JSON', '{not json'],
    ['a non-array value', JSON.stringify({ expression: '1 + 1', result: 2 })],
  ])('returns an empty history for %s', (_description, serialized) => {
    expect(loadHistory(createStorage({ [HISTORY_STORAGE_KEY]: serialized }))).toEqual([]);
  });

  it('prepends a valid record and keeps the newest ten entries', () => {
    const existing = Array.from({ length: MAX_HISTORY_ENTRIES }, (_, index) =>
      entry(`operation ${index}`, index),
    );

    expect(prependHistory(entry('new operation', 0.30000000000000004), existing)).toEqual([
      entry('new operation', 0.30000000000000004),
      ...existing.slice(0, MAX_HISTORY_ENTRIES - 1),
    ]);
    expect(prependHistory(entry('invalid operation', Infinity), existing)).toEqual(existing);
  });

  it('keeps newest-first order and limits saved and loaded data to ten entries', () => {
    const storage = createStorage();
    const history = Array.from({ length: MAX_HISTORY_ENTRIES + 2 }, (_, index) =>
      entry(`${MAX_HISTORY_ENTRIES + 2 - index}`, MAX_HISTORY_ENTRIES + 2 - index),
    );

    expect(MAX_HISTORY_ENTRIES).toBe(10);
    expect(saveHistory(history, storage)).toBe(true);
    expect(JSON.parse(storage.getItem(HISTORY_STORAGE_KEY))).toEqual(history.slice(0, 10));
    expect(loadHistory(storage)).toEqual(history.slice(0, 10));

    storage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    expect(loadHistory(storage)).toEqual(history.slice(0, 10));
  });

  it('handles missing storage and storage failures without throwing', () => {
    expect(loadHistory(null)).toEqual([]);
    expect(loadHistory({})).toEqual([]);
    expect(loadHistory({ getItem: () => { throw new Error('blocked'); } })).toEqual([]);
    expect(saveHistory([], null)).toBe(false);
    expect(saveHistory([], {})).toBe(false);
    expect(saveHistory([], { setItem: () => { throw new Error('blocked'); } })).toBe(false);
  });
});
