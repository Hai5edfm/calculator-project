import React from "react";
import { NumberPad } from "../../components/Buttons"
import { formatResult } from '../../utils/calculator';
import { DEFAULT_SETTINGS } from '../../utils/settings';
import '../../styles/containers/Calculator/index.css';

export const Calculator = ({ settings = DEFAULT_SETTINGS }) => {
  const [result, setResult] = React.useState(0);
  const [numberEditing, setNumberEditing] = React.useState('n1');
  const [operation, setOperation] = React.useState(null);
  const [{n1, n2}, setNumbers] = React.useState({n1: '0', n2: null});

  return(
    <div className="calculator-container">
      <div className="display">
        <p>{formatResult(result, settings.displayDecimalPlaces)}</p>
        <div id='display'>
          <span>{operation == '√' && operation} {n1} {operation !== '√' && operation} {n2}</span>
        </div>
      </div>
      <NumberPad
        setOperation={setOperation}
        operation={operation}
        setNumberEditing={setNumberEditing}
        numberEditing={numberEditing}
        setNumbers={setNumbers} 
        setResult={setResult}
        result={result}
        settings={settings}
        numbers={{n1, n2}}
      />
    </div>
  );
};

