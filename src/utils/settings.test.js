import { describe, expect, it } from 'vitest';
import {
  DEFAULT_SETTINGS,
  loadSettings,
  saveSettings,
  SETTINGS_STORAGE_KEY,
} from './settings';

const createStorage = (initialValues = {}) => {
  const values = new Map(Object.entries(initialValues));
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
};

describe('settings persistence', () => {
  it('returns behavior-preserving defaults when no saved values exist', () => {
    expect(loadSettings(createStorage())).toEqual({
      maxInputFractionalDigits: null,
      displayDecimalPlaces: 3,
    });
    expect(DEFAULT_SETTINGS).toEqual({
      maxInputFractionalDigits: null,
      displayDecimalPlaces: 3,
    });
  });

  it('loads valid persisted values and saves validated settings under a versioned key', () => {
    const storage = createStorage();
    const settings = {
      maxInputFractionalDigits: 2,
      displayDecimalPlaces: 6,
    };

    expect(saveSettings(settings, storage)).toBe(true);
    expect(storage.getItem(SETTINGS_STORAGE_KEY)).toBe(JSON.stringify(settings));
    expect(loadSettings(storage)).toEqual(settings);
  });

  it.each([
    ['malformed JSON', '{not json'],
    ['a non-object value', 'null'],
  ])('uses defaults for %s', (_description, serialized) => {
    const storage = createStorage({ [SETTINGS_STORAGE_KEY]: serialized });
    expect(loadSettings(storage)).toEqual(DEFAULT_SETTINGS);
  });

  it('falls back independently for invalid and out-of-range settings', () => {
    const invalidInputLimit = createStorage({
      [SETTINGS_STORAGE_KEY]: JSON.stringify({
        maxInputFractionalDigits: 13,
        displayDecimalPlaces: 4,
      }),
    });
    const invalidDisplayPlaces = createStorage({
      [SETTINGS_STORAGE_KEY]: JSON.stringify({
        maxInputFractionalDigits: 2,
        displayDecimalPlaces: '4',
      }),
    });

    expect(loadSettings(invalidInputLimit)).toEqual({
      maxInputFractionalDigits: null,
      displayDecimalPlaces: 4,
    });
    expect(loadSettings(invalidDisplayPlaces)).toEqual({
      maxInputFractionalDigits: 2,
      displayDecimalPlaces: 3,
    });
  });

  it('accepts zero as a valid setting and null as an unlimited input cap', () => {
    const storage = createStorage({
      [SETTINGS_STORAGE_KEY]: JSON.stringify({
        maxInputFractionalDigits: 0,
        displayDecimalPlaces: 0,
      }),
    });
    expect(loadSettings(storage)).toEqual({
      maxInputFractionalDigits: 0,
      displayDecimalPlaces: 0,
    });

    expect(loadSettings(createStorage({
      [SETTINGS_STORAGE_KEY]: JSON.stringify({
        maxInputFractionalDigits: null,
        displayDecimalPlaces: 3,
      }),
    })).maxInputFractionalDigits).toBeNull();
  });

  it('falls back when storage is missing or throws while reading or writing', () => {
    expect(loadSettings(null)).toEqual(DEFAULT_SETTINGS);
    expect(loadSettings({})).toEqual(DEFAULT_SETTINGS);
    expect(loadSettings({ getItem: () => { throw new Error('blocked'); } })).toEqual(DEFAULT_SETTINGS);
    expect(saveSettings(DEFAULT_SETTINGS, { setItem: () => { throw new Error('blocked'); } })).toBe(false);
    expect(saveSettings(DEFAULT_SETTINGS, null)).toBe(false);
  });
});
