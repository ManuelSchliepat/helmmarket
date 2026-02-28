## ADDED Requirements

### Requirement: Waitlist Signup
The system SHALL provide a form for users to sign up for early access by submitting their email address.

#### Scenario: Successful Signup
- **WHEN** user submits a valid email address
- **THEN** system saves the email to the `waitlist` table and displays a success message.

#### Scenario: Duplicate Email
- **WHEN** user submits an email that is already on the waitlist
- **THEN** system notifies the user they are already on the list without creating a duplicate record.
