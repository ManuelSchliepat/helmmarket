## 1. Setup & Authentication

- [x] 1.1 Initialize Next.js 14 project with Tailwind CSS and Shadcn UI.
- [x] 1.2 Integrate Clerk Auth and set up user/developer middleware.
- [x] 1.3 Configure Supabase project and client utilities.
- [x] 1.4 Set up Clerk-to-Supabase webhooks for user data synchronization.

## 2. Database Schema & Core API

- [x] 2.1 Create `waitlist` table in Supabase.
- [x] 2.2 Create `developers` table with Stripe Connect account ID field.
- [x] 2.3 Create `skills` table with metadata and permission fields.
- [x] 2.4 Create `categories` table and seed initial marketplace categories.
- [x] 2.5 Implement basic Supabase CRUD functions for skills and developers.

## 3. Landing Page & Waitlist

- [x] 3.1 Design hero section with modern typography and CTA.
- [x] 3.2 Build value proposition sections for both users and developers.
- [x] 3.3 Implement waitlist signup form with email validation and deduplication.
- [x] 3.4 Add success confirmation state for the waitlist flow.

## 4. Developer Onboarding & Stripe

- [x] 4.1 Set up Stripe Connect in the Stripe Dashboard.
- [x] 4.2 Implement API route to generate Stripe onboarding links.
- [x] 4.3 Create developer dashboard shell (`/dashboard`).
- [x] 4.4 Build "Connect Stripe" button and handle redirect callback for status verification.

## 5. Skill Discovery & Marketplace UI

- [x] 5.1 Create skills browse page (`/skills`) with grid layout.
- [x] 5.2 Implement search functionality using Supabase text search.
- [x] 5.3 Build category filter sidebar/dropdown.
- [x] 5.4 Design skill detail page (`/skills/[id]`) showing metadata and permissions.

## 6. Skill Submission & Registry

- [x] 6.1 Build skill submission form for verified developers.
- [x] 6.2 Implement permission declaration selection in the submission form.
- [x] 6.3 Configure Verdaccio (basic setup) for package hosting.
- [x] 6.4 Implement API for skill publishing that connects metadata to the registry.
