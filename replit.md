# WebStudio - Digital Agency Platform

## Overview
An enterprise-grade multi-page digital agency platform with a dark cyber-tech aesthetic. Features multi-language support (EN/ES/FR/HE with RTL), framer-motion page transitions, glassmorphism effects, and a checkout flow.

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, framer-motion, shadcn/ui, wouter (routing)
- **Backend**: Express.js with PostgreSQL database
- **Styling**: Custom dark theme with neon purple (#8B5CF6), cyan (#06B6D4), pink (#EC4899) accents
- **Font**: Inter (Google Fonts)
- **i18n**: Custom Context API with JSON translations (EN/ES/FR/HE + RTL)

## Project Structure

### Pages
- `client/src/pages/home.tsx` - Home: Hero + Trust Badges + Services Overview
- `client/src/pages/services.tsx` - Services catalog with detailed cards
- `client/src/pages/about.tsx` - About: Story, Mission, Values, Team
- `client/src/pages/work.tsx` - Portfolio: 6 project showcase cards
- `client/src/pages/pricing.tsx` - 3 pricing plans (Starter/Pro/Enterprise)
- `client/src/pages/contact.tsx` - Contact form + info cards
- `client/src/pages/checkout.tsx` - Order summary + Stripe-style payment form

### Components
- `client/src/components/navbar.tsx` - Fixed glass nav with language switcher
- `client/src/components/hero-section.tsx` - Hero with animated orbs
- `client/src/components/trust-section.tsx` - Client trust logos
- `client/src/components/services-overview.tsx` - 4-card services grid (home page)
- `client/src/components/footer.tsx` - Deep 4-column enterprise footer
- `client/src/components/page-wrapper.tsx` - Framer-motion page transitions

### Core
- `client/src/lib/i18n.tsx` - i18n system (Context + translations)
- `client/src/App.tsx` - Router + providers
- `server/routes.ts` - API endpoints
- `server/storage.ts` - Database storage layer
- `shared/schema.ts` - Drizzle ORM schemas

## API Endpoints
- `POST /api/contact` - Submit contact form (name, email, subject, message)
- `GET /api/contact` - Retrieve contact submissions

## i18n
- Languages: English (EN), Spanish (ES), French (FR), Hebrew (HE)
- Hebrew auto-switches layout to RTL
- Translations in `client/src/lib/i18n.tsx` as JSON objects

## Design Tokens
- Background: Deep midnight blue (#050A14 range)
- Glass effects: `glass-card`, `glass-nav` utility classes
- Glow effects: `glow-purple`, `glow-cyan`, `glow-pink`
- Gradient text: `gradient-text` utility class
- Hover borders: `gradient-border` utility class

## Running
- `npm run dev` - Start development server on port 5000
- `npm run db:push` - Push database schema changes
