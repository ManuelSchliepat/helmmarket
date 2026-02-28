## Why

Helm Market needs a foundational MVP to validate the marketplace model for AI Agent Skills. This change establishes the core infrastructure for skill discovery, developer onboarding, and the initial waitlist to build traction.

## What Changes

- **Landing Page**: A high-conversion landing page featuring a hero section, value propositions, and a waitlist signup form.
- **Skill Marketplace**: A browseable interface for discovering AI Agent skills with search, categories, and detail views.
- **Developer Portal**: Onboarding flow using Stripe Connect for revenue sharing and a submission form for publishing skills as npm packages.
- **Backend Infrastructure**: Supabase schema design for skills, developers, and waitlist entries, plus integration with Verdaccio for skill hosting.
- **Authentication**: Integration of Clerk Auth for secure developer and user sessions.

## Capabilities

### New Capabilities
- `waitlist-management`: Capturing and managing early access signups.
- `skill-discovery`: Searching, filtering, and viewing details of available skills.
- `developer-onboarding`: Integration with Stripe Connect for payouts and developer profile creation.
- `skill-publishing`: Workflow for developers to upload and manage their skill packages.
- `marketplace-core`: Centralized database schema and API for the marketplace operations.

### Modified Capabilities
<!-- No existing capabilities to modify in this initial proposal -->

## Impact

- **Frontend**: New Next.js 14 App Router pages (`/`, `/skills`, `/onboarding`, `/publish`).
- **Database**: New Supabase tables (`skills`, `developers`, `waitlist`, `categories`).
- **Payments**: Implementation of Stripe Connect for 70/30 revenue distribution.
- **Auth**: Clerk implementation for user and developer authentication.
- **Registry**: Verdaccio configuration for private/internal npm package management.
