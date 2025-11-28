# Project Architecture – Frontend Portfolio

This project is a modern single-page application (SPA) built using Vite, React, TypeScript, React Router, and Tailwind CSS.

## Core Architecture Pattern

The project follows a component-based, route-driven architecture.

Key principles:

- Each UI section is built as an isolated component
- Pages are composed by assembling components
- Routing is handled client-side
- Styling is utility-first and scoped through Tailwind CSS

## Stack Overview

- Vite → Development server and build tool
- React → UI library for component composition
- TypeScript → Type safety layer
- React Router → Client-side navigation system
- Tailwind CSS → Utility-based styling framework

## Folder Structure Philosophy

The project is organized to separate responsibilities:

- `components/` → Reusable UI blocks (Navbar, Hero, Sections)
- `pages/` → Route-level components
- `assets/` → Static files (images, icons)
- `styles/` → Global CSS and Tailwind base styles

## Routing Architecture

Routing is centralized inside `App.tsx`.

Each route maps to a page component:

- `/` → HomePage
- `/how-it-started` → HowItStarted page
- `/contact` → Contact page

Navigation inside the app never reloads the browser.
It uses client-side routing for fast transitions.

## State Management Philosophy

State is kept as local as possible.

- UI-related state lives inside components
- No heavy global state until required
- Hooks (`useState`, `useEffect`) are used carefully

## Styling Strategy

Tailwind CSS is used instead of traditional CSS files.

- Styles are applied directly inside JSX
- No global CSS pollution
- Utility classes ensure consistency and maintainability

## Build and Deployment Architecture

Development:
- `vite` runs the dev server
- Hot reload updates UI instantly

Production:
- `vite build` generates an optimized static build
- Output can be deployed to Cloudflare Pages or any CDN

## Deployment Flow

1. Code pushed to GitHub
2. Cloudflare pulls the repo
3. Static build is generated
4. CDN serves the site globally

## Engineering Philosophy

The architecture prioritizes:

- Clear separation of concerns
- Predictable behavior
- Fast build times
- Simple debugging
- Real-world deployment patterns

## Status

This project is actively evolving and will serve as a long-term engineering platform.

## License

MIT License
