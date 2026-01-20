# Contributing to Talketeer

Thanks for your interest in contributing to Talketeer!

Talketeer is a feature-complete real-time chat application originally designed
and implemented by the project maintainer. During SWoC 2026, contributions are
**review-gated and scope-limited** to maintain stability and code quality.

Please read this document carefully before opening an issue or pull request.

---

## Tech Stack

- Frontend: React + TypeScript, React Query, Tailwind CSS, shadcn/ui, Socket.IO-client
- Backend: Node.js, Express, TypeScript, Socket.IO
- Database: MongoDB (Mongoose)
- Authentication: JWT (Access tokens and Refresh tokens)

---

## What Contributions Are Accepted

✅ **Accepted**
- Documentation improvements
- Bug fixes with clear reproduction steps
- Refactors that do **not** change behavior
- Test additions or improvements
- Minor UI/UX polish (no redesigns)
- Small, well-scoped features **only if explicitly approved by the maintainer**

❌ **Not Accepted**
- Major new features or feature expansions
- Architectural changes
- Tech stack migrations
- Performance rewrites
- Large refactors without prior discussion
- Unapproved feature implementations
- "Please assign me this issue" requests

Pull requests that fall outside the accepted scope, or that are submitted
without prior approval where required, may be closed without review.

---

## Before You Start

1. Check existing issues to avoid duplicates
2. Comment on the issue you want to work on
3. Wait for confirmation before starting work

Unapproved PRs may be closed to reduce review overhead.

---

## Branching & Commits

- `main` is the stable, release-ready branch and is used for deployments
- `dev` is the active development branch

All contributions should:
- Create a new branch from `dev`
- Open pull requests targeting `dev`, not `main`
- Keep PRs focused and minimal
- One logical change per PR

Pull requests made directly against `main` may be closed without review.

---

## Commit Messages

There is no strictly enforced commit message format for this repository.
Both conventional and unconventional commit styles are acceptable.

Commit messages should clearly describe the change being made.
If a message communicates intent and scope clearly, it is considered acceptable.

---

## Pull Request Guidelines

Your PR should:
- Clearly describe **what** changed and **why**
- Reference the related issue (if any)
- Avoid unrelated formatting changes
- Pass all checks (if applicable)

The maintainer reserves the right to request changes or close PRs that do not
align with the project goals.

---

## Code Style

- Follow existing code patterns
- Prefer clarity over cleverness
- Avoid premature optimization

---

## Final Note

This project prioritizes **code quality and stability** over rapid feature
growth. Contributions that respect this philosophy are always welcome.

Thank you for understanding and contributing responsibly.