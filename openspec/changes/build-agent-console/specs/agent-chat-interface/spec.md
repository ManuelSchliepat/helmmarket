## ADDED Requirements

### Requirement: Chat Interface
The system SHALL provide a real-time chat interface for interacting with configured agents.

#### Scenario: User sends message
- **WHEN** user types a natural language prompt
- **THEN** system streams a response from the selected base model, utilizing skills as needed.

### Requirement: Inline Approval
The system SHALL display approve/deny buttons when an agent attempts to execute an operation marked as 'ask'.

#### Scenario: Tool approval flow
- **WHEN** agent calls a tool with 'ask' permission
- **THEN** system pauses execution and shows a button for the user to confirm the action.

### Requirement: Execution Log
The system SHALL show a visible sidebar log of all skill operations performed during a session.

#### Scenario: View logs
- **WHEN** a skill is executed
- **THEN** system updates the sidebar with the operation name, parameters, and return value.
