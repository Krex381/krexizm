# krexizm portfolio

Personal portfolio site for [myself](https://krexizm.cc) — built with React, TypeScript, and Vite.

## Features

- Real-time Discord status via [Lanyard](https://lanyard.cnrad.dev/)
- GitHub repos, contribution graph, and language stats
- Discord widgets (current games, played games)
- Animated page transitions with Framer Motion
- Dark glass-morphism design
- Auto-generated sitemap.xml

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Lucide React
- React Icons
- React Country Flag

## Getting Started

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Output goes to `dist/`. Sitemap is auto-generated at `dist/sitemap.xml`.

## Project Structure

```
src/
├── components/       # Topbar, Footer
├── hooks/            # useLanyard (Discord WebSocket)
├── lib/              # Utilities (flags, tech icons, Discord helpers)
├── pages/            # Profile, Education, Work, Connect
├── config.ts         # Site configuration
└── index.css         # Global styles
```

## Configuration

Edit `src/config.ts` to update:

- Display name, subtitle, location, country
- Discord user ID
- GitHub username
- Social links
- Skills and tech stack
