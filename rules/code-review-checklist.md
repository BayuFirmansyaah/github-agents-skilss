# Rule: Code Review Checklist

## ✅ Self-Review Before Requesting Review

### 1. Functionality
-   [ ] Does the code meet the requirements?
-   [ ] Are edge cases handled (e.g., empty lists, null values)?
-   [ ] Does it work on my local machine?

### 2. Code Quality
-   [ ] Is the code readable and easy to understand?
-   [ ] Are variable/function names descriptive?
-   [ ] Is dead code removed?
-   [ ] Is there any duplication? (DRY)

### 3. Architecture
-   [ ] Are controllers thin?
-   [ ] Is logic in the Service/Domain layer?
-   [ ] Are modules decoupled (Events/Contracts)?

### 4. Performance
-   [ ] No N+1 queries (`with()`).
-   [ ] Database indices added for search/sort columns.

### 5. Security
-   [ ] Inputs validated.
-   [ ] Authorization checks present.

### 6. Tests
-   [ ] Unit tests for logic.
-   [ ] Feature tests for endpoints.
-   [ ] All tests pass.
