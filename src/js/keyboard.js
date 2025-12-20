import { clamp01, lerp2, pointInPoly } from "./utils.js";

export const keyboardLayout = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

export function pointInKeyboard(x, y, corners) {
  if (!corners || corners.length !== 4) return false;
  return pointInPoly({ x, y }, corners);
}

export function quadUV(x, y, corners) {
  const [TL, TR, BR, BL] = corners;

  let v = (y - TL.y) / (BL.y - TL.y + 1e-12);
  v = clamp01(v);

  const L = lerp2(TL, BL, v);
  const R = lerp2(TR, BR, v);

  let u = (x - L.x) / (R.x - L.x + 1e-12);
  u = clamp01(u);

  return { u, v };
}

export function getKeyAtPoint(x, y, corners, returnInfo = false) {
  if (!pointInKeyboard(x, y, corners)) {
    return returnInfo ? { row: "Out", col: "Out", key: null } : null;
  }

  const { u, v } = quadUV(x, y, corners);

  const rowIdx = Math.min(2, Math.floor(v * 3));
  const row = keyboardLayout[rowIdx];

  const colIdx = Math.min(row.length - 1, Math.floor(u * row.length));
  const key = row[colIdx];

  return returnInfo ? { row: rowIdx, col: colIdx, key } : key;
}
