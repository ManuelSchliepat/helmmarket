# Helm Market

## Project Description
A marketplace for Helm AI Agent Skills. Developers publish skills as npm packages and earn 70% revenue share. Users discover, install and pay for skills to extend their AI agents.

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, Shadcn UI
- **Backend/Database:** Supabase (PostgreSQL)
- **Payments:** Stripe Connect (for 70/30 revenue share)
- **Authentication:** Clerk Auth
- **Registry:** Verdaccio (custom npm registry for skills)

## Core Features
- **Skill Marketplace:** Listings with search, filtering, and categorization.
- **Developer Onboarding:** Seamless signup and Stripe Connect integration for payouts.
- **Monetization:** Automated 70/30 revenue share on all skill sales.
- **Security & Transparency:** Permission declaration display for every skill.
- **Early Access:** Waitlist functionality for initial launch phase.

## Target Audience
- **AI Developers:** Creating and monetizing agent capabilities.
- **Enterprises:** Using the Helm framework looking to extend their agentic workflows.

## Development Conventions
- Use TypeScript for all components and logic.
- Follow Next.js 14 App Router patterns.
- Ensure accessible UI using Shadcn components.
- Maintain clear separation between client and server components.
