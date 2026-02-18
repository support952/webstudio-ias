# WebStudio - Digital Agency Platform

## Overview
An enterprise-grade multi-page digital agency platform with a dark cyber-tech aesthetic. Features multi-language support (EN/ES/FR/HE with RTL), framer-motion page transitions, glassmorphism effects, user authentication, AI chat agent, and a checkout flow.

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, framer-motion, shadcn/ui, wouter (routing)
- **Backend**: Express.js with PostgreSQL database
- **Auth**: bcryptjs for password hashing, express-session with connect-pg-simple for sessions
- **AI**: OpenAI via Replit AI Integrations (gpt-5-nano for AI chat agent)
- **Email**: nodemailer for contact form + AI summary emails to support@webstudio-ias.com
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
- `client/src/pages/contact.tsx` - Contact form + info cards + AI chat modal
- `client/src/pages/checkout.tsx` - Order summary + Stripe-style payment form
- `client/src/pages/marketing.tsx` - Marketing Campaigns (PPC) page
- `client/src/pages/login.tsx` - User login page (redirects to /dashboard on success)
- `client/src/pages/register.tsx` - User registration page (redirects to /dashboard on success)
- `client/src/pages/dashboard.tsx` - Client dashboard with 5 tabs: Overview, Profile, Settings, Progress, Requests
- `client/src/pages/admin-panel.tsx` - Admin CRM panel at /ws-panel-9x7k (separate login, hidden URL)

### Components
- `client/src/components/navbar.tsx` - Fixed glass nav with language switcher + auth buttons
- `client/src/components/hero-section.tsx` - Hero with animated orbs
- `client/src/components/trust-section.tsx` - Client trust logos
- `client/src/components/services-overview.tsx` - 4-card services grid (home page)
- `client/src/components/footer.tsx` - Deep 4-column enterprise footer
- `client/src/components/page-wrapper.tsx` - Framer-motion page transitions
- `client/src/components/ai-chat-modal.tsx` - AI sales assistant chat modal

### Core
- `client/src/lib/i18n.tsx` - i18n system (Context + translations)
- `client/src/lib/auth.tsx` - Auth context (login, register, logout, session)
- `client/src/App.tsx` - Router + providers (QueryClient, I18n, Auth)
- `server/routes.ts` - API endpoints (auth, contact, AI chat, dashboard)
- `server/storage.ts` - Database storage layer (users, contacts, projects, messages, requests)
- `server/email.ts` - Email sending (contact form + AI summary)
- `shared/schema.ts` - Drizzle ORM schemas (users, contactSubmissions, projectUpdates, projectMessages, clientRequests)

## API Endpoints
- `POST /api/auth/register` - Register new user (username, email, password, fullName)
- `POST /api/auth/login` - Login (email, password)
- `POST /api/auth/logout` - Logout (destroys session)
- `GET /api/auth/me` - Get current user session
- `POST /api/contact` - Submit contact form (name, email, subject, message)
- `GET /api/contact` - Retrieve contact submissions
- `POST /api/ai-chat` - AI chat agent endpoint (messages[], clientInfo)
- `GET /api/profile` - Get user profile
- `PATCH /api/profile` - Update user profile (fullName, email, phone, company)
- `POST /api/profile/password` - Change password
- `GET /api/progress` - Get project progress updates
- `GET /api/messages` - Get project messages
- `POST /api/messages` - Send message (with optional attachment)
- `GET /api/requests` - Get client requests
- `POST /api/requests` - Submit new request (subject, message, priority)
- `GET /api/dashboard/overview` - Dashboard overview stats
- `POST /api/admin/login` - Admin-only login (separate from client login)
- `GET /api/admin/me` - Check admin session
- `GET /api/admin/overview` - Admin dashboard overview stats
- `GET /api/admin/clients` - Get all registered clients
- `GET /api/admin/clients/:clientId` - Get client details with projects/messages/requests
- `GET /api/admin/contacts` - Get all contact form submissions
- `GET /api/admin/requests` - Get all client requests
- `PATCH /api/admin/requests/:id` - Update request status
- `GET /api/admin/messages` - Get all project messages
- `POST /api/admin/messages` - Send message to client (as admin)
- `POST /api/admin/projects` - Create project for client
- `PATCH /api/admin/projects/:id` - Update project status/progress

## Admin Panel
- Hidden URL: `/ws-panel-9x7k` (not linked from site)
- Separate admin login (admin@webstudio-ias.com / WS@dmin2024!Secure)
- Features: Overview stats, Clients CRM list, Contact forms, Requests management, Messages
- Admin can: view all clients, send messages, create/update projects, change request statuses

## Auth & Routing
- Logged-in users redirected from /login and /register to /dashboard
- Dashboard requires authentication (redirects to /login if not logged in)
- Users table has `role` field (default "client", admin has "admin")
- Data isolation: each client only sees their own data

## i18n
- Languages: English (EN), Spanish (ES), French (FR), Hebrew (HE)
- Hebrew auto-switches layout to RTL
- Translations in `client/src/lib/i18n.tsx` as JSON objects
- Auth translations: auth.loginTitle, auth.registerTitle, nav.login, nav.register, etc.
- Dashboard translations: dashboard.overview, dashboard.profile, dashboard.settings, etc.

## Design Tokens
- Background: Deep midnight blue (#050A14 range)
- Glass effects: `glass-card`, `glass-nav` utility classes
- Glow effects: `glow-purple`, `glow-cyan`, `glow-pink`
- Gradient text: `gradient-text` utility class
- Hover borders: `gradient-border` utility class

## Running
- `npm run dev` - Start development server on port 5000
- `npm run db:push` - Push database schema changes
