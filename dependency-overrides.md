## Security vulnerabilities fixed

All security warnings have been resolved by upgrading direct dependencies to their latest compatible versions.

### Direct dependency upgrades:

**Production dependencies:**
- **axios**: 1.6.0 → 1.13.2 (fixed high severity DoS vulnerability GHSA-4hjh-wcwx-xvwj)
- **style-dictionary**: 3.9.0 → 3.9.2 (latest 3.x with security fixes)

**Development dependencies:**
- **jest**: 29.7.0 → 30.2.0 (brings updated transitive dependencies with security fixes)
- **@types/jest**: 29.5.7 → 30.0.0 (matches jest version)
- **ts-jest**: 29.1.1 → 29.4.5 (latest compatible with TypeScript 5.2.2)
- **eslint**: 8.52.0 → 8.57.1 (brings updated cross-spawn and other fixes)
- **@typescript-eslint/eslint-plugin**: 6.9.1 → 8.46.4 (latest stable)
- **@typescript-eslint/parser**: 6.9.1 → 8.46.4 (matches plugin version)
- **eslint-plugin-jest**: 27.6.0 → 28.10.0 (latest compatible)
- **eslint-plugin-import**: 2.29.0 → 2.32.0 (latest stable)
- **ts-patch**: 3.0.2 → 3.3.0 (latest stable)

### Minimal resolutions:
- **axios**: 1.13.2 (ensures consistency across all dependencies, including figma-api transitive dependency)

All other security issues are now resolved through the upgraded packages:
- @babel/helpers (resolved via jest 30.x)
- @babel/traverse (resolved via jest 30.x)
- braces (resolved via jest 30.x)
- cross-spawn (resolved via eslint 8.57.1)
- micromatch (resolved via jest 30.x)
- tar (resolved via jest 30.x)
- brace-expansion (resolved via eslint/jest upgrades)
- follow-redirects (resolved via axios 1.13.2)
- http-cache-semantics (resolved via jest 30.x)
- json5 (resolved via style-dictionary 3.9.2 and jest 30.x)
- semver (resolved via jest 30.x and other package upgrades)
- ip/socks (resolved via jest 30.x)