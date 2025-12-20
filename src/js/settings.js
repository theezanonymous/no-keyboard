import { state } from "./state.js";
import { el } from "./ui.js";

function bindRange(id, valueId, parseFn, key) {
  const input = document.getElementById(id);
  const label = document.getElementById(valueId);

  input.addEventListener("input", (e) => {
    const val = parseFn(e.target.value);
    state.settings[key] = val;
    label.textContent = e.target.value;
  });
}

export function initSettingsUI() {
  bindRange("pressThreshold", "pressThresholdValue", parseFloat, "pressThreshold");
  bindRange("liftThreshold", "liftThresholdValue", parseFloat, "liftThreshold");
  bindRange("debounceTime", "debounceTimeValue", (v) => parseInt(v, 10), "debounceTime");
  bindRange("velocityWeight", "velocityWeightValue", parseFloat, "velocityWeight");
  bindRange("minPressTime", "minPressTimeValue", (v) => parseInt(v, 10), "minPressTime");
  bindRange("smoothingFrames", "smoothingFramesValue", (v) => parseInt(v, 10), "smoothingFrames");

  el.toggleSettingsBtn.addEventListener("click", () => {
    const hidden = el.settingsPanel.classList.contains("hidden");
    el.settingsPanel.classList.toggle("hidden", !hidden);
    el.toggleSettingsBtn.textContent = hidden ? "Hide Settings" : "Show Settings";
  });
}
