# Virtual Paper Keyboard Tracker (MediaPipe Hands)

A browser-based prototype that turns a **paper QWERTY keyboard** into a “virtual keyboard” using **MediaPipe Hands**.  
It detects fingertip presses over a calibrated paper keyboard area and shows:

- **Live camera feed** with hand landmarks
- **Calibrated keyboard overlay** + per-key labels
- **Detected key**, recent key history, and typed text
- **WPM estimate** (standard: `(characters / 5) / minute`)
- A **settings panel** to tune press/lift thresholds and smoothing

This version is refactored into small, readable modules under `./js/`.

---

## Demo flow

1. **Start Camera**
2. **Calibrate Keyboard**
   - Click 4 corners on the paper keyboard **in this order**:
     1) Top-left (above **Q**)  
     2) Top-right (above **P**)  
     3) Bottom-right (below **M**)  
     4) Bottom-left (below **Z**)
3. Confirm the **green grid** aligns with your paper keys.
4. **Start Tracking** and tap keys.

---

## Running locally (recommended)

Camera access typically requires `localhost` or HTTPS.

### Option A: Python (simple)
```bash
python3 -m http.server 8000
```
Open: `http://localhost:8000`

### Option B: Node
```bash
npx serve .
```

---

## Project structure

```
.
├── index.html
└── js
    ├── main.js          # wires everything up
    ├── state.js         # shared mutable state
    ├── ui.js            # DOM refs + UI updates
    ├── settings.js      # settings panel bindings
    ├── mediapipe.js     # MediaPipe Hands setup + results loop
    ├── calibration.js   # 4-click calibration workflow
    ├── keyboard.js      # keyboard layout + coordinate mapping
    ├── detection.js     # press/lift logic + typing/WPM
    ├── draw.js          # canvas overlays (grid + hands)
    └── utils.js         # geometry helpers (point-in-polygon, lerp)
```

---

## Tuning tips 

If keys trigger too easily (false presses):
- Increase **Press Threshold**
- Increase **Min Press Time**
- Increase **Debounce Time**
- Increase **Smoothing Frames** (3 → 5)

If presses don’t register:
- Decrease **Press Threshold**
- Decrease **Lift Threshold**
- Reduce **Min Press Time**
- Reduce **Debounce Time** slightly

If “wrong key” is detected:
- Recalibrate carefully (corners in correct order)
- Make sure your paper keyboard fills a good portion of the frame
- Avoid extreme camera tilt; keep paper flat and well lit

---

## Notes & limitations

- This is a **prototype**. The mapping assumes the keyboard is approximately planar and uses a lightweight quad→(u,v) mapping.
- For best accuracy, keep the keyboard centered and avoid dramatic perspective.
- The demo currently tracks letter keys only (no space/backspace). Easy to add later.

---

## Privacy

All processing is done **in your browser** using MediaPipe in the page.  
No images are uploaded by this code. (Browser/extension tooling is outside scope.)

---

## Troubleshooting

**“Camera not active” / no prompt**
- Serve via `localhost` (not `file://`).
- Make sure the browser has camera permission.

**Green grid not visible**
- You must click 4 corners while calibration is active.

**Hands not detected**
- Increase lighting, move hands closer, ensure camera is unobstructed.

**Still Under Development**
