# Architecture and Product Decision Log

This document records the important choices made while building the Agentic Interview Platform. It explains not only what was selected, but also the problem being solved, alternatives considered, reasoning, trade-offs, and consequences.

The log is a living project document. Every meaningful product, design, architecture, technology, security, data, and deployment decision will be discussed before implementation and added here after approval.

## Decision status

- **Proposed:** Under discussion; not approved for implementation.
- **Accepted:** Approved and active.
- **Superseded:** Replaced by a later decision.
- **Revisit:** Accepted temporarily, with a defined reason to review it later.

---

## D-001 — Build a full web application

- **Date:** 28 July 2026
- **Status:** Accepted
- **Decision:** Build the product as a complete browser-based web application rather than a command-line demo, notebook, or isolated chatbot.

### Context

The product needs a multi-step candidate journey: resume and job-description intake, interview configuration, preparation, a live voice/text/coding interview, feedback, downloadable reports, and progress history. Recruiters should also be able to see a credible, production-style application rather than only an AI proof of concept.

### Why this was chosen

A web application is the most natural delivery surface for document upload, live conversational interaction, voice input, code editing, streamed responses, and visual feedback. It also demonstrates full-stack engineering alongside the AI workflow.

### Alternatives considered

- **Notebook demo:** Fast for experimentation, but unsuitable for a complete user journey or recruiter-facing product.
- **CLI application:** Useful for backend prototyping, but weak for voice, document upload, code editing, and feedback visualisation.
- **Chatbot-only interface:** Too narrow; it would not adequately support setup, timed interview state, reports, and progress tracking.

### Consequences and trade-offs

The project needs frontend state management, accessibility, responsive design, API contracts, real-time communication, and deployment. This creates more work than an isolated AI demo, but produces a substantially stronger portfolio project.

---

## D-002 — Use a public GitHub repository

- **Date:** 28 July 2026
- **Status:** Accepted
- **Decision:** Develop the project in the public GitHub repository `Saiadarsh16/agentic-interview-platform`.

### Context

One of the project goals is visibility to recruiters. They should be able to inspect the codebase, commit history, architecture, documentation, testing approach, and deployment configuration.

### Why this was chosen

A public repository makes the work directly reviewable and supports a transparent development history. It also encourages production-safe practices from the beginning.

### Alternatives considered

- **Private repository initially:** Reduces the risk of exposing unfinished work, but provides no recruiter visibility until it is made public.
- **Local-only development:** Simple initially, but offers no collaboration or portfolio value.

### Consequences and trade-offs

All secrets, API keys, candidate resumes, job descriptions, transcripts, and personal data must remain outside Git. The repository needs a strong `.gitignore`, safe sample data, an `.env.example`, and secret-scanning discipline.

---

## D-003 — Use a monorepo

- **Date:** 28 July 2026
- **Status:** Accepted
- **Decision:** Keep frontend, backend, infrastructure, documentation, and project-level tests in one repository.

### Context

The frontend, FastAPI backend, LangGraph workflow, evaluation tools, and infrastructure will evolve together. Recruiters should be able to understand the entire system without navigating multiple repositories.

### Why this was chosen

A monorepo simplifies coordinated changes, shared documentation, local setup, end-to-end testing, and version history. It is appropriate for a portfolio project owned by one small team.

### Alternatives considered

- **Separate repositories:** Can provide clearer ownership and independent release cycles at organisational scale, but adds coordination and discovery overhead here.

### Consequences and trade-offs

The repository requires clear boundaries between application layers. CI should eventually run only the checks affected by a change, and frontend/backend dependencies must not be mixed.

---

## D-004 — Use React, TypeScript, and Vite for the frontend

- **Date:** 28 July 2026
- **Status:** Accepted
- **Decision:** Build the frontend with React, TypeScript, and Vite.

### Context

The interface is an application-style experience with document intake, live interview state, streaming messages, timers, voice controls, a coding workspace, feedback visualisations, and a session dashboard. The backend will independently use FastAPI.

### Why this was chosen

- **React** provides a mature component model and ecosystem for complex interactive interfaces.
- **TypeScript** makes API payloads, interview state, event messages, evaluator outputs, and component contracts safer and easier to refactor.
- **Vite** provides a fast, lightweight development and build experience without adding a second server-side application framework.

This keeps responsibilities clear: React owns browser interaction, while FastAPI owns business logic, AI orchestration, authentication APIs, persistence, and real-time backend communication.

### Alternatives considered

- **Next.js + TypeScript:** Strong for server rendering, route conventions, and public-content SEO. However, its server layer would overlap with FastAPI and introduce two backend execution models.
- **JavaScript instead of TypeScript:** Slightly faster to start, but less safe as shared state and streaming event contracts become more complex.
- **Create React App:** Familiar, but Vite offers a more modern and faster toolchain.

