
export const sum = (numbers) => {
  let result = 0;
  numbers.forEach(n => result += n);
  return result
}

export const subtraction = (numbers) => {
  let result;
  numbers.map(n => result -= n);
  return result
}


export const getOperation = ({operation, numbers}) => {
  switch (operation) {
    case 'sum':
      sum(numbers)
      break;
    case 'subtract':
      subtraction(numbers)
      break;
    default:
      break;
  }
}

