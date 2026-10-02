# Coding Style

Follow the [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html). Explicit project exceptions and enforced configuration take precedence.

- Use four spaces for indentation and semicolons for statements and type members.
- Use single-quoted strings, named exports, `const` when possible, camelCase for functions and properties, and PascalCase for types and classes.
- Avoid `any`, unsafe type assertions, non-null assertions, enums, parameter properties, and executable namespaces.
- Prefer named imports and explicit type-only imports. Default imports are permitted when external packages require them.
- Validate untrusted data as `unknown` before assigning domain types.
- Write code comments in JSDoc format, including implementation explanations. Add useful descriptions to exported functions, classes, and contracts; do not merely restate identifiers.
- Keep functions focused, expose explicit return types, and use exceptions for failed requests or invalid source contracts.
- Use an 80-column code layout. Use ESLint with the existing Stylistic plugin to check and fix JavaScript and TypeScript formatting, and `.editorconfig` for editor indentation, line endings and whitespace settings. Keep Markdown prose unwrapped and preserve the immutable common baseline. Do not suppress checks broadly to hide implementation problems.
