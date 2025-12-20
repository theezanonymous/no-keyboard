import { state } from "./state.js";
import { el, setDebug, pushRecentKey, updateTypedUI } from "./ui.js";
import { getKeyAtPoint, pointInKeyboard } from "./keyboard.js";

function computeWPM() {
  if (!state.startTime) return 0;
  const minutes = (Date.now() - state.startTime) / 60000;
  if (minutes <= 0) return 0;

  // Standard typing metric: (characters/5) / minutes
  return Math.round((state.typedText.length / 5) / minutes);
}

export function resetTrackingState() {
  state.typedText = "";
  state.keyPressCount = 0;
  state.startTime = Date.now();
  state.lastKeyPress = {};
  state.fingerState = {};
  state.fingerHistory = {};
  updateTypedUI("");
  el.keyCount.textContent = "0";
  el.wpmDisplay.textContent = "0";
}

export function detectKeyPresses(landmarks) {
  const fingerTips = [8, 12, 16, 20]; // index, middle, ring, pinky
  const now = Date.now();
  const corners = state.keyboardCorners;
  const S = state.settings;

  fingerTips.forEach((tipIdx, i) => {
    if (!corners || corners.length !== 4) return;

    const tip = landmarks[tipIdx];
    const tipX = tip.x, tipY = tip.y, tipZ = tip.z;

    if (!pointInKeyboard(tipX, tipY, corners)) return;

    const fingerId = `finger_${i}`;

    if (!state.fingerHistory[fingerId]) {
      state.fingerHistory[fingerId] = { positions: [], pressStartTime: null };
    }
    const history = state.fingerHistory[fingerId];

    history.positions.push({ z: tipZ, time: now });
    if (history.positions.length > S.smoothingFrames) history.positions.shift();

    const avgZ = history.positions.reduce((sum, p) => sum + p.z, 0) / history.positions.length;

    let velocity = 0;
    if (history.positions.length >= 2) {
      const a = history.positions[history.positions.length - 1];
      const b = history.positions[history.positions.length - 2];
      const dt = a.time - b.time;
      velocity = dt > 0 ? (a.z - b.z) / dt : 0;
    }

    const last = state.fingerState[fingerId] || { z: avgZ, pressed: false, baseline: avgZ };

    const zDiff = avgZ - last.baseline;
    const pressScore = zDiff + velocity * S.velocityWeight * 100;
    const liftScore = -zDiff + (-velocity) * S.velocityWeight * 100;

    const info = getKeyAtPoint(tipX, tipY, corners, true);
    if (info) {
      el.detectedRow.textContent = info.row;
      el.detectedCol.textContent = info.col;
      el.detectedKey.textContent = info.key || "-";
    }

    if (!last.pressed && pressScore > S.pressThreshold) {
      state.fingerState[fingerId] = { ...last, z: avgZ, pressed: true };
      history.pressStartTime = now;
      setDebug(`Finger ${i}: Press (score: ${pressScore.toFixed(4)})`);
      return;
    }

    if (last.pressed && liftScore > S.liftThreshold) {
      const pressDuration = now - (history.pressStartTime || now);

      if (pressDuration >= S.minPressTime) {
        const key = getKeyAtPoint(tipX, tipY, corners, false);
        if (key) registerKeyPress(key);
      }

      state.fingerState[fingerId] = { z: avgZ, pressed: false, baseline: avgZ };
      history.pressStartTime = null;
      setDebug(`Finger ${i}: Lift (duration: ${pressDuration}ms)`);
      return;
    }

    const stable = Math.abs(velocity) < 0.0001;
    if (!last.pressed && stable) {
      const alpha = 0.08;
      state.fingerState[fingerId] = {
        ...last,
        z: avgZ,
        baseline: last.baseline * (1 - alpha) + avgZ * alpha,
      };
    } else {
      state.fingerState[fingerId] = { ...last, z: avgZ };
    }
  });
}

function registerKeyPress(key) {
  const now = Date.now();
  const last = state.lastKeyPress[key] || 0;
  if (now - last < state.settings.debounceTime) return;

  state.lastKeyPress[key] = now;
  state.typedText += key;
  state.keyPressCount += 1;

  updateTypedUI(state.typedText);
  el.keyCount.textContent = String(state.keyPressCount);
  pushRecentKey(key);
  el.wpmDisplay.textContent = String(computeWPM());
  setDebug(`✓ Key pressed: ${key}`);
}
