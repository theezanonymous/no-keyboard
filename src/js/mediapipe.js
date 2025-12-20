import { state } from "./state.js";
import { el, setHandsDetected, setLoaded } from "./ui.js";
import { drawCalibration, drawHands } from "./draw.js";
import { detectKeyPresses } from "./detection.js";

export function initHands() {
  state.hands = new Hands({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
  });

  state.hands.setOptions({
    maxNumHands: 2,
    modelComplexity: 1,
    minDetectionConfidence: 0.6,
    minTrackingConfidence: 0.6,
  });

  state.hands.onResults(onResults);
  setLoaded();
}

function onResults(results) {
  const ctx = el.canvas.getContext("2d");

  el.canvas.width = results.image.width;
  el.canvas.height = results.image.height;

  ctx.save();
  ctx.clearRect(0, 0, el.canvas.width, el.canvas.height);
  ctx.drawImage(results.image, 0, 0, el.canvas.width, el.canvas.height);

  drawCalibration(ctx, el.canvas, state.keyboardCorners);

  const hasHands = !!(results.multiHandLandmarks && results.multiHandLandmarks.length > 0);
  setHandsDetected(hasHands);

  if (hasHands) {
    for (const landmarks of results.multiHandLandmarks) {
      drawHands(ctx, landmarks);
      if (state.isTracking && state.keyboardCorners?.length === 4) {
        detectKeyPresses(landmarks);
      }
    }
  }

  ctx.restore();
}
