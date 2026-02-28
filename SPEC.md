# Helm Market Specification

## What is Helm Market?
Helm Market is a specialized marketplace for AI Agent Skills, designed to be fully compatible with the Model Context Protocol (MCP). It allows developers to publish, discover, and install pre-built capabilities for their AI agents, providing a robust infrastructure for the agentic ecosystem with integrated billing, versioning, and real-time event tracking.

## Tech Stack
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Database & Auth**: Supabase (PostgreSQL + RLS)
- **Authentication**: Clerk
- **Payments**: Stripe (Connect Express)
- **Email**: Resend
- **Deployment**: Vercel
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Analytics Charts**: Recharts
- **Icons**: Lucide React

## Database Schema

### Table: users
Mirrored from Clerk, stores core user profile data.
- `id`: UUID (Primary Key)
- `full_name`: Text
- `email`: Text (Unique)
- `avatar_url`: Text
- `is_admin`: Boolean (Default: false)
- `stripe_customer_id`: Text
- `created_at`: Timestamp

### Table: categories
Skill categories (e.g., Security, Productivity).
- `id`: UUID (Primary Key)
- `name`: Text
- `slug`: Text (Unique)
- `icon`: Text

### Table: developers
Profiles for users who publish skills.
- `id`: UUID (Primary Key, FK to users.id)
- `username`: Text (Unique)
- `bio`: Text
- `website`: Text
- `is_verified`: Boolean (Default: false)
- `stripe_account_id`: Text
- `stripe_onboarding_complete`: Boolean (Default: false)
- `payout_enabled`: Boolean (Default: false)

### Table: skills
The core entities of the marketplace.
- `id`: UUID (Primary Key)
- `developer_id`: UUID (FK to developers.id)
- `category_id`: UUID (FK to categories.id)
- `name`: Text
- `slug`: Text (Unique)
- `description`: Text
- `price_cents`: Integer
- `revenue_share_percent`: Integer (Default: 70)
- `registry_endpoint`: Text
- `config`: JSONB
- `status`: Text (pending_review, published, rejected)
- `quality_status`: Text (pending, reviewing, verified, flagged)
- `score`: Integer (Curation algorithm result)
- `is_editors_pick`: Boolean
- `editors_pick_since`: Timestamp
- `installs`: Integer
- `avg_rating`: Numeric
- `error_rate`: Numeric
- `review_note`: Text
- `current_version`: Text (Default: '1.0.0')
- `total_versions`: Integer (Default: 1)
- `pricing_tier`: Text (community, standard, verified, enterprise)
- `compliance_labels`: Text[]
- `verified_at`: Timestamp
- `created_at`: Timestamp

### Table: payouts
Developer earnings tracking.
- `id`: UUID (Primary Key)
- `developer_id`: UUID (FK to users.id)
- `skill_id`: UUID (FK to skills.id)
- `amount_cents`: Integer (Developer share)
- `platform_fee_cents`: Integer (Marketplace share)
- `stripe_transfer_id`: Text
- `status`: Text (pending, completed)
- `created_at`: Timestamp

## Progress Status

| Feature | Status |
|---------|--------|
| Initial Setup | ✅ |
| Marketplace Discovery | ✅ |
| Skill Detail Page | ✅ |
| Stripe Integration | ✅ |
| Admin Panel | ✅ |
| Skill Versioning | ✅ |
| Analytics Tracking | ✅ |
| Demo Sandbox | ✅ |
| Webhook System | ✅ |
| CLI Tool (@helm-market/cli) | ✅ |
| Pricing Tiers | ✅ |
| Verified Seal | ✅ |
| Curation Algorithm (Cron) | ✅ |
| Revenue Autopilot (70/30) | ✅ |
| Stripe Connect Onboarding | ✅ |
| Email Notifications (Resend) | ✅ |

## Agent-to-Agent Infrastructure
- **/api/v1/skills/index**: Machine-readable skill discovery for AI agents.
- **/api/v1/purchase**: Programmatic purchase endpoint using Stripe PaymentIntents.
- **/api/v1/agent-policy**: Spending and compliance controls for agents.
- **purchaser_type**: Differentiation between 'human' and 'agent' on all transactions.
- **trust_score**: Computed metric based on verification, compliance, and ratings.

## Visual Target
The finished site should feel like this:
- **Linear.app homepage**: that exact density of whitespace, that exact card grid, that exact nav.
- **Vercel.com hero**: one powerful headline, short subtitle, 2 buttons max, nothing else above the fold.
- **Resend.com typography**: body text is always zinc-400, never white, never bold.

## Interaction States
- **Hover**: border one shade lighter + `transition-all duration-200`.
- **Focus**: `ring-2 ring-indigo-500 ring-offset-2 ring-offset-black`.
- **Loading**: `animate-pulse` on skeleton, spinner on buttons.
