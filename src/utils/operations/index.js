
//operations 

export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
export const multiply = (a, b) => a * b;
export const divide = (a, b) => a / b;
export const modulo = (a, b) => a % b;
export const exponent = (a, b) => a ** b;
export const factorial = (a) => {
    if (a === 0) {
        return 1;
    }
    return a * factorial(a - 1);
}
export const squareRoot = (a) => Math.sqrt(a);
export const square = (a) => a ** 2;
export const cube = (a) => a ** 3;

