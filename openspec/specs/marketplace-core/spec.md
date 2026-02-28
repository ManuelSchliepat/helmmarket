## ADDED Requirements

### Requirement: Database Schema
The system SHALL have a core database schema in Supabase to handle the marketplace data.

#### Scenario: Schema Consistency
- **WHEN** a new skill is published
- **THEN** it MUST be associated with a verified developer record via a foreign key relationship.

### Requirement: Revenue Share Calculation
The system SHALL calculate a 70% share for the developer and a 30% share for the platform on every successful skill purchase.

#### Scenario: Successful Purchase
- **WHEN** a user completes a purchase via Stripe
- **THEN** system logs the transaction and updates the developer's pending payout balance.
