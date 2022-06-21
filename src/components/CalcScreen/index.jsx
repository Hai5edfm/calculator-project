import React, { useState } from 'react';

export const CalcScreen = ({operation, ans}) => {
  const [result, setResult] = useState();
  return(
    <div>
      <p>{ans}</p>
      <p>{operation}</p>
      <p>{result}</p>
    </div>
  );
};
