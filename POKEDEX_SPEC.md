# POKEDEX_SPEC.md
### The Lokédex Redesign Constitution
> Every Claude Code task must reference this file. Claude Code implements specs — it does not make design decisions.

---

## 0. Task Completion Protocol

Every Claude Code task response must end with the following, in this order:

**Summary** — bullet list of everything created or modified, with one sentence on each decision worth noting.

**Decisions worth your review** — flag any ambiguity, spec conflict, or implementation choice that deviated from the task prompt. Be explicit. Do not bury these.

**Verification** — confirm tsc --noEmit clean and npm run build passes. List any browser checks performed.

**Draft commit message** — always included, formatted as a conventional commit. Subject line under 72 characters. Body lists the concrete file-level changes. Footer notes any open issues or flags. Format:

```
<type>(<scope>): <subject>

<body — what changed and why, file by file>

<footer — open issues, flags, follow-ups>
```

Types: feat, fix, refactor, chore, style. Scope is the component or system touched (e.g. shell, synth, data, types).

---

## 1. Framework Decision

**Migrate from Astro to Vite + React (SPA).**

Rationale: The new design is a single interactive device. There are no separate pages — only state changes within one component tree. Astro's strengths (partial hydration, multi-page routing, static generation) become irrelevant when the entire UI is one `client:load` island. A Vite + React SPA eliminates that indirection entirely.

This work happens on a new branch of `C:\Users\Home\Documents\Projects\lokedex`. The Astro setup is replaced in place — no new subdirectory. The Sanity studio at `lokedex/` stays completely untouched throughout. The branch merges to main once the redesign is complete and verified.

What carries over:
- All React components port 1:1 (PokedexCard, TypeBadge, ExperienceCard, SpotifyWidget)
- Sanity client (`@sanity/client`) works unchanged client-side
- All CSS tokens from `global.css` carry over
- PostHog and Clarity analytics carry over
- Vercel deployment is identical

What changes:
- `src/pages/` is replaced by a single `src/App.tsx`
- Routing is internal device state, not URL-based pages
- Data fetching moves to React hooks (`useEffect` on mount), not Astro `getStaticProps`
- `astro.config.mjs` and `tailwind.config.mjs` are replaced by `vite.config.ts`

**Do not use Next.js.** SSR adds complexity with no benefit for a client-side portfolio device.

**Libraries:** Pick the best tool for each task as it comes. Evaluate on the go — nothing is banned except what's in the CSS and Design prohibitions in Section 13.

