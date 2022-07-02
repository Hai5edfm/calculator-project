
//operations 

export const add = (a, b) => (a + b).toFixed(3);
export const subtract = (a, b) => (a - b).toFixed(3);
export const multiply = (a, b) => (a * b).toFixed(3);
export const divide = (a, b) => (a / b).toFixed(3);
export const modulo = (a, b) => (a % b).toFixed(3);
export const exponent = (a, b) => (a ** b).toFixed(3);
export const factorial = (a) => {
    if (a === 0) {
        return 1;
    }
    return a * factorial(a - 1);
}
export const squareRoot = (a) => (Math.sqrt(a)).toFixed(3);
export const square = (a) => (a ** 2).toFixed(3);

