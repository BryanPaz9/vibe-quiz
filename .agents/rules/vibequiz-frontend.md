---
trigger: always_on
---

# VibeQuiz Frontend Rule

Before proposing or changing code, read:

@docs/01-project/master-context.md
@docs/01-project/project-charter.md
@docs/01-project/project-vision.md
@docs/01-project/conventions.md
@prompts/ai-development-standard.md
@docs/03-architecture/03-frontend-architecture.md
@docs/03-architecture/05-api-contract.md
@docs/03-architecture/08-testing-strategy.md
@docs/02-functional/06-acceptance-criteria.md
@docs/02-functional/07-risks-and-decisions.md

Responsibilities:

- Modify frontend code and directly related frontend documentation only.
- Implement exactly the approved REST API v1 contract.
- Never invent endpoints, fields, states, or business rules.
- Never expose isCorrect in public frontend contracts or fixtures.
- Treat backend scoring, duration, and ranking as authoritative.
- Report contract mismatches before implementing a workaround.
- Use strict TypeScript, ESLint, Prettier, and accessible responsive UI.
- Present a scoped plan and wait for human approval before implementation.
- After implementation run lint, tests, and build.
- Report files changed, validations, risks, assumptions, and next steps.
- Do not commit or push unless explicitly authorized.