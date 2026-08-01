# Happy Friendship Day 💌

A 6-page animated Friendship Day website: a notification envelope you tap
open, a note that loads in piece by piece, a "Lifetime Bestie Award"
certificate, an animated "you are my..." characteristics page, a photo
collage of memories, and a full-page closing note.

Two versions are included:
- **Plain HTML/CSS/JS** — `index.html`, `style.css`, `script.js`. Just open
  `index.html` in a browser, no build step needed.
- **React** — `react/FriendshipDaySite.jsx` + `react/FriendshipDaySite.css`,
  same site as a drop-in component.

---

## 1. Add your photos (2 minutes)

Put your own pictures inside the `images/` folder, keeping the same file
names. Full instructions and recommended sizes are in
[`images/README.txt`](images/README.txt). The site already ships with
placeholder images, so it works immediately even before you add real ones.

```
images/
├── dictionary-photo.jpeg   ← note page photo
├── bestie-photo.jpeg       ← "you are my..." page photo
└── memories/
    ├── memory-1.jpeg       ← collage: left, tall
    ├── memory-2.jpeg       ← collage: middle-top, wide
    ├── memory-3.jpeg       ← collage: middle-bottom, wide
    └── memory-4.jpeg       ← collage: right, tall
```

## 2. Edit the text (2 minutes)

All the words on the site — the note, the certificate name, the
characteristics, the memory captions, and the closing letter — live in one
place near the top of the JS file, so you never have to touch the markup:

- Plain version: open `script.js`, edit the `CONFIG` object at the top.
- React version: open `react/FriendshipDaySite.jsx`, edit the `CONFIG`
  object at the top.

```js
const CONFIG = {
  friendName: "My Person",
  noteText: "Some people come into your life for a season...",
  certificateBody: "for endless laughs, unwavering loyalty...",
  characteristics: ["favorite person", "partner in crime", ...],
  memoryCaptions: ["the day it all started", ...],
  finalNote: ["If you're reading this...", ...],
};
```

## 3. Open it

**Plain HTML** — double-click `index.html`, or serve the folder locally:
```bash
cd friendship-day-site
python3 -m http.server 8000
# then visit http://localhost:8000
```

**React** — drop `FriendshipDaySite.jsx` and `FriendshipDaySite.css` into
any React app (Vite, Create React App, Next.js, etc.):
```jsx
import FriendshipDaySite from "./react/FriendshipDaySite";

export default function App() {
  return <FriendshipDaySite />;
}
```
For the React version, put your photos in the `public/images/...` folder
of your React project (same structure as above) — the component references
them as `/images/dictionary-photo.jpeg` etc. If you'd rather import them as
modules (e.g. with Vite), update the `CONFIG.images` paths at the top of
`FriendshipDaySite.jsx` to your imported variables instead of strings.

---

## How each page works

1. **Notification / envelope** — a bell-style "You have a notification"
   line with a bobbing envelope. Tapping it plays a flap-opening animation
   before moving to the note page.
2. **Note + photo** — content loads in stages, not all at once: the title
   fades in first, then the polaroid photo (with a brief loading-dots
   moment), then the note text reveals word by word, then the button.
3. **Certificate** — "Lifetime Bestie Award goes to" types the name in
   letter by letter, then an "Open the Certificate" button appears. Clicking
   it unfolds a gold-bordered certificate with a signature line and date.
4. **You are my...** — your bestie's photo sits in the center with
   hand-drawn arrows that draw themselves outward to floating labels (one
   characteristic at a time).
5. **Memories** — a single collage row: a big photo on the left, two
   stacked photos in the middle, and a big photo on the right (matching the
   size of the first).
6. **Final note** — a full-page closing letter that reveals line by line,
   with a gentle falling-hearts effect and a "Read it again" button that
   restarts the site.

Navigate with the dots at the top, the up/down arrows on the right edge, or
your keyboard's ↑ / ↓ (or Page Up / Page Down) keys.

## Customizing the look

Colors and fonts are defined as CSS variables at the top of `style.css` /
`FriendshipDaySite.css`:

```css
:root{
  --blush:#FFE3D8;   /* background */
  --plum:#3D1F3D;    /* main text */
  --coral:#FF6B5B;   /* buttons, arrows */
  --gold:#D4A94A;    /* certificate accents */
  --cream:#FFF9F2;   /* paper/card background */
  --rose:#C9184A;    /* highlights */
}
```

Change any of these hex values to re-theme the whole site in one place.

## Browser support

Works in all modern browsers (Chrome, Safari, Firefox, Edge). Respects
`prefers-reduced-motion` for anyone who has that accessibility setting
turned on.