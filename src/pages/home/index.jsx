import React, { useState } from 'react';
import { NumberPad } from '../../components/Buttons';

const Home = () => {
  let [numbersFrom, setNumbersFrom] = useState('');
  let numbers = numbersFrom.split(',').map(n => parseInt(n))
  let [result, setResult] = useState(0);
  return(
    <React.Fragment>
      <p> hola home </p>
      <input onChange={e => setNumbersFrom(e.target.value)} type={'text'} id='display' defaultValue={'0'}/>
      <p>{result}</p>
      <NumberPad/>
    </React.Fragment>
  );
};

export { Home }

