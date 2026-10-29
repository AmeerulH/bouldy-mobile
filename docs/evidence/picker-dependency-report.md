# Supply Chain Risk Report — `bouldy-picker-review`

**Scanned:** `/tmp/bouldy-picker-review`  
**Manifests read:** `package.json`  
**Scanned at:** 2026-10-28T10:27:16+00:00  
**Direct dependencies:** 1 (npm 1)

## Summary

- **No known advisory affects any of the 1 direct dependencies**, checked at the versions this project resolves.
- Transitive dependencies were **not examined**: no lockfile resolves the transitive tree (package-lock.json, uv.lock, or a go 1.17+ go.mod).
- 1 of 1 dependencies carry at least one finding, 1 of which reaches production.
- Weakest coverage: **Known advisories**, established for 1 of 1; the Coverage section lists every criterion.

## Production dependencies

1 dependency is declared as runtime dependencies and ship in the built artifact. Advisory status is given for every one, clean or not.

| Dependency | Version | Advisories | Other findings |
|---|---|---|---|
| `@react-native-picker/picker` | 2.11.4 | none known | Publisher concentration |

## Findings

### Reaches production

| Dependency | Version | Weekly downloads | Findings |
|---|---|---|---|
| `@react-native-picker/picker` | 2.11.4 | 780,487/wk | single human publisher (naturalclar) of 1 listed |

## Upstream repository and CI hygiene — OpenSSF Scorecard

These criteria describe each dependency's own repository, not the audited
project. Remediation, where any exists, is upstream.

### Reaches production

| Dependency | Version | Weekly downloads | Findings |
|---|---|---|---|
| `@react-native-picker/picker` | 2.11.4 | 780,487/wk | Binary-Artifacts scores 8/10 (below 10) |

## Transitive advisories

Not examined: no lockfile resolves the transitive tree (package-lock.json, uv.lock, or a go 1.17+ go.mod). Commit a lockfile to close this gap.

## Informational

Measured, not flagged.

- **CI token permissions**: median 0/10 across 1 scored dependencies; 1 score below 6. Not flagged — this measures whether CI workflows declare least-privilege tokens, which tracks project maturity rather than the likelihood of malicious code being published.
- **Changes reviewed by a second person**: median 4/10 across 1 scored dependencies; 1 score below 6. Not flagged — this measures the share of recent commits reviewed by a second person, which is low for most small single-maintainer projects and largely restates publisher concentration.
- **Publish provenance**: 0 of 1 publish with build provenance.
  Without: `@react-native-picker/picker`
- **Security policy published**: 0 of 1 publish a security policy.
  Without: `@react-native-picker/picker`
- **Download volume**: established for 1 of 1; median 780,487/week. Lowest: `@react-native-picker/picker` (780,487/wk).

## Coverage

What was and was not measured, per criterion.

| Criterion | Tier | Assessed | Flagged | Not assessable |
|---|---|---|---|---|
| Known advisories | A | 1/1 | 0 | 0 |
| Deprecated or yanked | A | 1/1 | 0 | 0 |
| Repository archived | A | 1/1 | 0 | 0 |
| Maintenance activity | A | 1/1 | 0 | 0 |
| Publisher concentration | B | 1/1 | 1 | 0 |
| Install-time script execution | B | 1/1 | 0 | 0 |
| Dangerous CI workflow | scorecard | 1/1 | 0 | 0 |
| CI token permissions | scorecard | 1/1 | 0 | 0 |
| Checked-in binaries | scorecard | 1/1 | 1 | 0 |
| Changes reviewed by a second person | scorecard | 1/1 | 0 | 0 |
| Publish provenance | info | 1/1 | 0 | 0 |
| Security policy published | info | 1/1 | 0 | 0 |
| Download volume | info | 1/1 | 0 | 0 |

## Not assessable

Every criterion was assessable for every dependency.

## Method and caveats

- gh is not authenticated. GitHub allows 60 requests/hour unauthenticated against 5000 authenticated, so repository signals may be unassessable.
- Optional tooling detected: npm. Not installed, so not used: bundler-audit, cargo-audit, osv-scanner, pip-audit.
- Direct dependencies only. Advisories attach to the package that ships the affected code, so an umbrella package can look clean while its components are not — rails 5.0.0 reports 0 advisories where actionpack 5.0.0 reports 10. Transitive dependencies were not examined: no lockfile resolves the transitive tree (package-lock.json, uv.lock, or a go 1.17+ go.mod).
- HTTP sources: 5 fetched, 1 served from cache (oldest 0.0h old), 0 refetched as stale, 0 unavailable offline, 0 errors.
