/**
 * Generates a URL-safe slug from a name string.
 * NFD normalization decomposes most Vietnamese diacritics into base + combining mark;
 * stripping U+0300–U+036F removes the combining marks. 'đ' (U+0111) does not
 * decompose via NFD and is handled explicitly.
 *
 * Sliced to 240 chars to leave room for a -CODE suffix (6 chars) in public URLs.
 */
export function generateSlug(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip combining diacritics (handles most Vietnamese)
    .replace(/[đĐ]/g, 'd')           // đ (U+0111) has no NFD decomposition
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 240);
}

const SLUG_REGEX = /^[a-z0-9][a-z0-9-]*$/;

/** Returns true if slug meets the format constraint. Min length 2, max 255. */
export function isValidSlug(slug: string): boolean {
  return slug.length >= 2 && slug.length <= 255 && SLUG_REGEX.test(slug);
}
