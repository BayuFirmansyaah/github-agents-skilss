# Security Check — Prompt Template

## Objective

Perform a **comprehensive security audit** of the provided source code, focusing on OWASP Top 10 and Laravel-specific vulnerabilities.

## Audit Areas

1. **Injection** — SQL injection, command injection, LDAP injection, XPath injection.
2. **Broken Authentication** — weak hashing, missing rate limiting, session fixation.
3. **Sensitive Data Exposure** — secrets in code, unencrypted PII, verbose error messages.
4. **Broken Access Control** — missing policies, IDOR, privilege escalation.
5. **Security Misconfiguration** — debug mode, default credentials, permissive CORS.
6. **Cross-Site Scripting (XSS)** — unescaped output, unsafe `{!! !!}` usage.
7. **Mass Assignment** — missing `$fillable` / `$guarded`, unvalidated bulk updates.
8. **File Upload** — missing type validation, path traversal, oversized files.
9. **Dependency Vulnerabilities** — known CVEs in composer/npm packages.

## Output Format

### Security Findings

For each finding:

| Field | Detail |
|-------|--------|
| **Severity** | 🔴 Critical / 🟠 High / 🟡 Medium / 🔵 Low |
| **Vulnerability** | Name and CWE ID |
| **Location** | File and line(s) |
| **Impact** | What an attacker could achieve |
| **Remediation** | Specific fix with code example |

### Security Scorecard

Provide an overall score (A–F) with a brief justification.
