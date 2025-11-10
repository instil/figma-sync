## Security vulnerabilities fixed

All security warnings have been resolved by upgrading direct dependencies and using minimal resolutions for transitive dependencies.

### Direct dependency upgrades:

**Production dependencies:**
- **axios**: 1.6.0 → 1.13.2 (fixed high severity DoS vulnerability GHSA-4hjh-wcwx-xvwj)

**Development dependencies:**
- **jest**: 29.7.0 → 30.2.0 (brings in updated transitive dependencies with security fixes)
- **@types/jest**: 29.5.7 → 30.0.0 (matches jest version)
- **ts-jest**: 29.1.1 → 29.4.5 (latest compatible with TypeScript 5.2.2)
- **eslint**: 8.52.0 → 8.57.1 (brings in updated cross-spawn and other fixes)
- **@typescript-eslint/eslint-plugin**: 6.9.1 → 8.46.4 (latest stable)
- **@typescript-eslint/parser**: 6.9.1 → 8.46.4 (matches plugin version)
- **eslint-plugin-jest**: 27.6.0 → 28.10.0 (latest compatible)

### Transitive dependency resolutions (minimal set):
- **follow-redirects**: → 1.15.9 (fixed moderate severity Proxy-Authorization header issue)
- **axios**: → 1.13.2 (ensures consistent version across all dependencies)

### Previously tracked issues (now resolved):
- @babel/traverse (kept in resolutions)
- @babel/helpers (now resolved via jest upgrade)
- braces (now resolved via jest upgrade)
- cross-spawn (now resolved via eslint upgrade)
- micromatch (now resolved via jest upgrade)
- tar (now resolved via jest upgrade)
- brace-expansion (now resolved via jest/eslint upgrade)
- ip/socks (now resolved via jest upgrade)
- http-cache-semantics (kept in resolutions)
- json5 (kept in resolutions)
- semver (kept in resolutions)