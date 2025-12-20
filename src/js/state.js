export const state = {
  cameraActive: false,
  isCalibrating: false,
  isTracking: false,

  // Calibration corners in normalized coordinates: [TL, TR, BR, BL]
  keyboardCorners: null,

  // MediaPipe
  hands: null,
  camera: null,

  // Typing / metrics
  typedText: "",
  keyPressCount: 0,
  startTime: null,

  // Debounce per key
  lastKeyPress: {},

  // Finger press state + history (per finger)
  fingerState: {},
  fingerHistory: {},

  // Detection settings (tweakable in the UI)
  settings: {
    pressThreshold: 0.015,
    liftThreshold: 0.012,
    debounceTime: 250,
    velocityWeight: 0.6,
    minPressTime: 50,
    smoothingFrames: 3,
  },
};
