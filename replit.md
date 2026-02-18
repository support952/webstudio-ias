# Overview

This is a **WebStudio Digital Agency Website** — a full-stack web application with a futuristic cyber-tech dark mode aesthetic. It serves as a digital agency portfolio and lead generation platform featuring sections for services, pricing, "why us," and a contact form that persists submissions to a PostgreSQL database. The visual style is inspired by a neon-accented, glassmorphism-heavy dark theme with animated gradient orbs and glowing UI elements.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend

- **Framework**: React 18 with TypeScript, bundled by Vite
- **Routing**: Uses `wouter` (lightweight client-side router) — currently single-page with hash-based anchor navigation for sections (Home, Services, Why Us, Pricing, Contact)
- **Styling**: Tailwind CSS with CSS custom properties (HSL-based design tokens), extended with custom neon color classes (`neon-purple`, `neon-cyan`, `neon-pink`) and glassmorphism utility classes
- **UI Components**: shadcn/ui component library (new-york style) built on Radix UI primitives. Components live in `client/src/components/ui/`
- **Animations**: Framer Motion for scroll-triggered animations, hover effects, and page transitions
- **Icons**: Lucide React for most icons, `react-icons` (specifically `react-icons/si`) for brand/social icons
- **State Management**: TanStack React Query for server state; React Hook Form with Zod resolvers for form handling
- **Path Aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

## Backend

- **Runtime**: Node.js with Express 5
- **Language**: TypeScript, executed via `tsx` in development
- **API Design**: REST API under `/api/` prefix
- **Current Endpoints**:
  - `POST /api/contact` — Creates a contact form submission (validated with Zod)
  - `GET /api/contact` — Retrieves all contact submissions
- **Dev Server**: Vite dev server middleware is integrated into Express for HMR during development
- **Production**: Client is built to `dist/public/`, server is bundled via esbuild to `dist/index.cjs`

## Data Layer

- **Database**: PostgreSQL (required — `DATABASE_URL` environment variable must be set)
- **ORM**: Drizzle ORM with `drizzle-zod` for schema-to-validation integration
- **Schema Location**: `shared/schema.ts` — shared between frontend and backend
- **Tables**:
  - `users` — id (UUID), username (unique), password
  - `contact_submissions` — id (UUID), name, email, subject, message, created_at
- **Migrations**: Drizzle Kit with `db:push` command for schema synchronization
- **Connection**: `pg` Pool in `server/db.ts`

## Build System

- **Development**: `npm run dev` — runs tsx with Vite middleware for HMR
- **Production Build**: `npm run build` — Vite builds the client, esbuild bundles the server
- **Schema Push**: `npm run db:push` — pushes Drizzle schema to database
- **Type Check**: `npm run check` — runs TypeScript compiler

## Project Structure

```
client/               # Frontend React application
  src/
    components/       # Feature components (navbar, hero, services, etc.)
      ui/             # shadcn/ui primitive components
    hooks/            # Custom React hooks
    lib/              # Utilities (queryClient, cn helper)
    pages/            # Page components (home, not-found)
server/               # Backend Express application
  index.ts            # Server entry point
  routes.ts           # API route definitions
  storage.ts          # Database access layer (repository pattern)
  db.ts               # Database connection pool
  vite.ts             # Vite dev server integration
  static.ts           # Static file serving for production
shared/               # Code shared between frontend and backend
  schema.ts           # Drizzle table definitions and Zod schemas
migrations/           # Drizzle migration files
attached_assets/      # Design reference documents
```

## Key Design Decisions

1. **Shared schema pattern**: Database schemas and validation types are defined once in `shared/schema.ts` and used by both frontend (form validation) and backend (API validation, DB queries). This ensures type safety across the stack.

2. **Storage abstraction**: The `IStorage` interface in `server/storage.ts` abstracts database operations, making it possible to swap implementations. Currently uses `DatabaseStorage` backed by PostgreSQL.

3. **Dark theme as default**: The CSS variables in `index.css` define a dark cyber-tech theme as the root (default) theme, not as a `.dark` class variant. This is intentional for the design aesthetic.

4. **Single-page scroll layout**: Despite having routing infrastructure (wouter), the main site uses anchor-based scrolling between sections on a single home page. The router is available for adding new pages.

# External Dependencies

- **PostgreSQL**: Required database. Connection via `DATABASE_URL` environment variable. Uses `pg` driver with Drizzle ORM.
- **Google Fonts**: Inter font loaded from `fonts.googleapis.com` in the HTML head.
- **Replit Plugins** (dev only): `@replit/vite-plugin-runtime-error-modal`, `@replit/vite-plugin-cartographer`, `@replit/vite-plugin-dev-banner` — only active in development on Replit.
- **No external auth service**: User table exists but no authentication flow is implemented yet.
- **No payment processing**: Pricing section exists in UI but no Stripe or payment integration is connected.