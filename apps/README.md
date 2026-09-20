# Apps

Interactive apps for teaching Differentiation (calculus), in Bahasa Malaysia
unless noted otherwise. Each subfolder is self-contained.

Start at **[`index.html`](./index.html)** — a landing page linking to every
app below. Each app also has its own `landing.html` in the same style.

| App | Description | Run it |
| --- | --- | --- |
| [`introduction-differentiation`](./introduction-differentiation) | Unit 2.1: Pengenalan kepada Pembezaan — guided linear/quadratic/cubic examples with a click-to-answer calculator. | Open `landing.html`, or `index.html` directly. |
| [`derivative-of-function`](./derivative-of-function) | Unit 2.2: Aplikasi Interaktif Pembezaan Fungsi. | Open `landing.html`, or `index.html` directly. |
| [`differentiation-technique`](./differentiation-technique) | Unit 2.3: Differentiation Technique — clickable calculator, Formula Trainer, Chain Rule visualization, Mastery Quiz. | Open `landing.html`, or `index.html` directly. |
| [`higher-derivatives`](./higher-derivatives) | Unit 2.4: Higher Derivatives — visual notes on notation/concavity/inflection points, guided interactive examples, a live concavity explorer, and a 10-question auto-graded quiz. | Open `landing.html`, or `index.html` directly. |
| [`calculus-visualizer`](./calculus-visualizer) | Physical Calculus Visualizer (English) — animates real-world motion alongside position/velocity/acceleration graphs. React + Vite app. | `npm install && npm run dev` |

The first four apps are single-file, offline-capable HTML apps — no build
step required, just open `index.html` directly (Chrome, Edge, Firefox or
Safari). The `calculus-visualizer` app is a small React/Vite project; see its
own README for setup.

## Landing pages

`assets/landing.css` is a shared design system (bright chartreuse hero,
collage of math-themed tiles around a centered headline, black pill CTA)
reused by `index.html` and every app's `landing.html`.