**Animation library hierarchy — follow this order for every animated interaction:**
1. **Motion Primitives** (https://motion-primitives.com) — copy-paste, Framer Motion based. Check here first. Mapped uses:
   - `Tilt` — closed cover 3D mouse-tracking effect
   - `In View` — scroll-triggered animations in list panel
   - `Animated Group` — staggered list entry entrances
2. **Aceternity UI** (https://ui.aceternity.com/components) — copy-paste, Framer Motion based. Mapped uses:
   - `Encrypted Text` — boot sequence character scramble, entry title reveals
   - `Spotlight` — screen hover glow effect
   - `Typewriter Effect` — fallback for typing animations
3. **React Bits** (https://reactbits.dev) — copy-paste, ships in JS/TS + CSS/Tailwind flavors. Mapped uses:
   - `Shiny Text` — LOKÉDEX wordmark on the closed cover
   - `Blur Text` — entry name reveal on detail panel load
   - `Count Up` — animated number stats (Spotify minutes)
4. **Magic UI** (https://magicui.design) — copy-paste, Framer Motion based. Use as fallback if 1-3 don't have it.
5. **Framer Motion directly** — for panel swaps, `AnimatePresence` exit/enter sequences, spring physics on hardware buttons, the hinge fold animation.
6. **CSS keyframes** — purely decorative only (e.g. the blink on "PRESS ANY KEY"). Never for anything responding to user input.

**Sound: Tone.js synthesized audio (no audio files, no copyright risk)**
- Install: `npm install tone`
- All sounds are synthesized at runtime using Tone.js oscillators and envelopes — no mp3 files, no external assets.
- This approach mirrors how the actual GBA/GB sound chip worked: simple square wave, triangle wave, and noise oscillators at specific frequencies. The Pokémon menu sounds ARE programmatic beeps. We reverse-engineer the feel without copying any files.
- All sound logic lives in `src/hooks/useSynth.ts`. No sound code anywhere else.
- Global mute state lives in `usePokedex` context. `useSynth` reads it and gates all playback.
- Tone.js requires `await Tone.start()` on the first user gesture (browser autoplay policy). Call this inside the openFold handler.

Sound definitions — implement these exact frequencies and durations:
```
navigate:      880Hz square wave, 40ms, gain 0.25, fast exponential decay
select:        523Hz → 784Hz square wave, 30ms each note, gain 0.3
back:          523Hz → 392Hz square wave, 30ms each note, gain 0.3
sectionSwitch: 440Hz → 554Hz → 659Hz square wave, 25ms each note, gain 0.28
openFold:      80Hz sine wave 150ms fast decay + white noise burst 80ms, gain 0.2
boot:          C4→E4→G4→C5 (262→330→392→523Hz) square wave, 80ms per note,
               20ms gap between notes, gain 0.3
```

- Sounds mapped to interactions:
  - `navigate` — D-pad up/down, list row changes
  - `select` — D-pad right, A button, list item click
  - `back` — D-pad left, B button
  - `sectionSwitch` — section button click
  - `boot` — plays during boot sequence, one note per progress stage
  - `openFold` — fires on device open, triggers Tone.start()

---

## 2. Project Structure

```
src/
  App.tsx                  — root, mounts <Pokedex />
  main.tsx                 — entry point
  components/
    shell/
      PokedexShell.tsx     — outer plastic body, hinge, hardware layout
      ScreenBezel.tsx      — screen housing, scanlines, glow
      DPad.tsx             — directional pad, 4 directional buttons
      ActionButtons.tsx    — A/B buttons with press states
      SectionButtons.tsx   — PROJ / EXP / ABOUT / CONTACT switcher row
      SpeakerGrille.tsx    — decorative dot grid
      SensorEye.tsx        — top-left camera/sensor detail
      HingeAnimation.tsx   — CSS 3D fold open/close
    screens/
      BootSequence.tsx     — pixel art startup animation
      ListPanel.tsx        — left screen: scrollable numbered entry list
      DetailPanel.tsx      — right screen: full entry detail display
    entries/
      ProjectEntry.tsx     — right panel layout for a project
      ExperienceEntry.tsx  — right panel layout for an experience
      AboutEntry.tsx       — right panel layout for about
      ContactEntry.tsx     — right panel layout for contact
    ui/
      TypeBadge.tsx        — (port from existing, unchanged)
      PixelText.tsx        — Press Start 2P wrapper with size presets
      EntryNumber.tsx      — #001 formatted entry number
      CursorBlink.tsx      — blinking pixel cursor for active state
  hooks/
    usePokedex.ts          — central state: activeSection, selectedEntry, isOpen
    useSanityData.ts       — fetches projects + experiences from Sanity
    useDPad.ts             — keyboard arrow key bindings
    useSynth.ts            — all synthesized sound effects via Tone.js
  styles/
    global.css             — all CSS tokens (extend existing, do not replace)
    hardware.css           — all hardware-specific CSS (shadows, press states, plastic)
  lib/
    sanity.ts              — (port unchanged)
    fetchProjects.ts       — (port unchanged)
    fetchExperiences.ts    — (port unchanged)
  types/
    sanity.ts              — (port unchanged)
    pokedex.ts             — Section, Entry, AnimationState types
```

---

## 3. Design Philosophy

**Three rules that prevent vibe-coded output:**

1. **No Tailwind color shortcuts.** Every color value references a named CSS variable from Section 4. `bg-red-600` is banned. `bg-[--pokedex-red]` or an explicit class is correct.
2. **No generic shadow utilities.** `shadow-lg`, `shadow-md`, `drop-shadow` are banned. All shadows are written out manually in `hardware.css` using multi-layer `box-shadow`. See Section 6.
3. **Every component has a hardware name, not a web name.** There is no `<Card>`, `<Modal>`, or `<Sidebar>`. There is `<DetailPanel>`, `<ListPanel>`, `<ScreenBezel>`. Naming enforces that Claude Code thinks in hardware, not website patterns.

---

## 4. Design Tokens

All tokens live in `src/styles/global.css` under `@theme` and as CSS custom properties. Do not hardcode hex values anywhere in component files.

### Color Tokens

```css
/* --- Pokémon brand (existing, do not change) --- */
--color-poke-red: #FF0000;
--color-poke-blue: #3B4CCA;
--color-poke-yellow: #FFDE00;
--color-poke-black: #2B2B2B;
--color-poke-white: #FFFFFF;

/* --- Pokémon types (existing, do not change) --- */
--color-poke-normal: #A8A878;
--color-poke-fire: #F08030;
--color-poke-water: #6890F0;
--color-poke-electric: #F8D030;
--color-poke-grass: #78C850;
--color-poke-ice: #98D8D8;
--color-poke-fighting: #C03028;
--color-poke-poison: #A040A0;
--color-poke-ground: #E0C068;
--color-poke-flying: #A890F0;
--color-poke-psychic: #F85888;
--color-poke-bug: #A8B820;
--color-poke-rock: #B8A038;
--color-poke-ghost: #705898;
--color-poke-dragon: #7038F8;
--color-poke-dark: #705848;
--color-poke-steel: #B8B8D0;
--color-poke-fairy: #EE99AC;

/* --- Hardware shell (new) --- */
--shell-red: #CC2200;
--shell-red-dark: #8B0000;
--shell-red-highlight: #FF3311;
--shell-red-shadow: #6B0000;
--shell-blue-accent: #3B4CCA;
--shell-blue-dark: #2A3699;
--shell-hinge: #1a1a1a;
--shell-hinge-metal: #333344;
--shell-plastic-highlight: rgba(255, 255, 255, 0.12);
--shell-plastic-shadow: rgba(0, 0, 0, 0.45);

/* --- Screens (new) --- */
--screen-bg: #0a1628;
--screen-scanline: rgba(0, 0, 0, 0.08);
--screen-glow: rgba(59, 76, 202, 0.15);
--screen-bezel: #111118;
--screen-bezel-inner: #0d0d14;
--screen-pixel-grid: rgba(255, 255, 255, 0.03);

/* --- Controls (new) --- */
--btn-dpad: #1a1a1a;
--btn-dpad-press: #0d0d0d;
--btn-action-a: #FFDE00;
--btn-action-b: #FFDE00;
--btn-action-text: #8B0000;
--btn-section-bg: #1a1a1a;
--btn-section-active: #FFDE00;
--btn-section-active-text: #1a1a1a;
--btn-section-text: #888888;
--indicator-active: #00FF41;
--indicator-inactive: #1a3a1a;

/* --- List panel (new) --- */
--list-bg: #0a1628;
--list-row-hover: rgba(255, 222, 0, 0.08);
--list-row-active: rgba(255, 222, 0, 0.15);
--list-number: #3B4CCA;
--list-name: #e8e8e8;
--list-cursor: #FFDE00;

/* --- Detail panel (new) --- */
--detail-bg: #0a1628;
--detail-heading: #FFDE00;
--detail-body: #c8d8e8;
--detail-muted: #6888aa;
--detail-link: #6890F0;
--detail-tech-bg: rgba(59, 76, 202, 0.2);
--detail-tech-border: rgba(59, 76, 202, 0.4);
--detail-divider: rgba(255, 255, 255, 0.06);
```

### Typography Tokens

```css
--font-family-pokemon: "Press Start 2P", cursive;   /* existing */
--font-family-mono: "JetBrains Mono", monospace;     /* existing */

/* Screen text sizes — only these sizes are permitted inside screens */
--text-screen-xs: 8px;    /* entry numbers, metadata */
--text-screen-sm: 10px;   /* body text, bullets, tech tags */
--text-screen-md: 12px;   /* list item names, section labels */
--text-screen-lg: 14px;   /* detail panel headings */
--text-screen-xl: 18px;   /* entry title on detail panel */

/* Hardware label sizes — buttons, section labels */
--text-hw-xs: 7px;
--text-hw-sm: 9px;
--text-hw-md: 11px;
```

### Spacing Tokens

```css
/* Device dimensions */
--device-width: min(960px, 96vw);
--device-height: min(660px, 92vh);
--panel-width: calc((var(--device-width) - var(--hinge-width) - var(--shell-padding) * 4) / 2);
--hinge-width: 24px;
--shell-padding: 28px;
--screen-padding: 16px;
--bezel-thickness: 18px;

/* Control areas */
--control-area-height: 140px;
--dpad-size: 72px;
--btn-action-size: 34px;
--btn-section-height: 24px;
--btn-section-width: 52px;
```

---

## 5. Typography Rules

**Press Start 2P is for the device shell and hardware labels only.** Use it for: section button labels, boot sequence text, entry numbers (#001), the Lokédex wordmark on the closed cover. Never use it for body copy — it is illegible at body sizes.

**JetBrains Mono is for all screen content.** Use it for: list item names, detail panel body text, tech tags, description bullets, dates, links. It reads well at small sizes and maintains the retro terminal feel.

**No other fonts.** Do not introduce Inter, Geist, or any sans-serif system font.

Line-height for screen body text: `1.6`. Letter-spacing for Press Start 2P labels: `0.05em`.

---

## 6. Hardware CSS Patterns

> This section is the most important in the spec. Copy these patterns verbatim. Do not substitute Tailwind utilities.

### 6.1 Plastic Shell Body

```css
.pokedex-shell {
  background: var(--shell-red);
  box-shadow:
    inset 0 1px 0 var(--shell-plastic-highlight),
    inset 0 -2px 0 var(--shell-red-shadow),
    0 20px 60px rgba(0, 0, 0, 0.6),
    0 8px 24px rgba(0, 0, 0, 0.4);
  border-radius: 18px;
}

/* Left half gets stronger top-left highlight (catches light) */
.shell-left {
  background: linear-gradient(145deg, var(--shell-red-highlight) 0%, var(--shell-red) 30%);
}
```

Note: `linear-gradient` is permitted ONLY for the shell plastic — it simulates a physical material, not a decorative web effect. Not permitted on screens, buttons, or panels.

### 6.2 Screen Bezel

```css
.screen-bezel {
  background: var(--screen-bezel);
  box-shadow:
    inset 0 2px 8px rgba(0, 0, 0, 0.8),
    inset 0 0 0 1px rgba(0, 0, 0, 0.6),
    0 1px 0 rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: var(--bezel-thickness);
}
```

### 6.3 Screen Glass

```css
.screen-glass {
  background: var(--screen-bg);
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}

/* Scanlines overlay — pseudo element, always present */
.screen-glass::after {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    var(--screen-scanline) 0px,
    transparent 1px,
    transparent 3px
  );
  pointer-events: none;
  z-index: 10;
}

/* Subtle screen glow — pseudo element */
.screen-glass::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 50% 0%, var(--screen-glow) 0%, transparent 70%);
  pointer-events: none;
  z-index: 9;
}
```

### 6.4 D-Pad

```css
.dpad-arm {
  background: var(--btn-dpad);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    inset 0 -2px 0 rgba(0, 0, 0, 0.5),
    0 2px 4px rgba(0, 0, 0, 0.4);
  border-radius: 3px;
  cursor: pointer;
  user-select: none;
}

.dpad-arm:active,
.dpad-arm.pressed {
  background: var(--btn-dpad-press);
  box-shadow:
    inset 0 2px 4px rgba(0, 0, 0, 0.7),
    inset 0 1px 0 rgba(0, 0, 0, 0.4);
  transform: scale(0.96);
}
```

### 6.5 Action Buttons (A/B)

```css
.btn-action {
  background: var(--btn-action-a);
  border-radius: 50%;
  width: var(--btn-action-size);
  height: var(--btn-action-size);
  box-shadow:
    0 4px 0 #B8A000,
    0 5px 10px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-family-pokemon);
  font-size: var(--text-hw-sm);
  color: var(--btn-action-text);
  transition: transform 60ms ease, box-shadow 60ms ease;
}

.btn-action:active,
.btn-action.pressed {
  box-shadow:
    0 1px 0 #B8A000,
    0 2px 6px rgba(0, 0, 0, 0.4),
    inset 0 3px 6px rgba(0, 0, 0, 0.3);
  transform: translateY(3px);
}
```

### 6.6 Section Switcher Buttons

```css
.btn-section {
  background: var(--btn-section-bg);
  color: var(--btn-section-text);
  font-family: var(--font-family-pokemon);
  font-size: var(--text-hw-xs);
  width: var(--btn-section-width);
  height: var(--btn-section-height);
  border-radius: 4px;
  box-shadow:
    0 3px 0 #0d0d0d,
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
  cursor: pointer;
  letter-spacing: 0.04em;
  transition: background 80ms ease, color 80ms ease;
}

.btn-section.active {
  background: var(--btn-section-active);
  color: var(--btn-section-active-text);
  box-shadow:
    0 1px 0 #0d0d0d,
    inset 0 2px 4px rgba(0, 0, 0, 0.25);
  transform: translateY(2px);
}

.btn-section:active {
  transform: translateY(2px);
}
```

### 6.7 Hinge

```css
.hinge {
  width: var(--hinge-width);
  background: var(--shell-hinge);
  box-shadow:
    inset 2px 0 4px rgba(0, 0, 0, 0.6),
    inset -2px 0 4px rgba(0, 0, 0, 0.6),
    inset 0 0 0 1px var(--shell-hinge-metal);
  align-self: stretch;
}
```

### 6.8 Speaker Grille Dots

```css
.speaker-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--shell-red-dark);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.8);
}
/* Render as a 4×3 grid of .speaker-dot elements */
```

### 6.9 Indicator Light

```css
.indicator-light {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--indicator-active);
  box-shadow:
    0 0 6px var(--indicator-active),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

.indicator-light.off {
  background: var(--indicator-inactive);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.6);
}
```

---

## 7. Component Inventory

### PokedexShell
Top-level layout. Renders the full device when `isOpen` state is true. Manages `HingeAnimation`. Contains left half and right half, separated by `<Hinge>`. Does not contain any content — delegates entirely to `<ListPanel>` and `<DetailPanel>` for screen content.

Props: none. State comes from `usePokedex` context.

Layout: `display: flex; flex-direction: row; align-items: stretch;`

### HingeAnimation
Wraps the right half in a CSS 3D perspective transform. On mount (first open), animates from `rotateY(-90deg)` to `rotateY(0deg)` over 600ms with `cubic-bezier(0.25, 0.46, 0.45, 0.94)`. Uses `transform-origin: left center`. After animation completes, triggers `BootSequence`.

**The closed cover** (pre-open state): A single red panel, full device width, centered `LOKÉDEX` wordmark in Press Start 2P at 18px, small blinking indicator light top-left, "PRESS START" text blinking at bottom in 8px Press Start 2P. Click anywhere or press any key triggers open.

### ScreenBezel
Receives `children` (the screen content). Applies bezel styling (Section 6.2) and screen glass (Section 6.3) including scanlines and glow pseudo-elements. Renders a small label below the screen in 7px Press Start 2P: left says `LIST`, right says `DATA`.

### BootSequence
Plays once after HingeAnimation completes. Sequence:
1. Screen flickers on (opacity 0 → 1, 150ms)
2. `LOKÉDEX v2.0` types out letter by letter at cursor (Press Start 2P, 10px, yellow) — 60ms per character
3. `LOADING DATA...` appears below, 40ms per character
4. Progress bar fills (3 segments, 300ms each)
5. Fades to ListPanel + DetailPanel, total boot time ~2.5s

BootSequence only plays on first mount. Store `hasBooted` in `localStorage`.

### ListPanel
Left screen. Renders the active section's entry list.

Structure per row:
```
#001  [TYPE] Entry Name          ▶
```

- Entry number: `--list-number` color, `--text-screen-xs`, JetBrains Mono
- Type badge: existing `TypeBadge` component (projects only)
- Name: `--list-name` color, `--text-screen-md`, JetBrains Mono
- Active row: `--list-row-active` background, `--list-cursor` color cursor on left edge
- Hover: `--list-row-hover` background

The list is scrollable within the screen bounds. Scrollbar is hidden (`scrollbar-width: none`). D-pad up/down moves the active row. Scroll follows active row.

For Experience section: no type badge. Show company name as secondary text below job title in `--detail-muted`.

For About/Contact sections: single entry each, auto-selected on section switch.

### DetailPanel
Right screen. Renders the selected entry's full detail.

Sub-components route based on section:
- `activeSection === 'projects'` → `<ProjectEntry entry={selected} />`
- `activeSection === 'experience'` → `<ExperienceEntry entry={selected} />`
- `activeSection === 'about'` → `<AboutEntry />`
- `activeSection === 'contact'` → `<ContactEntry />`

When no entry is selected: render a blinking cursor and `SELECT AN ENTRY` in `--detail-muted` at center.

### ProjectEntry
Renders a project. Layout (top to bottom):
- Entry number + name (xl, yellow)
- Type badges row (existing TypeBadge)
- Description (sm, body color, line-height 1.6)
- Tech stack: small pill tags with `--detail-tech-bg` background, `--detail-tech-border` border
- Divider line (`--detail-divider`)
- Links row: GitHub icon + Live link icon (JetBrains Mono, sm, link color)

All text uses JetBrains Mono. No prose headings — use pixel labels (`STACK:`, `LINKS:`) in 8px Press Start 2P yellow.

### ExperienceEntry
Renders a job. Layout:
- Job title (xl, yellow)
- Company + location (sm, muted)
- Date range (xs, muted)
- Divider
- Description bullets — each prefixed with `▶` in yellow
- Sub-projects (if present): indented, smaller, with their own tech tags

### AboutEntry
Static content. Tells the Logan story as a Pokédex entry. Format:
- `TRAINER:` Logan Ravinuthala
- `CLASS:` Computer Engineer
- `HOMETOWN:` Boston, MA
- Then 2-3 short paragraph entries in body text style
- Interests as type badges (Weightlifting, Music, Mario Kart, Pokémon)
- Links to GitHub, LinkedIn

### ContactEntry
Static. Email, LinkedIn, GitHub — each as a labeled row with pixel icon prefix.

### SectionButtons
Row of 4 hardware buttons below the left screen: `PROJ`, `EXP`, `ABOUT`, `CNTCT`. Active section button uses `.btn-section.active` styles. Clicking switches `activeSection` state and resets `selectedEntry` to null.

### DPad
Cross-shaped button. 4 arms: up, down, left, right. Up/Down navigate the list. Left goes to list (if on detail). Right selects active list item (enters detail). Arms use `.dpad-arm` styles. Keyboard arrows map to the same actions via `useDPad` hook.

### ActionButtons
Two circular buttons (B left, A right). A = confirm/select (same as right on D-pad). B = back (return to list panel focus). Use `.btn-action` styles.

---

## 8. Layout & Dimensions

The device is centered on screen, `position: fixed; inset: 0; display: flex; align-items: center; justify-content: center;`. Background is `#0d0d0d` — near-black, not pure black.

```
┌─────────────────────────────────────────────────────────┐
│                    POKEDEX SHELL                         │
│  ┌──────────────────┬──┬──────────────────┐             │
│  │   LEFT HALF      │HI│   RIGHT HALF     │             │
│  │                  │NG│                  │             │
│  │  ┌────────────┐  │E │  ┌────────────┐  │             │
│  │  │            │  │  │  │            │  │             │
│  │  │ LIST PANEL │  │  │  │DETAIL PANEL│  │             │
│  │  │            │  │  │  │            │  │             │
│  │  └────────────┘  │  │  └────────────┘  │             │
│  │  [PROJ][EXP]...  │  │  [DPAD]  [A][B]  │             │
│  └──────────────────┴──┴──────────────────┘             │
└─────────────────────────────────────────────────────────┘
```

Section buttons sit below the left screen inside the left half shell. D-pad and action buttons sit below the right screen inside the right half shell. Speaker grille is bottom-right of the right half. Sensor eye is top-left of the left half.

**Responsive:** Below 768px viewport width, the device stacks vertically (left panel on top, right panel below). Section buttons become a horizontal scroll row. D-pad is hidden on mobile — touch tap on list item goes straight to detail. The fold animation is skipped on mobile.

---

## 9. Animation Specs

### Opening fold
- Duration: 600ms
- Easing: `cubic-bezier(0.25, 0.46, 0.45, 0.94)`
- `perspective: 1200` on the parent container (not the rotating child) — shared vanishing point at the hinge axis produces a more realistic clamshell fold
- `transform: rotateY(-90deg)` → `rotateY(0deg)` on right half motion.div
- `transform-origin: left center` on the right half
- Simultaneous: left half fades in `opacity: 0 → 1` over 200ms

### Boot sequence
- Total: ~2500ms
- Flicker: `opacity 0 → 1` in 150ms with 2 quick flickers (opacity 0.3 → 0.8 → 0.3 → 1)
- Typing: 60ms per character, cursor blinks at 500ms interval
- Progress bar: 3 segments fill over 300ms each with 100ms gap between

### Section switch
- Duration: 200ms
- List panel: `opacity 1 → 0 → 1` as list content swaps
- No slide — just a quick fade. Keeps it snappy.

### List navigation (D-pad)
- Active row highlight moves instantly (no animation)
- Scroll position follows: `scrollIntoView({ behavior: 'smooth', block: 'nearest' })`

### Detail panel entry change
- Duration: 150ms
- `opacity 1 → 0` then content swaps then `opacity 0 → 1`

### Button press
- All hardware buttons: `transform: translateY(3px)` + shadow change on `:active`
- Duration: 60ms ease
- Uses CSS transitions only — no JS animation

---

## 10. Sound Design

All sounds use the Web Audio API via a `useSound` hook. No external audio library. No mp3 files — sounds are synthesized via `AudioContext` oscillators to keep the bundle small and maintain the retro feel.

```ts
// useSound.ts — all sounds defined here, nowhere else
sounds = {
  navigate: short blip, 880Hz square wave, 40ms, gain 0.3
  select:   confirmation blip, 523Hz → 659Hz, 80ms, gain 0.35
  back:     descending blip, 440Hz → 330Hz, 60ms, gain 0.3
  sectionSwitch: two-tone, 392Hz + 523Hz, 100ms, gain 0.3
  boot:     ascending arpeggio C4→E4→G4→C5, 80ms per note
  openFold: low mechanical click, noise burst, 200ms, gain 0.2
}
```

Global mute toggle: a small speaker icon on the shell (top-right of device). State persisted in `localStorage` as `lokédex-muted`. Default: unmuted.

---

## 11. Navigation Model

State managed by `usePokedex` context hook:
```ts
interface PokedexState {
  isOpen: boolean               // fold animation complete
  activeSection: Section        // 'projects' | 'experience' | 'about' | 'contact'
  selectedEntry: string | null  // entry _id or null
  focusedIndex: number          // current list cursor position
  isMuted: boolean
}

type Section = 'projects' | 'experience' | 'about' | 'contact'
```

URL sync: use `window.location.hash` to reflect state. `#projects/slug`, `#experience/slug`, `#about`, `#contact`. This enables shareable links and back button support without a router dependency. Parse hash on mount to restore state.

---

## 12. Sanity Data Mapping

### Projects → ListPanel row
```
entryNumber: padded index (001, 002...)
name:        project.name
types:       project.types[] → TypeBadge[]
id:          project._id
slug:        project.slug.current
```

### Projects → ProjectEntry detail
```
number:      formatted entry number
name:        project.name
types:       project.types[]
description: project.description
techs:       project.techs[]
github:      project.github
link:        project.link
```

### Experience → ListPanel row
```
entryNumber: padded index
name:        experience.title
company:     experience.company
id:          experience._id
```

### Experience → ExperienceEntry detail
```
title:       experience.title
company:     experience.company
location:    experience.location
startDate:   experience.startDate (format: MMM YYYY)
endDate:     experience.endDate || 'PRESENT'
bullets:     experience.description[]
subprojects: experience.projects[]
```

Data is fetched once on app mount via `useSanityData`. No per-entry fetches. All entries are loaded into state upfront — the dataset is small enough that this is appropriate.

---

## 13. Prohibitions

The following are banned. Claude Code must not produce these under any circumstances, regardless of convenience.

**Tailwind usage — read this carefully**

Tailwind utility classes are the default for all layout, spacing, sizing, flex, position, border-radius, cursor, and transition properties. Do not use inline `style={{}}` for static values that Tailwind can express. Three valid uses of `style={{}}`:

1. Runtime-dynamic values computed from JS state (e.g. scroll position, animation progress)
2. CSS variables used as values where Tailwind arbitrary syntax is too verbose: `style={{ fontFamily: 'var(--font-family-pokemon)' }}` is acceptable if the equivalent Tailwind class would be unwieldy
3. Properties Tailwind cannot express at all

Everything else is a Tailwind class. Examples:
- `style={{ display: 'flex', flexDirection: 'column' }}` → `className="flex flex-col"` ✓
- `style={{ position: 'absolute', top: '14px', left: '14px' }}` → `className="absolute top-[14px] left-[14px]"` ✓
- `style={{ color: 'var(--detail-muted)' }}` → `className="text-[var(--detail-muted)]"` ✓
- `style={{ background: 'var(--shell-red)' }}` → `className="bg-[var(--shell-red)]"` ✓
- `style={{ transform: computedTransform }}` → `style={{ transform: computedTransform }}` ✓ (dynamic)

**CSS**
- `shadow-sm`, `shadow`, `shadow-md`, `shadow-lg`, `shadow-xl`, `shadow-2xl` — write shadows manually
- `rounded-xl`, `rounded-2xl`, `rounded-3xl` — use specific `border-radius` values
- `bg-red-*`, `bg-blue-*`, `bg-yellow-*`, or any Tailwind color — use CSS variables via arbitrary values: `bg-[var(--shell-red)]`
- `gradient` on anything except the shell plastic (Section 6.1) and text-clipped gradients (`WebkitBackgroundClip: 'text'`) used by ShinyText — decorative background gradients are banned
- `backdrop-blur`, `bg-opacity`, `glassmorphism` patterns
- `animate-pulse`, `animate-bounce` Tailwind utilities — write custom keyframes
- `transition-all` — specify exact properties

**HTML / Components**
- Generic component names: `<Card>`, `<Panel>`, `<Modal>`, `<Sidebar>`, `<NavBar>`
- `<nav>` element — navigation is hardware buttons, not semantic nav
- External icon libraries (heroicons, lucide, etc.) — use Unicode symbols (▶, ◀, ●, ▲, ▼) and Press Start 2P for all UI symbols
- Any font other than Press Start 2P and JetBrains Mono

**Design**
- No white or light backgrounds anywhere on the device
- No card borders on screen content (screens are edge-to-edge dark)
- No hover underlines on links within screens — use color change only
- No placeholder/skeleton loaders that look like generic website patterns — use the boot sequence and a pixel `LOADING...` text if data is pending


