## Context

Helm Market MVP needs a cohesive architecture that bridges the gap between traditional web marketplaces and the npm-style developer experience. The system must handle developer onboarding, automated payouts, and skill hosting securely.

## Goals / Non-Goals

**Goals:**
- **Automated Payouts**: Secure 70/30 revenue share using Stripe Connect.
- **Skill Discovery**: Fast, searchable UI for browsing AI Agent skills.
- **Developer Experience**: Simple submission process for npm-style skill packages.
- **Scalable Infrastructure**: Use Supabase for data and Verdaccio for registry management.

**Non-Goals:**
- Real-time communication between users and developers.
- Detailed skill version history management (MVP will focus on latest stable).
- Comprehensive analytics dashboard for developers.

## Decisions

1.  **Auth: Clerk over Supabase Auth**:
    - **Rationale**: Clerk provides better pre-built UI components and user profile management, which speeds up frontend development.
    - **Alternative**: Supabase Auth was considered, but Clerk's DX for onboarding is superior.

2.  **Payments: Stripe Connect (Standard Accounts)**:
    - **Rationale**: Allows developers to maintain their own Stripe dashboard while Helm Market manages the platform fees (30%).
    - **Alternative**: Custom payout logic, but this would introduce massive regulatory overhead.

3.  **Registry: Verdaccio**:
    - **Rationale**: Verdaccio acts as a lightweight npm proxy/registry. It allows us to host skills as standard npm packages, making them easily consumable by Helm agents.
    - **Alternative**: Custom S3-based package storage, but Verdaccio provides the npm API for free.

4.  **Database: Supabase (PostgreSQL)**:
    - **Rationale**: Leverages Row-Level Security (RLS) and real-time features. We'll mirror essential Clerk user data into Supabase via webhooks.

## Risks / Trade-offs

- **[Risk]** Registry Security: Unauthorized access to premium skill packages.
  - **Mitigation**: Implement a custom authentication plugin for Verdaccio that validates sessions via Clerk/Supabase.
- **[Risk]** Data Synchronization: Inconsistency between Clerk/Stripe and Supabase.
  - **Mitigation**: Use robust webhooks with idempotent processing to ensure Supabase stays updated.
- **[Risk]** Onboarding Friction: Stripe Connect setup can be complex for small developers.
  - **Mitigation**: Clear documentation and using Stripe's pre-built onboarding UI.
