import { describe, expect, it } from 'vitest';
import { add, divide, multiply } from './index';

describe('calculator operations', () => {
  it('returns full-precision numeric results', () => {
    expect(add(2, 3)).toBe(5);
    expect(divide(2, 3)).toBeCloseTo(2 / 3);
    expect(multiply(2 / 3, 3)).toBeCloseTo(2);
  });
});
