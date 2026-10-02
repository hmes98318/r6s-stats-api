# Security and Privacy

- Do not read a user's personal browser profile, credentials, or session stores. Browser access must use its own isolated context.
- Treat fetched HTML, JSON, and scripts as untrusted data. Never evaluate extracted scripts or deserialize them with executable code.
- Limit client requests and redirects to the configured public integration origins. Do not forward session headers to unrelated hosts.
- Keep certificate validation enabled. Do not add CAPTCHA solvers, proxy rotation, or authentication bypasses.
- Do not log cookies, authorization headers, or complete upstream error bodies. Avoid committing captured player responses, browser state, and environment secrets.
- Store disposable live debugging captures only under ignored `.local/` or a developer-selected path.
