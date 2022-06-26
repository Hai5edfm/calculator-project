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
} from '../../utils/operations'


export const NumberPad = ({setNumbers, setResult, numbers}) => {
  const {n1, n2} = numbers;

  return(
    <ul className="buttonsList">
      <li>
        <button className={"operationBtn"} children={'('}/>
      </li>
      <li>
        <button className={"operationBtn"} children={')'}/>
      </li>
      <li>
        <button className={"operationBtn"} children={'√'}/>
      </li>
      <li>
        <button className={"operationBtn"} children={'÷'}/>
      </li>
      <li>
        <button className={"operationBtn"} children={'AC'}/>
      </li>
      <li>
        <button 
          onClick={() => { 
            n1 !== null 
              ? setNumbers({...numbers, n2: 7})
              : setNumbers({...numbers, n1: 7})
          }}
          className={"numberBtn"} children={'7'}
        />
      </li>
      <li>
        <button className={"numberBtn"} children={'8'}/>
      </li>
      <li>
        <button className={"numberBtn"} children={'9'}/>
      </li>
      <li>
        <button className={"operationBtn"} children={'+'}/>
      </li>
      <li>
        <button className={"operationBtn"} children={'^2'}/>
      </li>
      <li>
        <button className={"numberBtn"} children={'4'}/>
      </li>
      <li>
        <button className={"numberBtn"} children={'5'}/>
      </li>
      <li>
        <button className={"numberBtn"} children={'6'}/>
      </li>
      <li>
        <button className={"operationBtn"} children={'x'}/>
      </li>
      <li>
        <button className={"operationBtn"} children={'π'}/>
      </li>
      <li>
        <button className={"numberBtn"} children={'1'}/>
      </li>
      <li>
        <button className={"numberBtn"} children={'2'}/>
      </li>
      <li>
        <button className={"numberBtn"} children={'3'}/>
      </li>
      <li>
        <button className={"operationBtn"} children={'-'}/>
      </li>
      <li>
        <button className={"operationBtn"} children={'x!'}/>
      </li>
      <li>
        <button className={"operationBtn"} children={'Ans'}/>
      </li>
      <li>
        <button className={"numberBtn"} children={'0'}/>
      </li>
      <li>
        <button className={"operationBtn"} children={'.'}/>
      </li>
      <li className="equalBtn">
        <button className={"operationBtn"} children={'='}/>
      </li>
    </ul>
  );
};


