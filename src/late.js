/** Days after the due date that stay free of a late fee (day 14 is still free). */
export const GRACE_DAYS = 14;
/** Late fee rate in basis points: 1.5 % of the invoice total, charged once. */
export const LATE_FEE_BPS = 150;
/** Maximum late fee in cents. */
export const LATE_FEE_CAP_CENTS = 5000;

/**
 * Late fee for an overdue invoice, in integer cents.
 *
 * Rules agreed on SPR-8: no fee up to and including day 14; after that a
 * one-off fee of 1.5 % of the total, rounded half up to whole cents, capped
 * at 5000 cents. Integer arithmetic only, no floats.
 *
 * @param {number} totalCents invoice total in integer cents (>= 0)
 * @param {number} daysLate days past the due date
 * @returns {number} fee in integer cents
 */
export function lateFee(totalCents, daysLate) {
  if (!Number.isSafeInteger(totalCents) || totalCents < 0) {
    throw new RangeError('totalCents must be a non-negative integer');
  }
  if (daysLate <= GRACE_DAYS) return 0;
  // Round half up: floor((total * bps + 5000) / 10000), in BigInt to stay exact.
  const fee = (BigInt(totalCents) * BigInt(LATE_FEE_BPS) + 5000n) / 10000n;
  return Number(fee < BigInt(LATE_FEE_CAP_CENTS) ? fee : BigInt(LATE_FEE_CAP_CENTS));
}

/**
 * Subject line of the reminder e-mail for an overdue invoice.
 *
 * Wording agreed on SPR-8: "Reminder: invoice {invoiceNumber} is {daysLate}
 * days overdue", with "1 day overdue" for exactly one day.
 *
 * @param {string|number} invoiceNumber
 * @param {number} daysLate
 * @returns {string}
 */
export function reminderSubject(invoiceNumber, daysLate) {
  const unit = daysLate === 1 ? 'day' : 'days';
  return `Reminder: invoice ${invoiceNumber} is ${daysLate} ${unit} overdue`;
}