### Consequences and trade-offs

Public marketing pages will initially be client-rendered, so advanced SEO may require later work. The team must define typed API contracts and decide how those types will be generated or shared. Routing, styling, data fetching, and client-state libraries remain separate decisions and are not implied by this choice.

---

## D-005 — Use the Warm Editorial Coach design direction

- **Date:** 28 July 2026
- **Status:** Accepted
- **Decision:** Use a warm, editorial, human coaching visual system across the product.

### Context

Interview practice is stressful. The interface should feel calm, thoughtful, and personal while still communicating the credibility of a technically advanced platform.

### Why this was chosen

The warm editorial direction distinguishes the product from generic dark AI dashboards and makes it feel like a trusted coach. It supports readable long-form feedback, focused interview screens, and an approachable preparation journey.

### Alternatives considered

- **Modern Technical Confidence:** Polished SaaS styling, but less personal.
- **Terminal Command Centre:** Strong developer identity, but too narrow and intense for behavioural, recruiter, and voice interview modes.

### Consequences and trade-offs

Typography, colour, spacing, motion, and component styling should reinforce calm focus. The live interview screen must remain distraction-free, and visual warmth must not reduce accessibility, contrast, or technical credibility. Exact design tokens and styling implementation remain future decisions.

---

## D-006 — Make decisions collaboratively before implementation

- **Date:** 28 July 2026
- **Status:** Accepted
- **Decision:** Discuss every meaningful product, design, architecture, technology, security, data, and deployment choice before implementing it.

### Context

The project is both a working product and a learning/portfolio exercise. The project owner wants to understand and participate in the reasoning rather than receive a finished codebase built through hidden assumptions.

### Why this was chosen

Collaborative decisions create stronger ownership and make the final architecture easier to explain in interviews. Recording the reasoning also shows recruiters that the technology choices were deliberate.

### Working rule

Before a meaningful decision:

1. Define the problem.
2. Present realistic options.
3. Explain the recommendation and trade-offs.
4. Wait for the project owner’s choice.
5. Implement only the approved option.
6. Record the accepted decision in this log.

Low-impact mechanical actions—formatting, fixing a typo, or following an already-approved convention—do not require a separate decision.

### Consequences and trade-offs

Development may move more slowly than a fully autonomous build, but decisions will be explicit, teachable, and defensible. Proposed choices must not silently become implemented architecture.

---

## D-007 — Use Tailwind CSS v4

- **Date:** 28 July 2026
- **Status:** Accepted
- **Decision:** Use Tailwind CSS v4 as the frontend styling foundation, integrated through its official Vite plugin.

### Context

The Warm Editorial Coach direction needs a consistent way to apply spacing, colour, typography, responsive behaviour, and interaction states across the landing page, interview setup, live interview, feedback, and dashboard experiences. The styling approach must work naturally with the existing React, TypeScript, and Vite frontend.

### Why this was chosen

Tailwind CSS v4 provides a utility-first styling system that supports rapid interface development while keeping design decisions consistent. Its official Vite plugin fits the selected frontend toolchain directly, and its CSS-first configuration keeps the initial setup small. Version 4 was selected over version 3 because this project is starting fresh and does not need compatibility with legacy Tailwind configuration.

### Alternatives considered

- **Tailwind CSS v3:** Mature and supported by many existing tutorials, but uses an older configuration and integration approach that would add legacy setup to a new project.
- **CSS Modules:** Provides strong component-level isolation, but requires more custom CSS and shared conventions to maintain a consistent design system.
- **Plain structured CSS:** Has no additional framework dependency, but would require more manual naming, reuse, responsive styling, and design-token discipline as the application grows.

### Consequences and trade-offs

Components can become difficult to read if long utility-class strings are repeated. Shared visual patterns should therefore be extracted into reusable React components, while global design tokens should remain deliberate and limited. Selecting Tailwind does not decide the final colour palette, typography, component library, or page layouts; those remain separate collaborative decisions.

---

## Approved direction not yet implemented

The following choices have been agreed at the product level but will receive their own detailed entries when their implementation is planned:

- FastAPI backend
- LangGraph orchestration
- OpenAI models behind a replaceable provider interface
- Pinecone retrieval
- Redis for live state and short-term memory
- PostgreSQL for durable application data
- WebSockets for the live interview
- Text mode before voice mode
- Python and SQL as the first executable languages
- AWS EKS as the final deployment target

## Next decision

The next frontend decision should define the component strategy: whether to build accessible components in-house, adopt a headless component foundation, or use a pre-styled UI library.
