# WebStudio - Digital Agency Website

## Overview
A stunning cyber-tech digital agency landing page with a dark futuristic aesthetic inspired by webstudio-ias.com. Features glassmorphism effects, animated gradients, neon accents, and smooth framer-motion animations.

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, framer-motion, shadcn/ui components
- **Backend**: Express.js with PostgreSQL database
- **Styling**: Custom dark theme with neon purple (#8B5CF6), cyan (#06B6D4), pink (#EC4899) accents
- **Font**: Inter (Google Fonts)

## Project Structure
- `client/src/pages/home.tsx` - Main landing page assembling all sections
- `client/src/components/navbar.tsx` - Fixed glass-effect navigation
- `client/src/components/hero-section.tsx` - Hero with animated orbs and CTAs
- `client/src/components/services-section.tsx` - 4-card services grid
- `client/src/components/why-us-section.tsx` - 6-card benefits section
- `client/src/components/pricing-section.tsx` - 3 pricing plans (Starter/Pro/Enterprise)
- `client/src/components/contact-section.tsx` - Contact form + contact info cards
- `client/src/components/footer.tsx` - Site footer
- `server/routes.ts` - API endpoints (POST /api/contact)
- `server/db.ts` - PostgreSQL database connection
- `server/storage.ts` - Database storage layer
- `shared/schema.ts` - Drizzle ORM schemas (users, contactSubmissions)

## API Endpoints
- `POST /api/contact` - Submit contact form (name, email, subject, message)
- `GET /api/contact` - Retrieve contact submissions

## Design Tokens
- Background: Deep midnight blue (#050A14 range)
- Glass effects: `glass-card`, `glass-nav` utility classes
- Glow effects: `glow-purple`, `glow-cyan`, `glow-pink` utilities
- Gradient text: `gradient-text` utility class
- Hover borders: `gradient-border` utility class

## Running
- `npm run dev` - Start development server on port 5000
- `npm run db:push` - Push database schema changes
