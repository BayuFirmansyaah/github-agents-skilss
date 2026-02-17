# Prompt: Security Audit

> **Agent:** [@security](../agents/security.agent.md)
> **Usage:** `@workspace using @security and this prompt, audit this code for vulnerabilities`

## Objective

Perform a **comprehensive security audit** of the provided source code, focusing on OWASP Top 10 and Laravel-specific attack vectors.

## Audit Checklist

| # | Category | What to look for |
|---|----------|-----------------|
| 1 | **Injection** | SQL injection, command injection, LDAP injection, XPath injection |
| 2 | **Broken Auth** | Weak hashing, missing rate limiting, session fixation, JWT issues |
| 3 | **Sensitive Data** | Secrets in code, unencrypted PII, verbose error messages in production |
| 4 | **Broken Access Control** | Missing policies, IDOR, privilege escalation, missing `$this->authorize()` |
| 5 | **Security Misconfig** | Debug mode on, default credentials, permissive CORS, disabled CSRF |
| 6 | **XSS** | Unescaped output `{!! !!}`, unsanitised HTML, missing Content-Security-Policy |
| 7 | **Mass Assignment** | Missing `$fillable`/`$guarded`, `$request->all()` in create/update |
| 8 | **File Upload** | Missing MIME validation, path traversal, oversized files without limits |
| 9 | **Dependencies** | Known CVEs in composer/npm packages, unmaintained packages |
| 10 | **Logging** | Sensitive data in logs, missing audit trail for critical operations |

## Output Format

Use the structured finding format and security scorecard defined in the [@security agent](../agents/security.agent.md#output-format).
