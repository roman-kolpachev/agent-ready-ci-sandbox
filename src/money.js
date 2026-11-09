/**
 * Format an amount of money for invoices.
 *
 * Amounts are integer cents (123450 is 1,234.50), never floats. The result
 * has thousands separators, exactly two decimals and the ISO currency code
 * after the number. Negative amounts get a minus sign before the number.
 *
 *   formatMoney(123450, 'EUR')  // '1,234.50 EUR'
 *   formatMoney(-5, 'EUR')      // '-0.05 EUR'
 *   formatMoney(0, 'EUR')       // '0.00 EUR'
 *
 * @param {number|bigint} cents  integer amount in cents
 * @param {string} currency      ISO 4217 code, such as EUR
 * @returns {string}
 */
export function formatMoney(cents, currency) {
  if (typeof cents === 'number' && !Number.isSafeInteger(cents)) {
    throw new TypeError(`Amount must be an integer number of cents, got ${cents}`);
  }
  if (typeof cents !== 'number' && typeof cents !== 'bigint') {
    throw new TypeError(`Amount must be an integer number of cents, got ${typeof cents}`);
  }
  if (typeof currency !== 'string' || !/^[A-Z]{3}$/.test(currency)) {
    throw new TypeError(`Currency must be a three-letter ISO code, got ${currency}`);
  }

  const value = BigInt(cents);
  const negative = value < 0n;
  const abs = negative ? -value : value;

  const whole = (abs / 100n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const fraction = (abs % 100n).toString().padStart(2, '0');

  return `${negative ? '-' : ''}${whole}.${fraction} ${currency}`;
}

export default formatMoney;
