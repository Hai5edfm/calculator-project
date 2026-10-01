# Calculator

A React calculator and unit converter built with Vite.

## Modes

Use the mode navigation to switch between **Calculator** and **Converter**. Each mode keeps its own input and controls, while the Settings panel remains available in either mode.

The Converter supports these categories and units:

- **Temperature:** Celsius (°C), Fahrenheit (°F), Kelvin (K)
- **Length:** millimeters (mm), centimeters (cm), meters (m), kilometers (km), inches (in), feet (ft), miles (mi)
- **Mass:** milligrams (mg), grams (g), kilograms (kg), ounces (oz), pounds (lb)

Choose a category and source/target units, or use Swap to reverse the conversion. Settings can cap newly entered fractional digits without changing existing values, and independently set the number of decimal places shown in results. The default input has no fractional-digit limit and results display up to 3 decimal places. Display rounding does not reduce the precision retained for calculations or conversions. The Calculator keeps the 10 most recent successful operations in browser storage, newest first. History expressions format recognized calculator-generated operands, as well as results, using the current decimal-place setting; older or unrecognized expression text remains visible unchanged. Formatting affects display only: selecting a history entry restores its full-precision result as the current value for continued calculations. On desktop, history appears in its own card to the right of the calculator, where the Show/Hide control collapses or expands the entries while keeping the card heading and control available. On narrower screens, the History button opens a modal dialog with animated reveal and dismissal; both desktop collapse and dialog motion respect the operating system's reduced-motion preference.

## Prerequisites

- Node.js 20 or newer
- pnpm

## Install

```sh
git clone https://github.com/Hai5edfm/calculator-project.git
cd calculator-project
pnpm install
```

## Development

```sh
pnpm dev
```

## Tests

```sh
pnpm test
```

## Production build

```sh
pnpm build
pnpm preview
```
