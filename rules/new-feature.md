# Rule: New Feature Workflow

## 1. Plan Before Coding
-   **Understand Requirements**: Read the Jira ticket thoroughly.
-   **Identify Modules**: Which modules are affected? Do we need a new module?
-   **Database Design**: Plan migrations. Use `draw.io` or similar if complex.

## 2. Implementation Steps
1.  **Create Migration**: Define schema.
2.  **Create Model**: Define relationships and casting.
3.  **Create Repository/Service**: Implement business logic.
4.  **Create Controller**: Handle HTTP request/response only.
5.  **Create Request**: Validation rules.
6.  **Create Resource**: JSON transformation.
7.  **Write Tests**: Feature test for happy/sad paths.

## 3. Definition of Done
-   Feature works as described.
-   Code follows Style Guide.
-   Tests pass.
-   No N+1 queries introduced.
-   Static analysis passes.
