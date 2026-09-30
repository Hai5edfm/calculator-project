import { describe, expect, it } from 'vitest';
import { convertValue, getConverterCategories } from './converter';

describe('convertValue', () => {
  it.each([
    ['temperature', 'celsius', 'fahrenheit', 0, 32],
    ['temperature', 'fahrenheit', 'celsius', 32, 0],
    ['temperature', 'celsius', 'kelvin', 0, 273.15],
    ['temperature', 'kelvin', 'fahrenheit', 273.15, 32],
    ['length', 'millimeters', 'meters', 1250, 1.25],
    ['length', 'kilometers', 'miles', 1, 0.621371192237334],
    ['length', 'inches', 'centimeters', 12, 30.48],
    ['length', 'feet', 'meters', 1, 0.3048],
    ['mass', 'milligrams', 'grams', 2500, 2.5],
    ['mass', 'kilograms', 'pounds', 1, 2.2046226218487757],
    ['mass', 'ounces', 'grams', 1, 28.349523125],
  ])('converts %s from %s to %s', (_category, source, target, value, expected) => {
    expect(convertValue(value, source, target)).toBeCloseTo(expected, 12);
  });

  it.each([
    ['length', 'miles', 'kilometers', 5, 8.04672],
    ['mass', 'pounds', 'kilograms', 10, 4.5359237],
    ['temperature', 'fahrenheit', 'kelvin', 212, 373.15],
  ])('supports inverse %s conversion from %s to %s', (_category, source, target, value, expected) => {
    const converted = convertValue(value, source, target);
    const original = convertValue(converted, target, source);
    expect(converted).toBeCloseTo(expected, 12);
    expect(original).toBeCloseTo(value, 12);
  });

  it.each([
    ['celsius', 'celsius', -12.5],
    ['fahrenheit', 'fahrenheit', 98.6],
    ['kelvin', 'kelvin', 273.15],
    ['millimeters', 'millimeters', 4],
    ['centimeters', 'centimeters', 4],
    ['meters', 'meters', 4],
    ['kilometers', 'kilometers', 4],
    ['inches', 'inches', 4],
    ['feet', 'feet', 4],
    ['miles', 'miles', 4],
    ['milligrams', 'milligrams', 4],
    ['grams', 'grams', 4],
    ['kilograms', 'kilograms', 4],
    ['ounces', 'ounces', 4],
    ['pounds', 'pounds', 4],
  ])('preserves identity conversion for %s', (source, target, value) => {
    expect(convertValue(value, source, target)).toBe(value);
  });

  it.each([
    ['', 'meters', 'kilometers'],
    ['   ', 'meters', 'kilometers'],
    ['not a number', 'meters', 'kilometers'],
    ['1.2.3', 'meters', 'kilometers'],
    ['Infinity', 'meters', 'kilometers'],
    ['1e999', 'meters', 'kilometers'],
    [Number.NaN, 'meters', 'kilometers'],
    [Number.POSITIVE_INFINITY, 'meters', 'kilometers'],
    [Number.MAX_VALUE, 'kilometers', 'millimeters'],
    [null, 'meters', 'kilometers'],
  ])('rejects invalid input %j', (value, source, target) => {
    expect(() => convertValue(value, source, target)).toThrow(TypeError);
  });

  it.each([
    ['unsupported source', 1, 'parsecs', 'meters'],
    ['unsupported target', 1, 'meters', 'parsecs'],
    ['mismatched categories', 1, 'meters', 'kilograms'],
  ])('rejects %s units', (_case, value, source, target) => {
    expect(() => convertValue(value, source, target)).toThrow(RangeError);
  });

  it('exposes only the three supported categories and their MVP units', () => {
    expect(getConverterCategories().map(({ value }) => value)).toEqual([
      'temperature',
      'length',
      'mass',
    ]);
    expect(getConverterCategories().map(({ units }) => units.map(({ value }) => value))).toEqual([
      ['celsius', 'fahrenheit', 'kelvin'],
      ['millimeters', 'centimeters', 'meters', 'kilometers', 'inches', 'feet', 'miles'],
      ['milligrams', 'grams', 'kilograms', 'ounces', 'pounds'],
    ]);
  });
});
