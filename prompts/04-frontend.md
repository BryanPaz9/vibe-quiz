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

### Checkpoint sequence

1. Resolve and submit the quiz — completed.
2. Display result and public ranking — completed.
3. Implement administrative authentication as the fourth overall frontend
   checkpoint — completed.

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

## Public flow checkpoint 3 — Result and ranking

### Scope

- Retrieve the result only with the opaque participation token.
- Verify that the URL participation matches the per-tab session.
- Render score, total, percentage, duration and completion time from the
  backend.
- Mark completed attempts locally and prevent returning to the player.
- Render the public ranking without authentication or additional personal
  data.
- Support loading, safe error and empty ranking states.

### Evidence

- Component tests cover authorization, authoritative values, invalid tokens,
  completion state, ranking entries and empty rankings.
- Duration formatting has deterministic unit tests.
- Playwright covers the complete public journey through result and ranking.

## Administrative authentication checkpoint 4

### Scope

- Validate the login form without publishing or pre-filling credentials.
- Authenticate through the approved login endpoint and verify `/auth/me`.
- Keep the short-lived JWT exclusively in memory.
- Restore only protected internal destinations after a successful login.
- Clear the session after expiration, an administrative `401`, or logout.
- Display the verified administrator identity in the protected layout.

### Evidence

- Component tests cover form validation, invalid credentials, identity
  verification, protected-route restoration, expiration and logout.
- API client tests cover the Bearer scheme and session clearing after `401`.
- Playwright covers login, access to the administrative shell and logout.

## Administrative quiz list checkpoint 1

### Scope

- Replace the `/admin/quizzes` placeholder using the approved
  `GET /admin/quizzes` contract.
- Send `page`, `pageSize`, optional `status` and optional `search` with Bearer
  authentication.
- Keep pagination, search and status in the URL and reset the page when search
  or status changes.
- Render title, status, question and participation counts, and backend dates.
- Support loading, empty, no-results and recoverable-error states with retry.
- Navigate to the approved creation and detail routes without implementing
  those later checkpoints.
- Reuse global administrative `401` session clearing.

### Traceability

- Functional requirement: `FR-003`.
- User story: `US-003`.
- Acceptance criteria: `AC-001`, `AC-004`, `AC-015`, `AC-016`.

### Evidence

- MSW fixtures derive the list response from the approved REST contract.
- Component tests cover rendering, Bearer authorization, empty and no-result
  states, retry, URL filters, pagination, navigation and administrative `401`.
- Playwright covers login followed by the authenticated administrative list.

## Administrative quiz creation checkpoint 2

### Scope

- Replace the `/admin/quizzes/new` placeholder.
- Build the complete aggregate with title, optional description, questions,
  options, explicit order and exactly one correct answer per question.
- Apply the approved length and minimum-count validation rules.
- Support accessible add, remove, move-up and move-down controls.
- Submit only the approved `QuizContentInput` fields through
  `POST /admin/quizzes` with Bearer authentication.
- Preserve the form after recoverable errors and navigate to the returned
  administrative detail identifier after success.

### Traceability

- Functional requirements: `FR-002`, `FR-006`, `FR-007`.
- User story: `US-002`.
- Business rules: `BR-001`, `BR-002`, `BR-003`, `BR-004`.
- Acceptance criteria: `AC-002`, `AC-003`.

### Evidence

- Component tests cover client validation, dynamic aggregate management,
  explicit positions, correct-answer selection, Bearer authorization, retry
  and administrative `401`.
- MSW implements the approved creation shape without additional fields.
- Playwright covers login, list navigation, aggregate creation and navigation
  to the returned detail route.

## Administrative quiz detail and editing checkpoint 3

### Scope

- Replace the `/admin/quizzes/:id` placeholder.
- Retrieve the approved administrative aggregate through
  `GET /admin/quizzes/:quizId` with Bearer authentication.
- Pre-fill and reuse the aggregate editor only when status is `DRAFT`.
- Replace a valid draft through `PUT /admin/quizzes/:quizId`.
- Render `PUBLISHED` and `CLOSED` content, dates and correct answers in
  read-only mode.
- Preserve local edits after recoverable update errors and reuse global
  administrative `401` handling.

### Traceability

- Functional requirements: `FR-003`, `FR-004`, `FR-006`, `FR-007`.
- User stories: `US-003`, `US-004`.
- Business rules: `BR-002`, `BR-003`, `BR-004`, `BR-005`.
- Acceptance criteria: `AC-003`, `AC-004`.

### Evidence

- Component tests cover Bearer detail retrieval, draft pre-fill, full
  replacement, read-only states, retry, update conflicts and `401`.
- The creation and editing pages share the same validated aggregate form.
- Playwright covers login, list navigation, detail retrieval and draft update.

## Administrative results and ranking checkpoint 4

### Scope

- Replace `/admin/quizzes/:id/results` and `/admin/quizzes/:id/ranking`
  placeholders.
- Consume paginated administrative results and the approved ranking shape with
  Bearer authentication.
- Present completed and active participations without calculating authoritative
  values in the client.
- Synchronize result pagination with the URL.
- Support loading, empty, recoverable-error, retry and administrative `401`
  states.
- Link detail, results and ranking without exposing additional data.
- Replace option-order labels with accessible arrow buttons and hover titles.

### Contract and security alignment

- The administrative results response was documented explicitly.
- The backend now maps only alias, status, score, total, percentage, start,
  completion and duration.
- `accessTokenHash`, `normalizedAlias` and persistence-only fields are excluded
  and protected by an API end-to-end assertion.

### Traceability

- Functional requirements: `FR-019`, `FR-020`, `FR-022`, `FR-024`.
- User stories: `US-007`, `US-008`, `US-016`.
- Business rules: `BR-015`, `BR-016`.
- Acceptance criteria: `AC-012`, `AC-013`, `AC-015`.

### Evidence

- Component tests cover results, active values, pagination, ranking, empty
  states, retry, Bearer and `401`.
- Backend API tests prevent exposure of access hashes and normalized aliases.
- Playwright covers login, detail, administrative results and ranking.

## Administrative quiz lifecycle checkpoint 5

### Scope

- Publish a `DRAFT` quiz through the approved Bearer endpoint after explicit
  confirmation.
- Display, open and copy the public participation URL after publication.
- Close a `PUBLISHED` quiz after explicit confirmation and refresh its
  authoritative state.
- Permanently delete only an eligible `DRAFT` quiz after destructive
  confirmation.
- Expose controls only for valid transitions, prevent repeated submissions and
  preserve the detail after recoverable conflicts.
- Reuse global administrative `401` handling.

### Traceability

- Functional requirements: `FR-005`, `FR-008`.
- User stories: `US-005`, `US-006`.
- Business rules: `BR-001`, `BR-005`.
- Open decisions resolved by the approved contract: `OD-003`, `OD-007`.
- Acceptance criteria: `AC-005`, `AC-006`, `AC-007`.

### Evidence

- Component tests cover publication, public URL copy, closing, eligible
  deletion, rejected deletion, Bearer authorization and administrative `401`.
- MSW fixtures reproduce the exact approved publication response and lifecycle
  endpoints.
- Playwright covers login followed by publication, public-link exposure and
  closing.

### Remaining frontend work

- Run the final integrated browser-validation checkpoint against the real
  backend and its supported database.
