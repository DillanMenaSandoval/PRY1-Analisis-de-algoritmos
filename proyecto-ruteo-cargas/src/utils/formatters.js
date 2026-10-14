const LOCALE = 'es-MX';

const numberFormatter = new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 2 });
const percentFormatter = new Intl.NumberFormat(LOCALE, {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const millisecondsFormatter = new Intl.NumberFormat(LOCALE, {
  minimumFractionDigits: 3,
  maximumFractionDigits: 3,
});

export function formatNumber(value) {
  return numberFormatter.format(value);
}

export function formatPercent(value) {
  return `${percentFormatter.format(value)} %`;
}

export function formatMilliseconds(value) {
  return `${millisecondsFormatter.format(value)} ms`;
}

export function formatCoordinates(x, y) {
  return `(${formatNumber(x)}, ${formatNumber(y)})`;
}
