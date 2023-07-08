
/**
 * Generate a random colour style.
 */
export default function randomColorStyle(s: number = 1, l: number = 0.5): string {
  const h = Math.random() * 360;
  s = Math.min(Math.max(s, 0), 1) * 100;
  l = Math.min(Math.max(l, 0), 1) * 100;
  return `hsl(${h}, ${s}%, ${l}%)`
}
