## ADDED Requirements

### Requirement: Stripe Connect Integration
The system SHALL redirect developers to Stripe's hosted onboarding flow when they initiate the setup.

#### Scenario: Initiate Onboarding
- **WHEN** developer clicks "Connect with Stripe"
- **THEN** system generates a Stripe Connect link and redirects the developer to it.

### Requirement: Developer Profile Verification
The system SHALL verify the developer's identity via Stripe and update their status in the `developers` table.

#### Scenario: Onboarding Complete
- **WHEN** Stripe redirects back with a success token
- **THEN** system verifies the account state via API and marks the developer as "verified" for payouts.
