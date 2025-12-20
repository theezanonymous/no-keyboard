import { state } from "./state.js";
import { el, setCameraUI, setTrackingUI, resetTypedUI } from "./ui.js";
import { initSettingsUI } from "./settings.js";
import { initHands } from "./mediapipe.js";
import { initCalibrationHandlers } from "./calibration.js";
import { resetTrackingState } from "./detection.js";

function initCameraControls() {
  el.toggleCameraBtn.addEventListener("click", async () => {
    if (!state.cameraActive) {
      try {
        state.camera = new Camera(el.video, {
          onFrame: async () => {
            await state.hands.send({ image: el.video });
          },
          width: 1280,
          height: 720,
        });

        await state.camera.start();
        setCameraUI(true);
      } catch (err) {
        alert("Camera access denied: " + err.message);
      }
    } else {
      if (state.camera) state.camera.stop();
      state.camera = null;
      state.isTracking = false;
      setTrackingUI(false);
      setCameraUI(false);
    }
  });
}

function initTrackingControls() {
  el.trackingBtn.addEventListener("click", () => {
    const next = !state.isTracking;
    setTrackingUI(next);
    if (next) resetTrackingState();
  });

  el.clearText.addEventListener("click", () => {
    state.typedText = "";
    state.keyPressCount = 0;
    resetTypedUI();
  });
}

window.addEventListener("load", () => {
  initSettingsUI();
  initHands();
  initCameraControls();
  initCalibrationHandlers();
  initTrackingControls();
});
