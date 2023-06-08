const HEX_SET = "0123456789ABCDEF";
/**
 * Generate a random colour hex from "#000000" to "#FFFFFF"
 */
export default function randomColorHex(): string {
  let col = "#";
  const hexLen = HEX_SET.length;
  for (let i = 0; i < 6; i++) {
    col += HEX_SET[Math.floor(Math.random() * hexLen)];
  }
  return col;
}
