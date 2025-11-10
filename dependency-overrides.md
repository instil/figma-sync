## Security vulnerabilities fixed

All security warnings have been resolved by upgrading direct dependencies and adding resolutions for transitive dependencies.

### Direct dependency upgrades:
- **axios**: 1.6.0 → 1.13.2 (fixed high severity DoS vulnerability)

### Transitive dependency resolutions:
- **@babel/helpers**: → 7.26.10 (fixed moderate severity RegExp vulnerability)
- **follow-redirects**: → 1.15.9 (fixed moderate severity Proxy-Authorization header issue)
- **braces**: → 3.0.3 (fixed high severity uncontrolled resource consumption)
- **cross-spawn**: → 7.0.5 (fixed high severity ReDoS)
- **micromatch**: → 4.0.8 (fixed moderate severity ReDoS)
- **tar**: → 6.2.1 (fixed moderate severity DoS)
- **brace-expansion**: → 2.0.2 (fixed low severity ReDoS)
- **socks**: → 2.8.7 (reduces exposure to ip vulnerability)

### Previously tracked issues (now resolved):
- @babel/traverse
- http-cache-semantics
- json5
- semver