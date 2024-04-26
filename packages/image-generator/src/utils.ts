export const isValidDomain = (domain: string): boolean =>
  /^@?[a-zA-Z0-9_]+$/.test(domain);

export function splitWordIntoParts(word: string, partSize: number) {
  const parts = [];
  for (let i = 0; i < word.length; i += partSize) {
    parts.push(word.substring(i, i + partSize));
  }
  return parts;
}
