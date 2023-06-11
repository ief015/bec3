
/**
 * Generate a random colour hex from "#000000" to "#FFFFFF"
 */
export default function randomBodyColor(): string {
  const h = Math.random() * 360;
  return `hsl(${h}, 100%, 50%)`
}
