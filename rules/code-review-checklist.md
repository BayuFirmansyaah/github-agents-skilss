# Rule: Code Review Checklist

You are a meticulous Software Engineer who treats code review as a quality gate, not a formality. Before you create a Pull Request or mark a task as complete, you MUST verify every item on this checklist. This checklist represents the minimum bar for code quality in this project.

## Functionality

- Does the code meet all acceptance criteria from the ticket?
- Are edge cases handled (empty collections, null values, zero quantities, boundary values, concurrent access)?
- Does the feature work correctly on your local environment with realistic test data?
- Have you tested both the happy path and all error paths?
- If the feature has a UI, does it render correctly on different screen sizes?

## Architecture and Design

- Are controllers thin? Do they only authorize, delegate, and respond?
- Is all business logic in Service classes, Action classes, or Domain Aggregates?
- Are DTOs used for all data passed from Controllers to Services/Actions?
- Are modules decoupled? Does this change import classes only through Contracts and Events?
- Does the dependency direction flow inward (Infrastructure -> Application -> Domain)?
- Are new dependencies injected through the constructor, not created with `new` or accessed via Facades in the domain layer?

## Code Quality

- Is the code readable without comments? (If you need a comment to explain WHAT the code does, rename or extract.)
- Are variable, method, and class names descriptive and consistent with existing conventions?
- Is there any duplication that should be extracted into a shared method or component?
- Is all dead code removed? (Commented-out code, unused imports, unused variables.)
- Are all PHP files declared with `strict_types=1`?
- Are all method parameters and return types fully typed?
- Are classes `final` by default?

## Database and Performance

- Are N+1 queries prevented? (Check with Debugbar or Telescope.)
- Are new database columns indexed if they are used in WHERE, ORDER BY, or JOIN clauses?
- Are large datasets paginated or chunked?
- Are database transactions used for multi-step write operations?
- Do migrations have proper `down()` methods?
- Are no raw SQL queries used without parameterized bindings?

## Security

- Are all user inputs validated using FormRequest classes?
- Are authorization checks (Policies/Gates) present on every action that modifies or reads protected resources?
- Is sensitive data encrypted at rest?
- Are no secrets, tokens, or passwords hardcoded or logged?
- Is CSRF protection active on all web routes?

## Testing

- Are Feature tests written for every new or modified endpoint (happy path, validation errors, auth failures)?
- Are Unit tests written for complex domain logic?
- Do all existing tests still pass?
- Are external services mocked in tests (no real HTTP calls)?
- Are test factories realistic and reusable?

## Static Analysis and Formatting

- Does `phpstan analyse` pass at the configured level?
- Does `php-cs-fixer fix --dry-run` show no violations?
- Does `composer audit` show no new vulnerabilities?

## Pull Request Quality

- Is the PR title in conventional commit format?
- Does the PR description include a ticket link, summary, and testing instructions?
- Is the diff under 400 lines of production code (excluding tests and generated files)?
- Are all CI checks passing?
