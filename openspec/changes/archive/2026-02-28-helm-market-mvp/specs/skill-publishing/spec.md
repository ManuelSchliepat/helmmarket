## ADDED Requirements

### Requirement: Skill Submission Form
The system SHALL provide a form for verified developers to submit new skill metadata (name, description, tags, and registry endpoint).

#### Scenario: Metadata Submission
- **WHEN** developer fills the form and clicks "Submit"
- **THEN** system saves the metadata to the `skills` table with a "pending review" status.

### Requirement: Skill Permissions Declaration
The system SHALL require developers to declare the permissions their skill needs (e.g., "internet-access", "read-files").

#### Scenario: Display Permissions
- **WHEN** a user views a skill's detail page
- **THEN** system displays the list of declared permissions to the user.
