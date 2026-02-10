# Skill: Git Workflow

## Overview
We follow a strict feature-branch workflow. Direct commits to `main` or `staging` are prohibited.

## 🌿 Branching Strategy
-   **`main`**: Production-ready code.
-   **`staging`**: Pre-production testing.
-   **`dev`**: Integration branch for developers.
-   **Feature Branches**: `feature/ticket-ID-short-description` (e.g., `feature/USER-123-login-flow`)
-   **Bugfix Branches**: `fix/ticket-ID-short-description`
-   **Hotfix Branches**: `hotfix/release-version-issue`

## 💬 Commit Messages
We use **Conventional Commits**.
Format: `<type>(<scope>): <description>`

Examples:
-   `feat(auth): implement jwt login`
-   `fix(payment): resolve stuck transaction on timeout`
-   `refactor(user): move repository logic to service`
-   `chore(deps): update laravel framework`

## 🚀 Pull Request (PR) Protocol
1.  **Title**: Must match the commit format (e.g., `feat(auth): implement jwt login`).
2.  **Description**:
    -   Link to Jira/Trello ticket.
    -   Summary of changes.
    -   How to test.
3.  **Checks**:
    -   CI pipeline must pass (Linting, Tests, Static Analysis).
    -   At least 1 approval from a senior dev.
