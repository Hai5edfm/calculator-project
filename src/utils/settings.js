export const SETTINGS_STORAGE_KEY = 'calculator.settings.v1';

export const DEFAULT_SETTINGS = Object.freeze({
  maxInputFractionalDigits: null,
  displayDecimalPlaces: 3,
});

const isFractionalDigitLimit = (value) =>
  value === null || (Number.isInteger(value) && value >= 0 && value <= 12);

const isDisplayDecimalPlaces = (value) =>
  Number.isInteger(value) && value >= 0 && value <= 12;

export const validateSettings = (value) => {
  if (value == null || typeof value !== 'object' || Array.isArray(value)) {
    return { ...DEFAULT_SETTINGS };
  }

  return {
    maxInputFractionalDigits: isFractionalDigitLimit(value.maxInputFractionalDigits)
      ? value.maxInputFractionalDigits
      : DEFAULT_SETTINGS.maxInputFractionalDigits,
    displayDecimalPlaces: isDisplayDecimalPlaces(value.displayDecimalPlaces)
      ? value.displayDecimalPlaces
      : DEFAULT_SETTINGS.displayDecimalPlaces,
  };
};

const resolveStorage = (storage) =>
  storage === undefined ? globalThis.localStorage : storage;

export const loadSettings = (storage) => {
  try {
    const storageApi = resolveStorage(storage);
    if (!storageApi || typeof storageApi.getItem !== 'function') {
      return { ...DEFAULT_SETTINGS };
    }

    const serialized = storageApi.getItem(SETTINGS_STORAGE_KEY);
    if (serialized == null) return { ...DEFAULT_SETTINGS };
    return validateSettings(JSON.parse(serialized));
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
};

export const saveSettings = (value, storage) => {
  try {
    const storageApi = resolveStorage(storage);
    if (!storageApi || typeof storageApi.setItem !== 'function') return false;

    storageApi.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(validateSettings(value)));
    return true;
  } catch {
    return false;
  }
};
