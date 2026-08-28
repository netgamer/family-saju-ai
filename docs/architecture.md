# Architecture

## Product concept

Family Saju AI stores the calculated Myeongri/Mansae-ryeok (만세력) result for each family member and uses the selected speaker, listener, relationship, and conversation situation to generate practical communication guidance.

## Data flow

```text
Birth information
  -> Calendar/Saju calculation engine
  -> Structured Saju result
  -> Family member profile
  -> Relationship + situation
  -> AI prompt/context builder
  -> Communication guidance
```

## Family member

Required input:

- name
- date of birth
- birth time
- sex

Recommended metadata:

- relationship to account owner
- optional nickname
- timezone/location used for calculation

## Stored Saju result

The calculation result should be stored as structured data rather than only rendered text. The initial schema should allow:

- year/month/day/hour pillars
- heavenly stems and earthly branches
- five elements
- ten gods
- hidden stems
- auxiliary stars when supported by the calculation rules
- major luck cycles when supported
- calculation version/rule-set version
- source/input timezone and location

## AI context

A relationship request should be converted to a structured context such as:

```json
{
  "speaker": "father",
  "listener": "daughter",
  "relationship": "parent-child",
  "situation": "conversation",
  "question": "우리 딸과 대화하려면 어떤 점이 필요할까?",
  "speaker_saju": {},
  "listener_saju": {}
}
```

The AI response should prioritize actionable communication guidance:

1. likely communication tendencies
2. possible friction points
3. what the speaker should do
4. what to avoid
5. example phrases
6. caveats and uncertainty

## Implementation order

1. Reproduce and validate the Mansae-ryeok calculation rules used by the reference program.
2. Build the calculation engine with deterministic tests.
3. Add family/member persistence.
4. Build relationship and situation selection.
5. Add AI context/prompt generation.
6. Add the web UI.
7. Add authentication, privacy controls, and deployment.
