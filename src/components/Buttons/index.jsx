import React from "react";
import '../../styles/components/Buttons/index.css';

export const NumberPad = () => {
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
        <button className={"numberBtn"} children={'7'}/>
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


