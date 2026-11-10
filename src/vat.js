/**
 * VAT helpers for invoices. Money is integer cents, never floats.
 *
 * VAT is rounded once on the invoice total (not per line), half away from
 * zero. Rates may have up to two decimals (e.g. 7.7); the arithmetic is done
 * in BigInt so no float error creeps in.
 */

function rateToBasisPoints(ratePercent) {
  if (typeof ratePercent !== 'number' || !Number.isFinite(ratePercent) || ratePercent < 0) {
    throw new RangeError(`ratePercent must be a finite, non-negative number, got ${ratePercent}`);
  }
  const bp = Math.round(ratePercent * 100);
  if (Math.abs(bp - ratePercent * 100) > 1e-6) {
    throw new RangeError(`ratePercent supports at most two decimals, got ${ratePercent}`);
  }
  return BigInt(bp);
}

function sumCents(lineCents) {
  if (!Array.isArray(lineCents)) {
    throw new TypeError('lineCents must be an array of integer cents');
  }
  let total = 0n;
  for (const cents of lineCents) {
    if (!Number.isSafeInteger(cents)) {
      throw new TypeError(`each line must be integer cents, got ${cents}`);
    }
    total += BigInt(cents);
  }
  return total;
}

/**
 * The VAT of an invoice in integer cents.
 *
 * @param {number[]} lineCents line amounts in integer cents; refunds are negative
 * @param {number} ratePercent VAT rate in percent, e.g. 19
 * @returns {number} VAT in integer cents, rounded half away from zero
 */
export function vatTotal(lineCents, ratePercent) {
  const numerator = sumCents(lineCents) * rateToBasisPoints(ratePercent);
  const denominator = 10000n; // percent (100) × basis-point scale (100)
  const negative = numerator < 0n;
  const abs = negative ? -numerator : numerator;
  let quotient = abs / denominator;
  if ((abs % denominator) * 2n >= denominator) quotient += 1n;
  const result = Number(negative ? -quotient : quotient);
  return result === 0 ? 0 : result; // never return -0
}

/**
 * Format integer cents as "1,234.50 EUR"; negatives get a leading minus.
 *
 * @param {number} cents
 * @param {string} currency ISO 4217 code
 * @returns {string}
 */
function formatCents(cents, currency) {
  const negative = cents < 0;
  const abs = BigInt(Math.abs(cents));
  const units = (abs / 100n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const fraction = (abs % 100n).toString().padStart(2, '0');
  return `${negative ? '-' : ''}${units}.${fraction} ${currency}`;
}

/**
 * The VAT of an invoice formatted for the invoice page, e.g. "6.75 EUR".
 *
 * @param {number[]} lineCents
 * @param {number} ratePercent
 * @param {string} currency ISO 4217 code, e.g. "EUR"
 * @returns {string}
 */
export function formatVat(lineCents, ratePercent, currency) {
  if (typeof currency !== 'string' || !/^[A-Z]{3}$/.test(currency)) {
    throw new TypeError(`currency must be a three-letter ISO code, got ${currency}`);
  }
  return formatCents(vatTotal(lineCents, ratePercent), currency);
}
