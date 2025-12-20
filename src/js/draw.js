import { keyboardLayout } from "./keyboard.js";
import { lerp2 } from "./utils.js";

export function drawCalibration(ctx, canvas, corners) {
  if (!corners || corners.length !== 4) return;

  const [TL, TR, BR, BL] = corners;

  // Outer boundary
  ctx.strokeStyle = "#00ff00";
  ctx.lineWidth = 3;
  ctx.beginPath();
  corners.forEach((c, i) => {
    const x = c.x * canvas.width;
    const y = c.y * canvas.height;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.stroke();

  // Grid lines + labels
  ctx.strokeStyle = "rgba(0,255,0,0.5)";
  ctx.lineWidth = 1;
  ctx.font = "12px monospace";
  ctx.fillStyle = "#00ff00";

  // Row dividers
  for (let i = 1; i < 3; i++) {
    const t = i / 3;
    const L = lerp2(TL, BL, t);
    const R = lerp2(TR, BR, t);
    ctx.beginPath();
    ctx.moveTo(L.x * canvas.width, L.y * canvas.height);
    ctx.lineTo(R.x * canvas.width, R.y * canvas.height);
    ctx.stroke();
  }

  // Per-row vertical dividers + key labels
  for (let r = 0; r < 3; r++) {
    const row = keyboardLayout[r];
    const vMid = (r + 0.5) / 3;
    const v1 = r / 3;
    const v2 = (r + 1) / 3;

    const L1 = lerp2(TL, BL, v1);
    const R1 = lerp2(TR, BR, v1);
    const L2 = lerp2(TL, BL, v2);
    const R2 = lerp2(TR, BR, v2);
    const Lm = lerp2(TL, BL, vMid);
    const Rm = lerp2(TR, BR, vMid);

    for (let i = 1; i < row.length; i++) {
      const u = i / row.length;
      const A = lerp2(L1, R1, u);
      const B = lerp2(L2, R2, u);
      ctx.beginPath();
      ctx.moveTo(A.x * canvas.width, A.y * canvas.height);
      ctx.lineTo(B.x * canvas.width, B.y * canvas.height);
      ctx.stroke();
    }

    row.forEach((key, c) => {
      const uMid = (c + 0.5) / row.length;
      const P = lerp2(Lm, Rm, uMid);
      ctx.fillText(key, P.x * canvas.width - 4, P.y * canvas.height + 4);
    });
  }
}

export function drawHands(ctx, landmarks) {
  // Use MediaPipe's global HAND_CONNECTIONS if present
  drawConnectors(ctx, landmarks, HAND_CONNECTIONS, { color: "#00FF00", lineWidth: 2 });
  drawLandmarks(ctx, landmarks, { color: "#FF0000", lineWidth: 1, radius: 3 });

  [4, 8, 12, 16, 20].forEach((idx) => {
    const tip = landmarks[idx];
    ctx.beginPath();
    ctx.arc(tip.x * ctx.canvas.width, tip.y * ctx.canvas.height, 8, 0, 2 * Math.PI);
    ctx.strokeStyle = "#FFD700";
    ctx.lineWidth = 2;
    ctx.stroke();
  });
}
