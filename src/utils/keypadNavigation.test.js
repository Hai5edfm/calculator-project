import { describe, expect, it } from 'vitest';
import { findDirectionalButton } from './keypadNavigation';

const button = (name, left, top, right, bottom) => ({
  element: name,
  rect: { left, top, right, bottom },
});

const select = (current, candidates, direction) =>
  findDirectionalButton(current.rect, candidates, direction);

describe('keypad directional navigation', () => {
  const firstRow = [
    button('power', 0, 0, 40, 40),
    button('root', 40, 0, 80, 40),
    button('square', 80, 0, 120, 40),
    button('clear', 120, 0, 200, 40),
  ];
  const secondRow = [
    button('seven', 0, 40, 40, 80),
    button('eight', 40, 40, 80, 80),
    button('nine', 80, 40, 120, 80),
    button('divide', 120, 40, 160, 80),
    button('delete', 160, 40, 200, 80),
  ];
  const buttons = [...firstRow, ...secondRow];

  it('moves to the nearest button on a row and respects a spanned button footprint', () => {
    expect(select(firstRow[0], buttons, 'ArrowRight')).toBe('root');
    expect(select(firstRow[3], buttons, 'ArrowDown')).toBe('divide');
  });

  it('prefers candidates aligned on the perpendicular axis', () => {
    const current = button('current', 40, 0, 80, 40);
    const nearerDiagonal = button('diagonal', 80, 35, 120, 75);
    const aligned = button('aligned', 100, 0, 140, 40);
    expect(select(current, [nearerDiagonal, aligned], 'ArrowRight')).toBe('aligned');
  });

  it('stops at an edge when no button exists in that direction', () => {
    expect(select(firstRow[0], buttons, 'ArrowLeft')).toBeNull();
    expect(select(firstRow[0], buttons, 'ArrowUp')).toBeNull();
    expect(select(secondRow[0], buttons, 'ArrowDown')).toBeNull();
    expect(findDirectionalButton(firstRow[0].rect, buttons, 'Home')).toBeNull();
  });
});
