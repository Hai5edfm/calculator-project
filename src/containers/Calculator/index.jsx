import React, { useEffect, useRef, useState } from "react";
import { FiChevronDown, FiX } from 'react-icons/fi';
import { NumberPad } from "../../components/Buttons"
import {
  appendInput,
  deleteOperand,
  evaluateExpression,
  evaluationToState,
  formatExpressionOperand,
  formatResult,
  mapCalculatorKey,
  retainEvaluatedOperandDisplay,
} from '../../utils/calculator';
import { findDirectionalButton } from '../../utils/keypadNavigation';
import {
  formatHistoryExpression,
  loadHistory,
  prependHistory,
  saveHistory,
} from '../../utils/calculatorHistory';
import { DEFAULT_SETTINGS } from '../../utils/settings';
import '../../styles/containers/Calculator/index.css';

const historyExpression = (numbers, operation) => {
  if (operation === '√') return `√(${numbers.n1})`;
  if (operation === '²') return `${numbers.n1}²`;

  const displayOperation = { '*': '×', '/': '÷', '%': 'mod' }[operation] ?? operation;
  return `${numbers.n1} ${displayOperation} ${numbers.n2}`;
};

export const Calculator = ({ settings = DEFAULT_SETTINGS, active = true }) => {
  const [result, setResult] = useState(0);
  const [history, setHistory] = useState(() => loadHistory());
  const [evaluatedOperand, setEvaluatedOperand] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [historyExpanded, setHistoryExpanded] = useState(true);
  const historyTriggerRef = useRef(null);
  const historyContentRef = useRef(null);
  const historyDialogRef = useRef(null);
  const historyCloseRef = useRef(null);
  const wasHistoryDialogOpen = useRef(false);
  const pendingPadEvaluation = useRef(null);
  const padEvaluationAttempt = useRef(false);
  const [numberEditing, setNumberEditing] = useState('n1');
  const [operation, setOperation] = useState(null);
  const [{n1, n2}, setNumbers] = useState({n1: '0', n2: null});

  useEffect(() => {
    saveHistory(history);
  }, [history]);

  useEffect(() => {
    if (historyContentRef.current) {
      historyContentRef.current.inert = !historyExpanded;
    }
  }, [historyExpanded]);

  useEffect(() => {
    const dialog = historyDialogRef.current;
    if (historyDialogOpen) {
      if (dialog && !dialog.open) dialog.showModal();
      historyCloseRef.current?.focus();
      wasHistoryDialogOpen.current = true;
      return;
    }

    if (wasHistoryDialogOpen.current) {
      if (dialog?.open) dialog.close();
      historyTriggerRef.current?.focus();
      wasHistoryDialogOpen.current = false;
    }
  }, [historyDialogOpen]);

  const recordEvaluation = (numbers, evaluatedOperation, evaluation) => {
    if (!evaluation.ok || !Number.isFinite(evaluation.value)) return;

    setHistory((currentHistory) => prependHistory({
      expression: historyExpression(numbers, evaluatedOperation),
      result: evaluation.value,
    }, currentHistory));
  };

  const closeHistoryDialog = () => {
    const dialog = historyDialogRef.current;
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (!dialog?.open || reduceMotion) {
      setHistoryDialogOpen(false);
      return;
    }
    if (dialog.classList.contains('is-closing')) return;

    const finishClose = (event) => {
      if (event.animationName !== 'calculator-history-dialog-out') return;
      dialog.removeEventListener('animationend', finishClose);
      dialog.classList.remove('is-closing');
      setHistoryDialogOpen(false);
    };
    dialog.classList.add('is-closing');
    dialog.addEventListener('animationend', finishClose);
  };

  const restoreHistoryEntry = (entry) => {
    pendingPadEvaluation.current = null;
    setResult(entry.result);
    setNumbers({ n1: String(entry.result), n2: null });
    setOperation(null);
    setNumberEditing('n1');
    setEvaluatedOperand(true);
    closeHistoryDialog();
  };

  useEffect(() => {
    if (!active) return undefined;

    const handleKeyDown = (event) => {
      if (historyDialogOpen || event.altKey || event.ctrlKey || event.metaKey) return;

      const target = event.target;
      if (
        target?.closest?.(
          'input, textarea, select, [contenteditable]:not([contenteditable="false"]), .settings, .mode-navigation, .calculator-history, .calculator-history-toggle, .calculator-history-dialog',
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
        const currentNumbers = { n1, n2 };
        const nextNumbers = appendInput(
          currentNumbers,
          numberEditing,
          action.value,
          settings.maxInputFractionalDigits,
        );
        event.preventDefault();
        setEvaluatedOperand((current) =>
          retainEvaluatedOperandDisplay(current, currentNumbers, nextNumbers),
        );
        setNumbers(nextNumbers);
      } else if (action.type === 'operation') {
        event.preventDefault();
        setOperation(action.value);
        setNumberEditing('n2');
      } else if (action.type === 'delete') {
        const currentNumbers = { n1, n2 };
        const nextNumbers = deleteOperand(currentNumbers, numberEditing);
        event.preventDefault();
        setEvaluatedOperand((current) =>
          retainEvaluatedOperandDisplay(current, currentNumbers, nextNumbers),
        );
        setNumbers(nextNumbers);
      } else if (action.type === 'evaluate') {
        event.preventDefault();
        const numbers = { n1, n2 };
        const evaluation = evaluateExpression({ numbers, operation });
        pendingPadEvaluation.current = null;
        recordEvaluation(numbers, operation, evaluation);
        const nextState = evaluationToState(
          evaluation,
          { numbers, operation, numberEditing, result },
        );
        setResult(nextState.result);
        setEvaluatedOperand(
          nextState.operation === null && typeof nextState.result === 'number'
            ? true
            : retainEvaluatedOperandDisplay(evaluatedOperand, { n1, n2 }, nextState.numbers),
        );
        setNumbers(nextState.numbers);
        setOperation(nextState.operation);
        setNumberEditing(nextState.numberEditing);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [active, evaluatedOperand, historyDialogOpen, n1, n2, numberEditing, operation, result, settings.maxInputFractionalDigits]);

  const setNumbersFromPad = (nextNumbers) => {
    const evaluatedValue = pendingPadEvaluation.current;
    const isEvaluation = evaluatedValue !== null
      && nextNumbers.n2 == null
      && nextNumbers.n1 === evaluatedValue;
    setNumbers(nextNumbers);
    setEvaluatedOperand(isEvaluation || retainEvaluatedOperandDisplay(
      evaluatedOperand,
      { n1, n2 },
      nextNumbers,
    ));
    if (!isEvaluation) pendingPadEvaluation.current = null;
  };

  const setOperationFromPad = (nextOperation) => {
    setOperation(nextOperation);
    if (pendingPadEvaluation.current !== null && nextOperation === null) {
      pendingPadEvaluation.current = null;
      padEvaluationAttempt.current = false;
      return;
    }
    if (nextOperation === null && padEvaluationAttempt.current) {
      padEvaluationAttempt.current = false;
      return;
    }
    if (nextOperation === null) setEvaluatedOperand(false);
    padEvaluationAttempt.current = false;
  };

  const setResultFromPad = (nextResult) => {
    pendingPadEvaluation.current = typeof nextResult === 'number' && Number.isFinite(nextResult)
      ? String(nextResult)
      : null;
    setResult(nextResult);
  };

  const historyEntries = history.length === 0 ? (
    <p className="calculator-history__empty">No calculations yet.</p>
  ) : (
    <ol className="calculator-history__list" aria-label="Recent calculations, newest first">
      {history.map((entry, index) => {
        const formattedExpression = formatHistoryExpression(
          entry.expression,
          settings.displayDecimalPlaces,
        );
        const formattedResult = formatResult(entry.result, settings.displayDecimalPlaces);
        return (
          <li key={`${entry.expression}-${entry.result}-${index}`}>
            <button
              type="button"
              className="calculator-history__entry"
              aria-label={`${formattedExpression} equals ${formattedResult}`}
              onClick={() => restoreHistoryEntry(entry)}
            >
              <span className="calculator-history__expression">{formattedExpression}</span>
              <span className="calculator-history__result">= {formattedResult}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );

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
            <span>{operation == '√' && operation} {formatExpressionOperand(n1, evaluatedOperand, settings.displayDecimalPlaces)} {operation !== '√' && operation} {n2}</span>
          </div>
        </div>
        <button
          ref={historyTriggerRef}
          type="button"
          className="calculator-history-toggle"
          aria-haspopup="dialog"
          aria-controls="calculator-history-dialog"
          aria-expanded={historyDialogOpen}
          onClick={() => setHistoryDialogOpen(true)}
        >
          History
        </button>
        <NumberPad
          onEvaluation={({ numbers: evaluatedNumbers, operation: evaluatedOperation, evaluation }) => {
            padEvaluationAttempt.current = true;
            recordEvaluation(evaluatedNumbers, evaluatedOperation, evaluation);
          }}
          setOperation={setOperationFromPad}
          operation={operation}
          setNumberEditing={setNumberEditing}
          numberEditing={numberEditing}
          setNumbers={setNumbersFromPad}
          setResult={setResultFromPad}
          result={result}
          settings={settings}
          numbers={{n1, n2}}
        />
      </div>
      <section
        className={`calculator-history calculator-history--desktop${historyExpanded ? '' : ' calculator-history--collapsed'}`}
        aria-labelledby="calculator-history-heading"
        onClick={(event) => {
          if (
            !historyExpanded
            && !event.target.closest?.('button, .calculator-history__header')
          ) {
            setHistoryExpanded(true);
          }
        }}
      >
        <div
          className="calculator-history__header"
          onClick={() => setHistoryExpanded((expanded) => !expanded)}
        >
          <h2 id="calculator-history-heading">History</h2>
          <button
            type="button"
            className="calculator-history__visibility-toggle"
            aria-expanded={historyExpanded}
            aria-controls="calculator-history-content"
            aria-label={historyExpanded ? 'Hide history' : 'Show history'}
            onClick={(event) => {
              event.stopPropagation();
              setHistoryExpanded((expanded) => !expanded);
            }}
          >
            <FiChevronDown aria-hidden="true" focusable="false" />
          </button>
        </div>
        <div
          id="calculator-history-content"
          ref={historyContentRef}
          className={`calculator-history__collapsible${historyExpanded ? '' : ' calculator-history__collapsible--collapsed'}`}
          aria-hidden={!historyExpanded}
        >
          <div className="calculator-history__collapsible-inner">{historyEntries}</div>
        </div>
      </section>
      <dialog
        id="calculator-history-dialog"
        ref={historyDialogRef}
        className="calculator-history-dialog"
        aria-labelledby="calculator-history-dialog-heading"
        onCancel={(event) => {
          event.preventDefault();
          closeHistoryDialog();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeHistoryDialog();
        }}
      >
        <div className="calculator-history-dialog__header">
          <h2 id="calculator-history-dialog-heading">History</h2>
          <button
            ref={historyCloseRef}
            type="button"
            className="calculator-history-dialog__close"
            aria-label="Close history"
            onClick={closeHistoryDialog}
          >
            <FiX aria-hidden="true" focusable="false" />
          </button>
        </div>
        {historyEntries}
      </dialog>
    </div>
  );
};

