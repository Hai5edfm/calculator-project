import React from "react";
import '../../styles/components/Buttons/index.css';
import {
  add,
  subtract,
  multiply,
  divide,
  modulo,
  exponent,
  factorial,
  squareRoot,
  square
} from '../../utils/operations';


export const NumberPad = ({
  numbers,
  setNumbers,
  isDecimal,
  setIsDecimal,
  setOperation, 
  operation,
  numberEditing, 
  setNumberEditing, 
  setResult, 
  result
}) => {

  const {n1, n2} = numbers;

  const handleEditing = (n) => {
    const ifNumberEditing = () => {
      if(numberEditing === 'n1') {
        // if it is decimal, it returns
        if(n === '.' && n1.includes('.')) return;
        if(n1 === '0') {
          setNumbers({n1: n, n2: null});
        } else {
          setNumbers({...numbers, n1: n1 + n});
        }
      } else {
        setNumbers({...numbers, n2: n2 + n});
      }
    }
    // if n1 and n2 are not empty, it will add the number to the string of numbers :D
    if(n1 != null || n2 != null) ifNumberEditing();
    // if numberEditing is n1 and is empty, n will be the value of n1
    if(numberEditing === 'n1' && n1 == null) setNumbers({...numbers, n1: n});
    // if numberEditing is n2 and is empty, n will be the value of n2
    if(numberEditing === 'n2' && n2 == null) setNumbers({...numbers, n2: n});
  }
    
  const handleOp = (op) => {
    setOperation(op);
    setNumberEditing('n2');
  }

  const handleClear = () => {
    setNumbers({n1: '0', n2: null});
    setIsDecimal(false);
    setOperation(null);
    setNumberEditing('n1');
  }
  const handleDelete = () => {
    if(numberEditing === 'n1') {
      if(n1.length === 1) {
        setNumbers({...numbers, n1: '0'});
      } else {
        setNumbers({...numbers, n1: n1.slice(0, -1)});
      }
    } else {
      if(n2.length === 1) {
        setNumbers({...numbers, n2: null});
      } else {
        setNumbers({...numbers, n2: n2.slice(0, -1)});
      }
    }
  }
  
  const handleResult = () => {
    if(n1 == null || n2 == null) return;
    let num1 = parseFloat(numbers.n1);
    let num2 = parseFloat(numbers.n2);
    const getResult = () => { 
      switch(operation) {
        case '+': return add(num1, num2);
        case '-': return subtract(num1, num2);
        case '*': return multiply(num1, num2);
        case '/': return divide(num1, num2);
        case '%': return modulo(num1, num2);
        case '^': return exponent(num1, num2);
        case '!': return factorial(num1);
        case '√': return squareRoot(num1);
        case '²': return square(num1);
        default: return 'error';
      }
    } 
    setResult(getResult());
    setNumbers({n1: getResult(), n2: null});
    setIsDecimal(false);
    setOperation(null);
    setNumberEditing('n1');
  }

  return(
    <ul className="buttonsList">
      <li>
        <button
          onClick={() => { handleOp('!') }}
          className={"operationBtn"} children={'x!'}
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
          onClick={() => { handleOp('+') }}
          className={"operationBtn"} children={'+'}
        />
      </li>
      <li>
        <button 
          onClick={() => {setNumbers({n1: result, n2: null})}}
          className={"operationBtn"} 
          children={'Ans'}
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
          onClick={() => { handleOp('*') }}
          className={"operationBtn"} children={'x'}
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
          onClick={() => {
            handleEditing('.');
            setIsDecimal(true);
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
      <li className="equalBtn">
        <button
          onClick={handleResult}
          className={"operationBtn"} children={'='}
        />
      </li>
    </ul>
  );
};


