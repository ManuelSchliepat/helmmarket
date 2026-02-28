## ADDED Requirements

### Requirement: Agent Creation
The system SHALL provide a form to create an AI agent with a name, description, model selection, and skill attachments.

#### Scenario: Successful creation
- **WHEN** user provides valid agent details and skills
- **THEN** system saves the agent to the `agents` table and skill links to `agent_skills`.

### Requirement: Skill Permission Toggles
The system SHALL allow users to set 'allow', 'ask', or 'deny' for each operation provided by an attached skill.

#### Scenario: Setting permissions
- **WHEN** user toggles an operation to 'ask'
- **THEN** the system updates the `permissions_map` in `agent_skills` accordingly.
