import { state } from "./state.js";

export const el = {
  video: document.getElementById("videoElement"),
  canvas: document.getElementById("canvasElement"),

  statusLoading: document.getElementById("statusLoading"),
  statusHands: document.getElementById("statusHands"),
  cameraPlaceholder: document.getElementById("cameraPlaceholder"),

  toggleCameraBtn: document.getElementById("toggleCamera"),
  calibrateBtn: document.getElementById("calibrateBtn"),
  trackingBtn: document.getElementById("trackingBtn"),

  toggleSettingsBtn: document.getElementById("toggleSettings"),
  settingsPanel: document.getElementById("settingsPanel"),

  calibrationStatus: document.getElementById("calibrationStatus"),
  debugInfo: document.getElementById("debugInfo"),

  typedText: document.getElementById("typedText"),
  recentKeys: document.getElementById("recentKeys"),
  keyCount: document.getElementById("keyCount"),
  wpmDisplay: document.getElementById("wpmDisplay"),

  detectedRow: document.getElementById("detectedRow"),
  detectedCol: document.getElementById("detectedCol"),
  detectedKey: document.getElementById("detectedKey"),

  clearText: document.getElementById("clearText"),
};

export function setLoaded() {
  el.statusLoading.className = "px-3 py-1 rounded text-sm bg-green-600";
  el.statusLoading.textContent = "✓ Hand Tracking Loaded";
}

export function setHandsDetected(on) {
  el.statusHands.className = on
    ? "px-3 py-1 rounded text-sm bg-green-600"
    : "px-3 py-1 rounded text-sm bg-slate-600";
  el.statusHands.textContent = on ? "✓ Hands Detected" : "○ No Hands Detected";
}

export function setCameraUI(active) {
  state.cameraActive = active;
  if (active) {
    el.cameraPlaceholder.classList.add("hidden");
    el.statusHands.classList.remove("hidden");
    el.toggleCameraBtn.textContent = "Stop Camera";
    el.toggleCameraBtn.className = "px-4 py-2 rounded-lg font-medium bg-red-600 hover:bg-red-700";
    el.calibrateBtn.disabled = false;
  } else {
    el.cameraPlaceholder.classList.remove("hidden");
    el.statusHands.classList.add("hidden");
    el.toggleCameraBtn.textContent = "Start Camera";
    el.toggleCameraBtn.className = "px-4 py-2 rounded-lg font-medium bg-blue-600 hover:bg-blue-700";
    el.calibrateBtn.disabled = true;

    el.trackingBtn.disabled = true;
    el.trackingBtn.textContent = "Start Tracking";
    el.trackingBtn.className = "flex-1 px-4 py-3 rounded-lg font-medium bg-green-600 hover:bg-green-700";
  }
}

export function setCalibratingUI(on) {
  state.isCalibrating = on;
  if (on) {
    el.calibrationStatus.textContent = "Click 4 corners...";
    el.calibrateBtn.textContent = "Calibrating...";
    el.calibrateBtn.className = "flex-1 px-4 py-3 rounded-lg font-medium bg-yellow-600 hover:bg-yellow-700";
  } else {
    el.calibrateBtn.textContent = "Calibrate Keyboard";
    el.calibrateBtn.className = "flex-1 px-4 py-3 rounded-lg font-medium bg-slate-700 hover:bg-slate-600";
  }
}

export function setCalibratedUI() {
  el.calibrationStatus.textContent = "Calibrated ✓";
  el.trackingBtn.disabled = false;
}

export function setTrackingUI(on) {
  state.isTracking = on;
  if (on) {
    el.trackingBtn.textContent = "Stop Tracking";
    el.trackingBtn.className = "flex-1 px-4 py-3 rounded-lg font-medium bg-red-600 hover:bg-red-700";
  } else {
    el.trackingBtn.textContent = "Start Tracking";
    el.trackingBtn.className = "flex-1 px-4 py-3 rounded-lg font-medium bg-green-600 hover:bg-green-700";
  }
}

export function resetTypedUI() {
  el.typedText.innerHTML = '<span class="text-slate-500">Start typing...</span>';
  el.keyCount.textContent = "0";
  el.wpmDisplay.textContent = "0";
  el.recentKeys.innerHTML = "";
}

export function updateTypedUI(text) {
  if (!text) {
    resetTypedUI();
    return;
  }
  el.typedText.textContent = text;
}

export function pushRecentKey(key) {
  const div = document.createElement("div");
  div.className = "bg-green-700 px-3 py-2 rounded font-mono text-lg animate-pulse";
  div.textContent = key;
  el.recentKeys.appendChild(div);

  setTimeout(() => {
    div.className = "bg-slate-700 px-3 py-2 rounded font-mono text-lg";
  }, 350);

  if (el.recentKeys.children.length > 6) {
    el.recentKeys.removeChild(el.recentKeys.firstChild);
  }
}

export function setDebug(text) {
  el.debugInfo.textContent = text || "";
}
