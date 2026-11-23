/** Same projection as scripts/build-map.mjs (equirectangular, lon 0–135, lat 15–72, x × cos 45°). */
const KX = Math.cos((45 * Math.PI) / 180);
const K = 1000 / (135 * KX);
export function project(lon: number, lat: number) {
  return { x: Math.round(lon * KX * K * 10) / 10, y: Math.round((72 - lat) * K * 10) / 10 };
}
export function curve(a: { x: number; y: number }, b: { x: number; y: number }, bend = -0.2) {
  const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
  const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1;
  const cx = mx + (-dy / len) * len * bend, cy = my + (dx / len) * len * bend;
  return `M${a.x} ${a.y}Q${cx.toFixed(1)} ${cy.toFixed(1)} ${b.x} ${b.y}`;
}
