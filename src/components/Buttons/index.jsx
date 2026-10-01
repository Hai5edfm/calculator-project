import React from "react";
import '../../styles/components/Buttons/index.css';
import {
  appendInput,
  deleteOperand,
  evaluateExpression,
  resetCalculator,
  evaluationToState,
} from '../../utils/calculator';


export const NumberPad = ({
  numbers,
  onEvaluation,
  setNumbers,
  setOperation, 
  operation,
  numberEditing, 
  setNumberEditing, 
  setResult, 
  result,
  settings
}) => {

  const {n1, n2} = numbers;

  const handleEditing = (input) => {
    if (numberEditing === 'n2' && (operation === '√' || operation === '²')) return;
    setNumbers(appendInput(
      numbers,
      numberEditing,
      input,
      settings.maxInputFractionalDigits,
    ));
  };

  const handleOp = (op) => {
    setOperation(op);
    setNumberEditing('n2');
  };

  const handleClear = () => {
    const reset = resetCalculator();
    setNumbers(reset.numbers);
    setOperation(reset.operation);
    setNumberEditing(reset.numberEditing);
    setResult(reset.result);
  };

  const handleDelete = () => {
    setNumbers(deleteOperand(numbers, numberEditing));
  };

  const handleResult = () => {
    const evaluation = evaluateExpression({ numbers, operation });
    onEvaluation?.({ numbers, operation, evaluation });
    const nextState = evaluationToState(
      evaluation,
      { numbers, operation, numberEditing, result },
    );
    setResult(nextState.result);
    setNumbers(nextState.numbers);
    setOperation(nextState.operation);
    setNumberEditing(nextState.numberEditing);
  };

  const handleAns = () => {
    if (typeof result !== 'number' || !Number.isFinite(result)) return;
    const operand = numberEditing;
    setNumbers({ ...numbers, [operand]: String(result) });
  };

  return(
    <ul className="buttonsList">
      <li>
        <button
          onClick={() => { handleOp('^') }}
          className={"operationBtn"} children={'^'}
        />
      </li>
      <li>
        <button
          onClick={() => { handleOp('√') }}
          className={"operationBtn"} children={'√'}
        />
      </li>
      <li>
        <button
          onClick={() => { handleOp('²') }}
          className={"operationBtn"} children={'²'}
        />
      </li> 
      <li className="clearBtn">
        <button
          onClick={handleClear}
          className={"operationBtn"} children={'AC'}
        />
      </li>
      <li>
        <button 
          onClick={() => {handleEditing('7')}}
          className={"numberBtn"} children={'7'}
        />
      </li>
      <li>
        <button
          onClick={() => {handleEditing('8')}}
          className={"numberBtn"} children={'8'}
        />
      </li>
      <li>
        <button 
          onClick={() => {handleEditing('9')}}
          className={"numberBtn"} children={'9'}
        />
      </li>
      <li>
        <button
          onClick={() => { handleOp('/') }}
          className={"operationBtn"} children={'÷'}
        />
      </li> 
      <li>
        <button
          onClick={handleDelete}
          className={"operationBtn"} children={'DEL'}
        />
      </li> 
      <li>
        <button
          onClick={() => {handleEditing('4')}}
          className={"numberBtn"} children={'4'}
        />
      </li>
      <li>
        <button
          onClick={() => {handleEditing('5')}}
          className={"numberBtn"} children={'5'}
        />
      </li>
      <li>
        <button
          onClick={() => {handleEditing('6')}}
          className={"numberBtn"} children={'6'}
        />
      </li> 
      <li>
        <button
          onClick={() => { handleOp('-') }}
          className={"operationBtn"} children={'-'}
        />
      </li>
      <li>
        <button
          onClick={() => {handleOp('%')}}
          className={"operationBtn"} children={'mod'}
        />
      </li>
      <li>
        <button
          onClick={() => {handleEditing('1')}}
          className={"numberBtn"} children={'1'}
        />
      </li>
      <li>
        <button
          onClick={() => {handleEditing('2')}}
          className={"numberBtn"} children={'2'}
        />
      </li>
      <li>
        <button
          onClick={() => {handleEditing('3')}}
          className={"numberBtn"} children={'3'}
        />
      </li>
      <li>
        <button
          onClick={() => { handleOp('+') }}
          className={"operationBtn"} children={'+'}
        />
      </li>
      <li>
        <button
          onClick={() => { handleOp('*') }}
          className={"operationBtn"} children={'x'}
        />
      </li>
      <li>
        <button
          onClick={() => {
            handleEditing('.');
          }}
          className={"operationBtn"} children={'.'}
        />
      </li>
      <li>
        <button
          onClick={() => {handleEditing('0')}}
          className={"numberBtn"} children={'0'}
        />
      </li>
      <li>
        <button 
          onClick={() => {handleAns()}}
          className={"operationBtn"} 
          children={'Ans'}
        />
      </li>
      <li className="equalBtn">
        <button
          onClick={handleResult}
          className={"operationBtn"} children={'='}
        />
      </li>
    </ul>
  );
};


