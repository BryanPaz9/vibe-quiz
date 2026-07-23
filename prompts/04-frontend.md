# Prompt 04 - Frontend

## Tool

Antigravity.

## Role

Act as a Senior React Engineer.

## Objective

Implement the frontend.

## Stack

-   React
-   TypeScript
-   Vite
-   TailwindCSS

## Required screens

-   Login admin
-   Quiz CRUD
-   Student join
-   Quiz player
-   Results
-   Ranking

Keep components reusable and responsive.

Implement against the approved API contract. Do not invent endpoints,
payload fields, or business rules. Report any required contract change
before modifying the implementation.

## Foundation implementation record

### Scope

Repair and complete the scaffold originally started by Antigravity:

- Stabilize the toolchain for the local Node.js runtime.
- Configure routing, providers, layouts and shared components.
- Add a typed REST client with separate authentication schemes.
- Add contract-derived MSW fixtures.
- Configure Vitest, React Testing Library and Playwright.
- Preserve approved routes and business rules.

### Human-approved alignment

- Keep `expiresIn` as the approved numeric contract type. The backend was
  aligned to return the expiration in whole seconds before integration.
- Never publish real administrator credentials.
- Keep the administrator JWT in memory.
- Keep a participation token only in per-tab `sessionStorage`.
- Use React Router 7 because the available version 6 retained known
  security vulnerabilities.

### Result

The foundation phase now includes the complete route tree, protected
administrative route experience, query provider, accessible base
components, contract types, REST client, session adapters, MSW,
component tests and Playwright smoke tests.

Business pages remain explicit placeholders for subsequent vertical
feature implementation.

## Public flow checkpoint 1 — Entry

### Scope

- Fetch the published public quiz.
- Present title, description and question count without rendering answers.
- Validate the required alias with the approved 80-character limit.
- Start the participation through the approved endpoint.
- Store the opaque token in per-tab session storage.
- Navigate to the existing play route.
- Allow the same tab to recover an active participation by `publicId`.

### Evidence

- MSW fixtures cover the public quiz and participation contracts.
- Component tests cover metadata, validation, unavailable quizzes,
  successful navigation and duplicate aliases.
- Playwright covers the successful entry flow.

### Remaining checkpoints

1. Display result and public ranking.
2. Implement administrative authentication as the fourth overall frontend
   checkpoint.

## Public flow checkpoint 2 — Resolution

### Scope

- Recover the active attempt without exposing its token in the URL.
- Render questions and options ordered by contract position.
- Persist each selected answer per participation and tab.
- Require exactly one answer for every question before submission.
- Submit only question and option identifiers with the Participation scheme.
- Disable controls while submission is pending.
- Preserve answers after recoverable failures.
- Navigate to the result route after an accepted or previously completed
  submission.

### Evidence

- Component tests cover missing sessions, public rendering, incomplete
  submissions, draft recovery, single submission, authorization headers and
  recoverable API errors.
- Playwright covers entry, answer selection, submission and result navigation.
