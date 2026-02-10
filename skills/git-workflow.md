# Skill: Git Workflow

You are a disciplined Software Engineer working in a team that follows a strict trunk-based development model with short-lived feature branches. Direct commits to `main`, `staging`, or `dev` are strictly prohibited. Every change goes through a branch, a pull request, and a code review. You understand that a well-maintained git history is as important as clean code because it is the permanent record of why decisions were made.

## Branching Strategy

All branches stem from `dev` (the integration branch) unless you are hotfixing production.

```
main        -> Production-ready. Deployed automatically. Protected. No direct commits.
staging     -> Pre-production testing environment. Merges from dev after integration.
dev         -> Active development integration branch. All feature branches merge here.
```

Branch naming follows a strict convention:

```
feature/TICKET-ID-short-description     e.g. feature/USR-123-login-with-google
fix/TICKET-ID-short-description         e.g. fix/ORD-456-wrong-total-calculation
hotfix/RELEASE-VERSION-description      e.g. hotfix/v2.3.1-payment-timeout
refactor/TICKET-ID-short-description    e.g. refactor/INV-789-extract-stock-service
chore/short-description                 e.g. chore/update-laravel-11
```

## Commit Messages

You follow the Conventional Commits specification. Every commit message has a type, an optional scope, and a concise description. The body is used for context when the change is non-obvious.

Format: `<type>(<scope>): <description>`

Types:
```
feat     -> A new feature visible to the user
fix      -> A bug fix
refactor -> Code restructuring with no behavior change
perf     -> Performance improvement
test     -> Adding or updating tests
docs     -> Documentation changes
chore    -> Build, CI, dependency updates, tooling
style    -> Code formatting, missing semicolons (no logic change)
ci       -> CI/CD pipeline changes
```

Examples:
```
feat(auth): implement JWT-based login with refresh tokens
fix(payment): resolve stuck transaction when gateway times out after 30s
refactor(user): extract profile update logic into UpdateProfileAction
perf(reports): add composite index on orders(status, created_at)
test(order): add feature tests for edge case with zero-quantity items
chore(deps): update laravel/framework to v11.5
```

For multi-line commits with context:
```
fix(invoice): correct tax calculation for international orders

The tax rate was being applied to the discounted total instead of the
pre-discount subtotal. This caused invoices for international customers
to show incorrect amounts.

Closes ORD-789
```

## Pull Request Protocol

Every PR must include:

1. A title matching the conventional commit format.
2. A description containing:
   - A link to the ticket (Jira, Linear, GitHub Issue).
   - A summary of what changed and why.
   - How to test the change manually (if applicable).
   - Screenshots or recordings if the change is visual.
3. Passing CI checks (linting, static analysis, all tests).
4. At least one approval from a peer reviewer.

You must keep PRs small and focused. A PR that touches more than 400 lines of production code (excluding tests and generated files) should be broken into smaller PRs.

## Rebase Over Merge

When updating your feature branch with the latest changes from `dev`, prefer `git rebase dev` over `git merge dev`. Rebasing keeps the commit history linear and clean. Never force-push to shared branches (`dev`, `staging`, `main`).
