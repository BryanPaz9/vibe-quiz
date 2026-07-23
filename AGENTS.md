# AGENTS.md

## Project

VibeQuiz is an educational case study about building a complete web
application through Vibe Coding, specialized AI roles, and human
supervision. The documented engineering process is as important as the
application itself.

## Required context

Before proposing or making changes, read:

1. `docs/01-project/master-context.md`
2. `docs/01-project/project-charter.md`
3. `docs/01-project/project-vision.md`
4. `docs/01-project/conventions.md`
5. `prompts/ai-development-standard.md`
6. Documentation related to the area being changed

## Responsibilities

- Codex: functional analysis, architecture, backend, automated testing,
  deployment, and independent review.
- Antigravity: frontend design and implementation against the approved
  API contract.
- Developer: objectives, decisions, coordination, integration,
  validation, and final approval.

Codex roles must run as separate tasks. A code review must be performed
in a task separate from the implementation task.

## Workflow

Before implementation:

1. Analyze the repository and related documentation.
2. Identify dependencies, impacts, assumptions, and open decisions.
3. Present a scoped plan.
4. Obtain human approval when the plan or requirements require a
   material decision.

After implementation:

1. Run relevant tests, lint, and build.
2. Update affected documentation.
3. Summarize changes, validations, risks, and next steps.

## Requirements discipline

- Do not invent requirements or silently resolve open product decisions.
- Label proposals and assumptions explicitly.
- Maintain traceability between requirements, user stories, business
  rules, acceptance criteria, API contracts, tests, and implementation.
- The API contract must be approved before frontend implementation.
- Antigravity must not invent endpoints, fields, or business rules.
- Architecture changes and out-of-scope features require human approval.

## Engineering conventions

- Use strict TypeScript.
- Follow ESLint and Prettier.
- Prefer small, traceable changes.
- Keep modules cohesive and responsibilities explicit.
- Avoid duplicated code and undocumented behavior.
- Never commit secrets. Provide `.env.example` files where applicable.
- Use the commit convention defined in
  `docs/01-project/conventions.md`.

## Definition of done

A task is complete only when applicable code compiles, lint passes,
tests pass, documentation is synchronized, requirements remain
traceable, and the result is reproducible.
