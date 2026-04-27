# ⌨️ TypeRush — Speed Typing Test

A clean, browser-based typing speed tester built with vanilla HTML, CSS, and JavaScript.

## Features

- **Two modes** — General (prose passages) and Technical (CS/programming content)
- **60-second countdown** that starts on your first keystroke
- **Live stats** — WPM, accuracy, mistakes, and error percentage update as you type
- **Results screen** with a breakdown of your performance
- **No dependencies** — pure HTML/CSS/JS, no frameworks or build tools needed

## How it works

1. Open `HOME.html` in a browser
2. Choose General or Technical mode
3. Start typing — the timer begins automatically
4. See your results when the 60 seconds are up (or when you finish the passage)

## File structure

```
├── HOME.html       # Landing page / mode selector
├── GEN.html        # General typing test
├── GEN.js          # General test logic
├── TECH.html       # Technical typing test
├── TECH.js         # Technical test logic
├── RESULTS.html    # Results display page
└── STYLES.css      # Shared stylesheet
```

## Running locally

Just open `HOME.html` directly in any modern browser — no server required.
