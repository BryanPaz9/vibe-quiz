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
