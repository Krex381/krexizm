# krexizm

Personal portfolio site for [myself](https://krexizm.cc) — built with React, TypeScript, and Vite.

## Features

- Real-time Discord status via [Lanyard](https://lanyard.eggsy.xyz/) WebSocket
- Live Vienna clock + live age counter
- GitHub repos, contribution graph, language stats, and star counts
- Discord widgets (current/played games)
- Contact form via [Web3Forms](https://web3forms.com)
- Animated page transitions with Framer Motion
- Dark glassmorphism design with responsive layout
- Code-split pages via React.lazy
- Auto-generated sitemap.xml

## Tech Stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS 4
- Framer Motion 12
- Lucide React (icons)
- React Icons (tech logos)
- React Country Flag
- Web3Forms (contact form)

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
├── components/       # Topbar, Footer, ErrorBoundary, SplitText, BlurText, CountUp
│   └── ui/           # shadcn Badge component
├── hooks/            # useLanyard (Discord WebSocket)
├── lib/              # Utilities (flags, tech icons, Discord helpers, fetch hook)
├── pages/            # Profile, Education, Work, Connect
├── config.ts         # Site configuration
├── App.tsx           # Root with lazy-loaded pages
├── main.tsx          # Entry point with ErrorBoundary
└── index.css         # Global styles + glass utilities
```

## Configuration

Edit `src/config.ts` to update:

- Display name, subtitle, location, country
- Discord user ID
- GitHub username
- Social links (GitHub, Discord, Telegram, Instagram)
- Skills and tech stack

## Contact Form

The contact form uses [Web3Forms](https://web3forms.com) — messages are sent directly to your registered email. The access key is in `src/config.ts`.

## License

Private — not for redistribution.
