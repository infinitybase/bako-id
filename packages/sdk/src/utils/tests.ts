export function randomName(size = 5) {
  const name = (Math.random() + 2).toString(32).substring(2);
  return `${name}`.slice(0, size);
}
