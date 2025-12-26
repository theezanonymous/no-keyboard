# Virtual Paper Keyboard Tracker (MediaPipe Hands)

A browser-based prototype that turns a **paper QWERTY keyboard** into a “virtual keyboard” using **MediaPipe Hands**.  
It detects fingertip presses over a calibrated paper keyboard area and shows:

- **Live camera feed** with hand landmarks
- **Calibrated keyboard overlay** + per-key labels
- **Detected key**, recent key history, and typed text
- **WPM estimate** (standard: `(characters / 5) / minute`)
- A **settings panel** to tune press/lift thresholds and smoothing

This version is combined into a single HTML file.

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


