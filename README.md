# AtlasAI - Valyra Atlas AI Landing Page

A premium, interactive single-page landing website for **Valyra Atlas AI**—an autonomous AI-driven outbound pipeline system.

---

## 🌟 Interactive Highlights

This project utilizes custom, high-fidelity UI components designed to deliver a modern, Apple-inspired experience:

1. **Drag-to-Rotate Wheel Timeline**
   - A desktop interactive radial dial positioned off-screen. Users can click and rotate the wheel to scroll through the 5 outbound steps (**Target**, **Hunt**, **Audit**, **Score**, **Draft**).
   - Includes real-time counter-rotation on node items so numbers remain upright, breathing tick marks with proximity glows aligned to the focal axis, and elastic snap-physics on release.
   - Degrades gracefully on mobile to a curved horizontal progress wheel linked to swipe-snapped step cards.
2. **Orbital Cycling Rings**
   - Floating concentric SVG background rings rotating slowly in opposite directions to provide visual depth in the hero section.
3. **Handwritten Underline Animation**
   - Character-by-character writing reveal delayed dynamically to sync with drawing path vector drawings.
4. **Chromatic aberration (RGB Splitting)**
   - Text layers split cyan/red drop shadow offsets, jiggling dynamically on hover events.

---

## 🛠️ Technology Stack

- **Core**: Vanilla HTML5 / JavaScript (ES6 Modules)
- **Styling**: Modern Vanilla CSS3 with absolute variables, Flexbox/Grid, and Custom Transitions (no third-party frameworks like Tailwind for maximal customization).
- **Bundler**: Vite 7

---

## 🚀 Getting Started

### Prerequisites
Make sure you have Node.js and npm installed.

### Setup and Running
1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Start Local Dev Server**:
   ```bash
   npm run dev
   ```
   *The site will be available at `http://localhost:5173`.*

3. **Compile Production Bundle**:
   ```bash
   npm run build
   ```
   *Outputs optimized assets to the `dist/` directory.*

4. **Preview Production Build**:
   ```bash
   npm run preview
   ```

---

## 📂 Project Structure

```text
├── index.html          # Main landing page HTML
├── terms.html          # Terms of Service page
├── privacy.html        # Privacy Policy page
├── package.json        # Project metadata & npm dependencies
├── vite.config.js      # Vite project config
├── public/             # Static public assets (logos, icons)
└── src/
    ├── scripts/
    │   └── main.js     # Interaction logic (dragging, ticks, reveal observers)
    └── styles/
        └── main.css    # Typography, HSL color variables, animations, layouts
```
