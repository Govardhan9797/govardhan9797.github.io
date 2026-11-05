# Govardhan Reddy Danduvari · Portfolio

Personal portfolio of a Software & DevOps Engineer (Kubernetes · AWS · Kafka · Telecom BSS/OSS).

**Live:** https://govardhan9797.github.io

## Tech stack

- **React 19 + TypeScript** (strict mode)
- **Vite** for fast builds, with hashed, long-cached assets and React split into its own chunk
- **Hand-written CSS**: fluid type with `clamp()`, CSS custom properties for dark and light themes, and no UI framework
- **Inline SVG illustrations**: an original animated avatar whose eyes follow the cursor, plus theme-aware hills
- **GitHub Actions**: every push to `main` is type-checked, built and deployed to GitHub Pages

The site respects `prefers-reduced-motion`, works from 320px phones to wide desktops, and uses semantic HTML with keyboard-visible focus states.

## Project structure

```
src/
  data.ts      ← all content (profile, experience, skills, certifications)
  App.tsx      ← page layout and sections
  Avatar.tsx   ← animated SVG avatar (wave · laptop · mail · peek poses)
  index.css    ← design tokens, layout and responsive rules
  main.tsx     ← entry point
.github/workflows/deploy.yml  ← CI/CD to GitHub Pages
```

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into dist/
```

To update the content, edit `src/data.ts` and push. The site redeploys automatically.
