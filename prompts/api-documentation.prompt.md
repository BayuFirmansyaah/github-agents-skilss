# Prompt: API Documentation

> **Agent:** [@backend](../agents/backend.agent.md)
> **Usage:** `@workspace using @backend and this prompt, generate API documentation for this controller`

## Objective

Generate **comprehensive API documentation** in markdown format for the provided Laravel controller, route file, or API Resource. The documentation must be complete enough for frontend developers and third-party integrators to consume the API without reading the source code.

## Instructions

1. **Identify all endpoints** from the controller methods and associated route definitions.

2. **For each endpoint, document:**

   | Section | Detail |
   |---------|--------|
   | HTTP Method & URL | `GET /api/v1/users/{id}` |
   | Description | One-line summary of what it does |
   | Authentication | Required? Which guard? |
   | Authorization | Which Policy/Gate? Required roles? |
   | Path Parameters | Name, type, description, constraints |
   | Query Parameters | Name, type, required/optional, default, description |
   | Request Body | JSON schema with types, validation rules, example |
   | Success Response | Status code, JSON structure, example |
   | Error Responses | All possible error codes with examples |
   | Rate Limiting | If applicable |

3. **Include request/response examples** with realistic data. Never use placeholder data like `"string"` or `"value"`.

4. **Document validation rules** by reading FormRequest classes. Translate Laravel validation rules into human-readable constraints.

## Output Format

```markdown
## {Resource Name}

### {Method} {URL}

{Description}

**Authentication:** Bearer Token required
**Authorization:** {Policy}

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | integer | Yes | User ID |

#### Request Body

\`\`\`json
{
    "name": "John Doe",
    "email": "john@example.com"
}
\`\`\`

#### Response 200

\`\`\`json
{
    "data": {
        "id": 1,
        "name": "John Doe"
    }
}
\`\`\`

#### Errors

| Status | Condition |
|--------|-----------|
| 401 | Missing or invalid token |
| 403 | Insufficient permissions |
| 422 | Validation failed |
```
