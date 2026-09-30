import React from 'react';
import '../../styles/components/Settings/index.css';

const Settings = ({ settings, onChange }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const wrapperRef = React.useRef(null);
  const buttonRef = React.useRef(null);
  const inputLimitRef = React.useRef(null);

  React.useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event) => {
      if (!wrapperRef.current?.contains(event.target)) setIsOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isOpen]);

  React.useEffect(() => {
    if (isOpen) inputLimitRef.current?.focus();
  }, [isOpen]);

  const closePanel = () => {
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') closePanel();
  };

  return (
    <div ref={wrapperRef} className="settings">
      <button
        ref={buttonRef}
        type="button"
        className="settings__toggle"
        aria-expanded={isOpen}
        aria-controls="settings-panel"
        onClick={() => setIsOpen((open) => !open)}
      >
        Settings
      </button>
      {isOpen && (
        <section
          id="settings-panel"
          className="settings__panel"
          aria-labelledby="settings-heading"
          onKeyDown={handleKeyDown}
        >
          <h2 id="settings-heading">Calculator settings</h2>
          <div className="settings__field">
            <label htmlFor="max-input-fractional-digits">
              Maximum input fractional digits
            </label>
            <select
              ref={inputLimitRef}
              id="max-input-fractional-digits"
              value={settings.maxInputFractionalDigits ?? ''}
              onChange={(event) => onChange({
                ...settings,
                maxInputFractionalDigits: event.target.value === ''
                  ? null
                  : Number(event.target.value),
              })}
            >
              <option value="">No limit</option>
              {Array.from({ length: 13 }, (_, digits) => (
                <option key={digits} value={digits}>{digits}</option>
              ))}
            </select>
          </div>
          <div className="settings__field">
            <label htmlFor="display-decimal-places">Displayed decimal places</label>
            <select
              id="display-decimal-places"
              value={settings.displayDecimalPlaces}
              onChange={(event) => onChange({
                ...settings,
                displayDecimalPlaces: Number(event.target.value),
              })}
            >
              {Array.from({ length: 13 }, (_, digits) => (
                <option key={digits} value={digits}>{digits}</option>
              ))}
            </select>
          </div>
          <button type="button" className="settings__close" onClick={closePanel}>
            Close settings
          </button>
        </section>
      )}
    </div>
  );
};

export { Settings };
