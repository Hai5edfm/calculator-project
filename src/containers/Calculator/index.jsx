import React from "react";
import { NumberPad } from "../../components/Buttons"
import {
  appendInput,
  deleteOperand,
  evaluateExpression,
  evaluationToState,
  formatResult,
  mapCalculatorKey,
} from '../../utils/calculator';
import { findDirectionalButton } from '../../utils/keypadNavigation';
import { DEFAULT_SETTINGS } from '../../utils/settings';
import '../../styles/containers/Calculator/index.css';

export const Calculator = ({ settings = DEFAULT_SETTINGS, active = true }) => {
  const [result, setResult] = React.useState(0);
  const [numberEditing, setNumberEditing] = React.useState('n1');
  const [operation, setOperation] = React.useState(null);
  const [{n1, n2}, setNumbers] = React.useState({n1: '0', n2: null});

  React.useEffect(() => {
    if (!active) return undefined;

    const handleKeyDown = (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;

      const target = event.target;
      if (
        target?.closest?.(
          'input, textarea, select, [contenteditable]:not([contenteditable="false"]), .settings, .mode-navigation',
        )
      ) return;

      const keypad = target?.closest?.('.buttonsList');
      if (keypad && /^Arrow(?:Up|Down|Left|Right)$/.test(event.key)) {
        const currentButton = target.closest('button');
        const candidates = Array.from(keypad.querySelectorAll('button')).map((element) => ({
          element,
          rect: element.getBoundingClientRect(),
        }));
        const current = candidates.find(({ element }) => element === currentButton);
        const nextButton = current && findDirectionalButton(current.rect, candidates, event.key);
        event.preventDefault();
        nextButton?.focus();
        return;
      }

      const action = mapCalculatorKey(event.key, { insideKeypad: Boolean(keypad) });
      if (!action || action.type === 'activate') return;

      if (action.type === 'input') {
        if (numberEditing === 'n2' && (operation === '√' || operation === '²')) return;
        event.preventDefault();
        setNumbers(appendInput(
          { n1, n2 },
          numberEditing,
          action.value,
          settings.maxInputFractionalDigits,
        ));
      } else if (action.type === 'operation') {
        event.preventDefault();
        setOperation(action.value);
        setNumberEditing('n2');
      } else if (action.type === 'delete') {
        event.preventDefault();
        setNumbers(deleteOperand({ n1, n2 }, numberEditing));
      } else if (action.type === 'evaluate') {
        event.preventDefault();
        const numbers = { n1, n2 };
        const nextState = evaluationToState(
          evaluateExpression({ numbers, operation }),
          { numbers, operation, numberEditing, result },
        );
        setResult(nextState.result);
        setNumbers(nextState.numbers);
        setOperation(nextState.operation);
        setNumberEditing(nextState.numberEditing);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [active, n1, n2, numberEditing, operation, result, settings.maxInputFractionalDigits]);

  return(
    <div className="calculator-layout">
      <aside className="calculator-shortcuts" aria-label="Keyboard shortcuts">
        <table>
          <caption>Keyboard shortcuts</caption>
          <tbody>
            <tr><th scope="row">0–9, .</th><td>Enter digits in the current operand</td></tr>
            <tr><th scope="row">+ - * /</th><td>Choose an arithmetic operation</td></tr>
            <tr><th scope="row">Backspace</th><td>Delete one character</td></tr>
            <tr><th scope="row">Arrow keys</th><td>Move focus between keypad buttons</td></tr>
            <tr><th scope="row">Space</th><td>Activate the focused keypad button</td></tr>
            <tr><th scope="row">Enter</th><td>Activate a focused keypad button, or evaluate when focus is outside the keypad</td></tr>
            <tr><th scope="row">=</th><td>Evaluate</td></tr>
          </tbody>
        </table>
      </aside>
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
    </div>
  );
};

