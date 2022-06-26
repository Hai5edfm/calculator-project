import React from "react";
import { NumberPad } from "../../components/Buttons"
import '../../styles/containers/Calculator/index.css';

export const Calculator = () => {
  const [result, setResult] = React.useState(0);
  const [{n1, n2}, setNumbers] = React.useState({n1: null, n2: null});

  const handleNumbers = () => {
    if(n1 !== null) {
      return 0
    } else {
      if(n2 !== null) {
        return n1 + n2
      }
    }
  }
  return(
    <div className="calculator-container">
      <div className="display">
        <input type={'text'} id='display' defaultValue={'0'} />
        <p>{result}</p>
      </div>
      <NumberPad
        setNumbers={setNumbers} 
        setResult={setResult}
        numbers={{n1, n2}}
      />
    </div>
  );
};

