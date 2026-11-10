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
