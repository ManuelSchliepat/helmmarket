## MODIFIED Requirements

### Requirement: Skill Submission Form
The system SHALL provide a form for verified developers to submit new skill metadata (name, description, tags, registry endpoint, and `helm.config.json`). The system MUST parse and validate the `helm.config.json` to ensure MCP compatibility.

#### Scenario: Metadata Submission with Config
- **WHEN** developer fills the form, provides a valid `helm.config.json`, and clicks "Submit"
- **THEN** system saves the metadata and the parsed configuration to the `skills` table with a "pending review" status.

#### Scenario: Metadata Submission with Invalid Config
- **WHEN** developer fills the form but provides an invalid `helm.config.json`
- **THEN** system displays an error and prevents submission until the config is fixed.
