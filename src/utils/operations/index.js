
//operations 

export const add = (a, b) => handlingFixedDecimal(a + b);
export const subtract = (a, b) => handlingFixedDecimal(a - b);
export const multiply = (a, b) => handlingFixedDecimal(a * b);
export const divide = (a, b) => handlingFixedDecimal(a / b);
export const modulo = (a, b) => handlingFixedDecimal(a % b);
export const exponent = (a, b) => handlingFixedDecimal(Math.pow(a, b)); 
export const squareRoot = (a) => handlingFixedDecimal(Math.sqrt(a));
export const square = (a) => handlingFixedDecimal(a * a);

const handlingFixedDecimal = (num) => {
    let decimals = num.toString().split('.');
    if (decimals[1] == undefined) {
        return decimals[0];
    } else {
        return decimals[0] + '.' + decimals[1].substring(0, 3);
    }
}
