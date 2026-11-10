/**
 * Discount codes for invoices. All amounts are integer cents (12345 is 123.45).
 *
 * - SPRING10: 10% off the total; the discount is rounded half up to whole cents.
 * - LOYAL5:   a fixed 500 cents off.
 *
 * The result is never below 0.
 */

const DISCOUNTS = {
  // 10% of total, half up: floor((total * 10 + 50) / 100) === floor((total + 5) / 10)
  SPRING10: (totalCents) => Math.floor((totalCents + 5) / 10),
  LOYAL5: () => 500,
};

/**
 * Apply a discount code to an invoice total.
 *
 * @param {number} totalCents invoice total in integer cents
 * @param {string} code discount code, such as "SPRING10"
 * @returns {number} the total after the discount, in integer cents, never below 0
 * @throws {TypeError} when totalCents is not a safe integer
 * @throws {Error} "Unknown discount code" when the code is not known
 */
export function applyDiscount(totalCents, code) {
  if (!Number.isSafeInteger(totalCents)) {
    throw new TypeError('totalCents must be an integer number of cents');
  }
  if (typeof code !== 'string' || !Object.hasOwn(DISCOUNTS, code)) {
    throw new Error('Unknown discount code');
  }
  const discount = DISCOUNTS[code](totalCents);
  return Math.max(0, totalCents - discount);
}

export default applyDiscount;
