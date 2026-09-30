import React from 'react';
import { Calculator } from '../../containers/Calculator';
import { Converter } from '../../containers/Converter';
import { Settings } from '../../components/Settings';
import { loadSettings, saveSettings } from '../../utils/settings';

const Home = () => {
  const [settings, setSettings] = React.useState(() => loadSettings());
  const [mode, setMode] = React.useState('calculator');

  const updateSettings = (nextSettings) => {
    setSettings(nextSettings);
    saveSettings(nextSettings);
  };

  return (
    <div className="home">
      <Settings settings={settings} onChange={updateSettings} />
      <nav className="mode-navigation" aria-label="Calculator modes">
        <button
          type="button"
          aria-pressed={mode === 'calculator'}
          onClick={() => setMode('calculator')}
        >
          Calculator
        </button>
        <button
          type="button"
          aria-pressed={mode === 'converter'}
          onClick={() => setMode('converter')}
        >
          Converter
        </button>
      </nav>
      <div className="mode-content" hidden={mode !== 'calculator'}>
        <Calculator settings={settings} />
      </div>
      <div className="mode-content" hidden={mode !== 'converter'}>
        <Converter settings={settings} />
      </div>
    </div>
  );
};

export { Home };

