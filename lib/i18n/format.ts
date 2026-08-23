/** Substitutes `{key}` placeholders in a translation string. Kept tiny and
 * dependency-free — this app only ever needs simple value interpolation,
 * never plurals or ICU-style formatting. */
export function format(template: string, params: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    const value = params[key];
    return value === undefined ? match : String(value);
  });
}
