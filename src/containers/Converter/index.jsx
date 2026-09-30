import React from 'react';
import { formatResult } from '../../utils/calculator';
import { DEFAULT_SETTINGS } from '../../utils/settings';
import { convertValue, getConverterCategories } from '../../utils/converter';
import '../../styles/containers/Converter/index.css';

const CATEGORIES = getConverterCategories();
const DEFAULT_UNITS = {
  temperature: { source: 'celsius', target: 'fahrenheit' },
  length: { source: 'meters', target: 'feet' },
  mass: { source: 'kilograms', target: 'pounds' },
};

const hasAllowedFractionalDigits = (nextValue, currentValue, limit) => {
  if (!Number.isInteger(limit) || limit < 0) return true;

  const nextDigits = nextValue.split('.')[1]?.length ?? 0;
  const currentDigits = currentValue.split('.')[1]?.length ?? 0;
  return nextDigits <= limit || nextDigits <= currentDigits;
};

export const Converter = ({ settings = DEFAULT_SETTINGS }) => {
  const [category, setCategory] = React.useState('temperature');
  const [value, setValue] = React.useState('1');
  const [sourceUnit, setSourceUnit] = React.useState(DEFAULT_UNITS.temperature.source);
  const [targetUnit, setTargetUnit] = React.useState(DEFAULT_UNITS.temperature.target);
  const selectedCategory = CATEGORIES.find((item) => item.value === category);

  const conversionResult = React.useMemo(() => {
    if (value.trim() === '') return null;
    try {
      return convertValue(value, sourceUnit, targetUnit);
    } catch {
      return null;
    }
  }, [value, sourceUnit, targetUnit]);

  const handleValueChange = (event) => {
    const nextValue = event.target.value;
    if (!/^-?(?:\d*(?:\.\d*)?)?$/.test(nextValue)) return;
    if (!hasAllowedFractionalDigits(
      nextValue,
      value,
      settings.maxInputFractionalDigits,
    )) return;
    setValue(nextValue);
  };

  const handleCategoryChange = (event) => {
    const nextCategory = event.target.value;
    setCategory(nextCategory);
    setSourceUnit(DEFAULT_UNITS[nextCategory].source);
    setTargetUnit(DEFAULT_UNITS[nextCategory].target);
  };

  const swapUnits = () => {
    setSourceUnit(targetUnit);
    setTargetUnit(sourceUnit);
  };

  return (
    <section className="converter-container" aria-labelledby="converter-heading">
      <h1 id="converter-heading">Converter</h1>
      <div className="converter__field">
        <label htmlFor="converter-value">Value to convert</label>
        <input
          id="converter-value"
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={value}
          onChange={handleValueChange}
        />
      </div>
      <div className="converter__field">
        <label htmlFor="converter-category">Category</label>
        <select
          id="converter-category"
          value={category}
          onChange={handleCategoryChange}
        >
          {CATEGORIES.map((item) => (
            <option key={item.value} value={item.value}>{item.label}</option>
          ))}
        </select>
      </div>
      <div className="converter__unit-controls">
        <div className="converter__field">
          <label htmlFor="converter-source-unit">Source unit</label>
          <select
            id="converter-source-unit"
            value={sourceUnit}
            onChange={(event) => setSourceUnit(event.target.value)}
          >
            {selectedCategory.units.map((unit) => (
              <option key={unit.value} value={unit.value}>{unit.label}</option>
            ))}
          </select>
        </div>
        <button
          className="converter__swap"
          type="button"
          aria-label="Swap source and target units"
          onClick={swapUnits}
        >
          Swap
        </button>
        <div className="converter__field">
          <label htmlFor="converter-target-unit">Target unit</label>
          <select
            id="converter-target-unit"
            value={targetUnit}
            onChange={(event) => setTargetUnit(event.target.value)}
          >
            {selectedCategory.units.map((unit) => (
              <option key={unit.value} value={unit.value}>{unit.label}</option>
            ))}
          </select>
        </div>
      </div>
      <output className="converter__result" aria-live="polite" aria-label="Converted result">
        {conversionResult == null
          ? 'Enter a valid finite value to see the conversion.'
          : `${formatResult(conversionResult, settings.displayDecimalPlaces)} ${selectedCategory.units.find((unit) => unit.value === targetUnit).label}`}
      </output>
    </section>
  );
};
