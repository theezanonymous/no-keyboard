import { state } from "./state.js";
import { el, setCalibratingUI, setCalibratedUI } from "./ui.js";

export function initCalibrationHandlers() {
  el.calibrateBtn.addEventListener("click", () => {
    state.isCalibrating = !state.isCalibrating;

    if (state.isCalibrating) {
      state.keyboardCorners = [];
      alert("Click 4 corners: Top-Left, Top-Right, Bottom-Right, Bottom-Left");
      setCalibratingUI(true);
    } else {
      setCalibratingUI(false);
    }
  });

  el.canvas.addEventListener("click", (e) => {
    if (!state.isCalibrating) return;

    const rect = el.canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    state.keyboardCorners.push({ x, y });

    const n = state.keyboardCorners.length;
    el.calibrationStatus.textContent = `Calibrating: ${n}/4 corners`;

    if (n === 4) {
      state.isCalibrating = false;
      setCalibratingUI(false);
      setCalibratedUI();
      alert("Calibration complete! Check that the green grid aligns with your keyboard.");
    }
  });
}
