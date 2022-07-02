import React from "react";
import { NumberPad } from "../../components/Buttons"
import '../../styles/containers/Calculator/index.css';

export const Calculator = () => {
  const [result, setResult] = React.useState(0);
  const [numberEditing, setNumberEditing] = React.useState('n1');
  const [operation, setOperation] = React.useState(null);
  const [{n1, n2}, setNumbers] = React.useState({n1: '0', n2: null});
  const [isDecimal, setIsDecimal] = React.useState(false);

  return(
    <div className="calculator-container">
      <div className="display">
        <p>{result}</p>
        <div id='display'>
          <span>{n1} {operation} {n2}</span>
        </div>
      </div>
      <NumberPad
        isDecimal={isDecimal}
        setIsDecimal={setIsDecimal}
        setOperation={setOperation}
        operation={operation}
        setNumberEditing={setNumberEditing}
        numberEditing={numberEditing}
        setNumbers={setNumbers} 
        setResult={setResult}
        result={result}
        numbers={{n1, n2}}
      />
    </div>
  );
};

