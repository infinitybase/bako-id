export function generateColor() {
  // Storing all letter and digit combinations
  // for html color code
  const letters = '0123456789ABCDEF';

  // HTML color code starts with #
  let color = '#';

  // Generating 6 times as HTML color code
  // consist of 6 letter or digits
  for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];

  return color;
}
