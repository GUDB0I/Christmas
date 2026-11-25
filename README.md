# Christmas Room 3D — React + Three.js

A fixed cinematic camera Christmas living room built with React Three Fiber. The room is procedurally modeled with Three.js primitives and materials (no external 3D model or HDRI download is required), with animated fire, snowfall, tree lights, warm practical lights, hot cocoa steam, and user-supplied music.

## Requirements

- Node.js 18.18+ (Node.js 20 LTS recommended)
- npm

## Run

1. Extract the ZIP.
2. Open a terminal in this folder (the folder containing `package.json`).
3. Run:

```bash
npm install
npm run dev
```

4. Open the local URL printed by Vite, usually `http://localhost:5173`.

## Add your own music

1. Put an MP3 you have permission to use in `public/music/`.
2. Rename it to `christmas.mp3`.
3. The app already points to `/music/christmas.mp3`.
4. Refresh the page and press **TURN THE MAGIC ON**. Press **SOUND ON/OFF** to mute independently.

No music is bundled. This is intentional.

If you want a different filename, edit the `<audio>` element in `src/main.jsx`.

## Build

```bash
npm run build
npm run preview
```

## Performance notes

- The camera is intentionally fixed for a cinematic composition.
- Canvas DPR is capped at 1.6 and shadows use a 1024 map to balance quality and performance.
- If the scene is slow on your PC, change `dpr={[1, 1.6]}` to `dpr={[1, 1.25]}` in `src/main.jsx`, and reduce `Sparkles count`.
- This project is a procedural 3D first pass: furniture and architecture are modeled from Three.js geometry. It does not include externally sourced photogrammetry or purchased high-poly assets, so it is designed to be easy to run and modify rather than claim film-grade asset realism.
