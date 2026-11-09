/**
 * Turn an issue title into a URL-friendly slug.
 *
 * Accents are stripped from Latin letters, everything is lowercased, and any
 * run of characters other than a-z / 0-9 collapses to a single dash. Leading
 * and trailing dashes are removed. Non-Latin scripts are not transliterated.
 *
 * @param {string} title
 * @returns {string}
 */
export function slugify(title) {
  return String(title)
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default slugify;
