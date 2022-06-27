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
  square,
  cube
} from '../../utils/operations';


export const NumberPad = ({
  numbers,
  setNumbers,
  isDecimal,
  setIsDecimal,
  setOperation, 
  numberEditing, 
  setNumberEditing, 
  setResult}) => {

  const {n1, n2} = numbers;

  const handleEditing = (n) => {
    const ifNumberEditing = () => {
      numberEditing === 'n1' 
        ? setNumbers({...numbers, n1: n1 + n}) 
        : setNumbers({...numbers, n2: n2 + n})
    }
    if(n === '.' && isDecimal) return;
    if(numberEditing === 'n1' && n1 == null) setNumbers({...numbers, n1: n});
    if(numberEditing === 'n2' && n2 == null) setNumbers({...numbers, n2: n});
    if(n1 != null && n2 != null) ifNumberEditing();
  }
    
  const handleOp = (op) => {
    setOperation(op);
    setNumberEditing('n2');
  }

  return(
    <ul className="buttonsList">
      <li>
        <button className={"operationBtn"} children={'π'}/>
      </li>
      <li>
        <button
          onClick={() => { handleOp('x!') }}
          className={"operationBtn"} children={'x!'}
        />
      </li>
      <li>
        <button
          onClick={() => { handleOp('√') }}
          className={"operationBtn"} children={'√'}
        />
      </li>
      <li className="clearBtn">
        <button
          onClick={() => { setNumbers({n1: null, n2: null}); setOperation(null) }}
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
          onClick={() => { handleOp('÷') }}
          className={"operationBtn"} children={'÷'}
        />
      </li> 
      <li>
        <button
          className={"operationBtn"} children={'^2'}
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
        <button className={"operationBtn"} children={'Ans'}/>
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
          onClick={() => { handleOp('x') }}
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
          className={"operationBtn"} children={'='}
        />
      </li>
    </ul>
  );
};


