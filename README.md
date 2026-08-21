# Collaborative Whiteboard

A real-time collaborative whiteboard — draw together with anyone, live, in the browser.

**Live demo:** [https://collab-whiteboard-one.vercel.app](https://collab-whiteboard-pink.vercel.app/)

## Features

- Freehand drawing with adjustable color and brush size
- Real-time sync — every stroke appears on every connected client instantly
- Live cursors — see where other people are pointing, color-coded per user
- Undo and clear, synced across all connected clients
- Persistent boards — drawings are stored server-side and survive a page refresh
- Sharp rendering on high-DPI displays (devicePixelRatio-aware canvas)

## Tech stack

- **React 19 + Vite** — UI and build tooling
- **Tailwind CSS v4** — styling
- **Liveblocks** — real-time presence and shared, conflict-free storage
- **Vercel** — hosting and continuous deployment

## How it works

The canvas is plain HTML5 Canvas, not an SVG or DOM-per-stroke approach — each stroke is stored as a small data object (`{ color, size, points }`) rather than raw pixels, which is what makes syncing possible at all. While you're actively drawing, strokes render immediately via direct canvas calls for zero-latency feedback. Once a stroke is finished, it's pushed into a Liveblocks `LiveList` — a CRDT-backed shared list that Liveblocks replicates to every client connected to the same room. Every client redraws the full canvas from that shared list, so undo, clear, and new strokes all stay consistent across everyone in the room without a custom backend or hand-rolled conflict resolution.

Cursor positions run on a separate system — Liveblocks Presence, which is ephemeral, per-connection data that doesn't need to persist the way the drawing itself does.

## Running locally

Clone the repo and move into the project folder:

```
git clone https://github.com/Shrey-Mangal/collab-whiteboard.git
cd collab-whiteboard/collab-whiteboard
```

Install dependencies:

```
npm install
```

You'll need a free [Liveblocks](https://liveblocks.io) account — create a project, grab your public API key from the API keys tab, and add it to a `.env.local` file in the project root:

```
VITE_LIVEBLOCKS_PUBLIC_KEY=pk_your_key_here
```

Start the dev server:

```
npm run dev
```

Open the local URL in two separate browser windows to see the real-time sync in action.
