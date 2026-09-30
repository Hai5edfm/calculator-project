const UNIT_CATEGORIES = {
  temperature: {
    celsius: {
      label: 'Celsius (°C)',
      toBase: (value) => value + 273.15,
      fromBase: (value) => value - 273.15,
    },
    fahrenheit: {
      label: 'Fahrenheit (°F)',
      toBase: (value) => ((value - 32) * 5) / 9 + 273.15,
      fromBase: (value) => ((value - 273.15) * 9) / 5 + 32,
    },
    kelvin: {
      label: 'Kelvin (K)',
      toBase: (value) => value,
      fromBase: (value) => value,
    },
  },
  length: {
    millimeters: { label: 'Millimeters (mm)', factor: 0.001 },
    centimeters: { label: 'Centimeters (cm)', factor: 0.01 },
    meters: { label: 'Meters (m)', factor: 1 },
    kilometers: { label: 'Kilometers (km)', factor: 1000 },
    inches: { label: 'Inches (in)', factor: 0.0254 },
    feet: { label: 'Feet (ft)', factor: 0.3048 },
    miles: { label: 'Miles (mi)', factor: 1609.344 },
  },
  mass: {
    milligrams: { label: 'Milligrams (mg)', factor: 0.000001 },
    grams: { label: 'Grams (g)', factor: 0.001 },
    kilograms: { label: 'Kilograms (kg)', factor: 1 },
    ounces: { label: 'Ounces (oz)', factor: 0.028349523125 },
    pounds: { label: 'Pounds (lb)', factor: 0.45359237 },
  },
};

const findUnit = (unit) => {
  for (const [category, units] of Object.entries(UNIT_CATEGORIES)) {
    if (Object.hasOwn(units, unit)) {
      return { category, definition: units[unit] };
    }
  }
  return null;
};

const parseValue = (value) => {
  if (typeof value === 'number') {
    if (Number.isFinite(value)) return value;
    throw new TypeError('Value must be finite.');
  }

  if (typeof value !== 'string' || !/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(value.trim())) {
    throw new TypeError('Value must be a non-empty valid number.');
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) throw new TypeError('Value must be finite.');
  return parsed;
};

export const getConverterCategories = () =>
  Object.entries(UNIT_CATEGORIES).map(([value, units]) => ({
    value,
    label: value[0].toUpperCase() + value.slice(1),
    units: Object.entries(units).map(([unit, definition]) => ({
      value: unit,
      label: definition.label,
    })),
  }));

export const convertValue = (value, sourceUnit, targetUnit) => {
  const numericValue = parseValue(value);
  const source = findUnit(sourceUnit);
  const target = findUnit(targetUnit);

  if (!source || !target) throw new RangeError('Unsupported conversion unit.');
  if (source.category !== target.category) {
    throw new RangeError('Source and target units must belong to the same category.');
  }

  if (sourceUnit === targetUnit) return numericValue;

  const result = source.category === 'temperature'
    ? target.definition.fromBase(source.definition.toBase(numericValue))
    : (numericValue * source.definition.factor) / target.definition.factor;

  if (!Number.isFinite(result)) throw new TypeError('Conversion result must be finite.');
  return result;
};
