# Supply Chain Risk Report — `bouldy-mobile`

**Scanned:** `/Users/Ambassador/Desktop/Ameerul/Work/bouldy/bouldy-mobile`  
**Manifests read:** `package.json`, `package-lock.json`  
**Scanned at:** 2026-10-28T10:21:45+00:00  
**Direct dependencies:** 24 (npm 24)

## Summary

- **No known advisory affects any of the 24 direct dependencies**, checked at the versions this project resolves.
- **2 transitive packages carry known advisories** at the locked versions — see Transitive advisories.
- 16 of 24 dependencies carry at least one finding, 12 of which reach production.
- Weakest coverage: **Publisher concentration**, established for 5 of 24; the Coverage section lists every criterion.

## Production dependencies

18 dependencies are declared as runtime dependencies and ship in the built artifact. Advisory status is given for every one, clean or not.

| Dependency | Version | Advisories | Other findings |
|---|---|---|---|
| `expo` | 58.0.20 | none known | — |
| `expo-constants` | 58.0.13 | none known | — |
| `expo-font` | 58.0.10 | none known | — |
| `expo-image` | 58.0.17 | none known | — |
| `expo-linking` | 58.0.14 | none known | — |
| `expo-router` | 58.0.27 | none known | — |
| `expo-secure-store` | 58.0.2 | none known | — |
| `expo-status-bar` | 58.0.4 | none known | — |
| `react` | 19.3.0 | none known | — |
| `react-dom` | 19.3.0 | none known | — |
| `react-native` | 0.88.0 | none known | — |
| `react-native-gesture-handler` | 3.3.0 | none known | — |
| `react-native-reanimated` | 4.7.1 | none known | — |
| `react-native-safe-area-context` | 5.10.1 | none known | — |
| `react-native-screens` | 4.30.0 | none known | — |
| `react-native-svg` | 15.16.0 | none known | — |
| `react-native-web` | 0.21.4 | none known | — |
| `react-native-worklets` | 0.13.0 | none known | — |

## Findings

### Build-time only

Declared as development dependencies. A compromise here reaches build and CI hosts rather than users of the shipped artifact.

| Dependency | Version | Weekly downloads | Findings |
|---|---|---|---|
| `@types/node` | 24.10.1 | 404,009,479/wk | single human publisher (types) of 1 listed |
| `@types/react` | 19.2.14 | 149,013,762/wk | single human publisher (types) of 1 listed |

## Upstream repository and CI hygiene — OpenSSF Scorecard

These criteria describe each dependency's own repository, not the audited
project. Remediation, where any exists, is upstream.

### Reaches production

| Dependency | Version | Weekly downloads | Findings |
|---|---|---|---|
| `expo` | 58.0.20 | 10,273,164/wk | Binary-Artifacts scores 0/10 (below 10) |
| `expo-constants` | 58.0.13 | 10,959,259/wk | Binary-Artifacts scores 0/10 (below 10) |
| `expo-font` | 58.0.10 | 9,836,626/wk | Binary-Artifacts scores 0/10 (below 10) |
| `expo-image` | 58.0.17 | 4,539,240/wk | Binary-Artifacts scores 0/10 (below 10) |
| `expo-linking` | 58.0.14 | 8,163,517/wk | Binary-Artifacts scores 0/10 (below 10) |
| `expo-router` | 58.0.27 | 6,974,632/wk | Binary-Artifacts scores 0/10 (below 10) |
| `expo-secure-store` | 58.0.2 | 6,452,455/wk | Binary-Artifacts scores 0/10 (below 10) |
| `expo-status-bar` | 58.0.4 | 7,689,769/wk | Binary-Artifacts scores 0/10 (below 10) |
| `react-native-gesture-handler` | 3.3.0 | 8,373,286/wk | Binary-Artifacts scores 8/10 (below 10) |
| `react-native-reanimated` | 4.7.1 | 8,559,417/wk | Binary-Artifacts scores 6/10 (below 10) |
| `react-native-screens` | 4.30.0 | 9,080,437/wk | Binary-Artifacts scores 7/10 (below 10) |
| `react-native-worklets` | 0.13.0 | 8,056,498/wk | Binary-Artifacts scores 6/10 (below 10) |

### Build-time only

Declared as development dependencies. A compromise here reaches build and CI hosts rather than users of the shipped artifact.

| Dependency | Version | Weekly downloads | Findings |
|---|---|---|---|
| `@playwright/test` | 1.58.2 | 69,157,992/wk | Binary-Artifacts scores 6/10 (below 10) |
| `eslint-config-expo` | 58.0.0 | 2,469,504/wk | Binary-Artifacts scores 0/10 (below 10) |

## Transitive advisories

2 packages of the 784 registry-verified packages beyond the direct set (resolved by `package-lock.json`) carry known advisories at the locked versions. Only advisories were checked at this depth.

| Package | Version | Reaches | Advisories |
|---|---|---|---|
| `deepmerge` (npm) | 4.3.1 | production | GHSA-gcqx-w48m-w2h4 |
| `zod` (npm) | 3.25.76 | production | GHSA-mrhx-c7xc-m3w5 |

## Informational

Measured, not flagged.

- **CI token permissions**: median 0/10 across 19 scored dependencies; 18 score below 6. Not flagged — this measures whether CI workflows declare least-privilege tokens, which tracks project maturity rather than the likelihood of malicious code being published.
- **Changes reviewed by a second person**: median 9/10 across 19 scored dependencies; 4 score below 6. Not flagged — this measures the share of recent commits reviewed by a second person, which is low for most small single-maintainer projects and largely restates publisher concentration.
- **Publish provenance**: 19 of 24 publish with build provenance.
  Without: `@types/node`, `@types/react`, `eslint`, `react-native-web`, `typescript`
- **Security policy published**: 16 of 24 publish a security policy.
  Without: `react-native`, `react-native-gesture-handler`, `react-native-reanimated`, `react-native-safe-area-context`, `react-native-screens`, `react-native-svg`, `react-native-web`, `react-native-worklets`
- **Download volume**: established for 24 of 24; median 9,762,808/week. Lowest: `eslint-config-expo` (2,469,504/wk), `expo-image` (4,539,240/wk), `expo-secure-store` (6,452,455/wk).

## Coverage

What was and was not measured, per criterion.

| Criterion | Tier | Assessed | Flagged | Not assessable |
|---|---|---|---|---|
| Known advisories | A | 24/24 | 0 | 0 |
| Deprecated or yanked | A | 24/24 | 0 | 0 |
| Repository archived | A | 24/24 | 0 | 0 |
| Maintenance activity | A | 24/24 | 0 | 0 |
| Publisher concentration | B | 5/24 | 2 | 19 |
| Install-time script execution | B | 24/24 | 0 | 0 |
| Dangerous CI workflow | scorecard | 19/24 | 0 | 5 |
| CI token permissions | scorecard | 19/24 | 0 | 5 |
| Checked-in binaries | scorecard | 19/24 | 14 | 5 |
| Changes reviewed by a second person | scorecard | 19/24 | 0 | 5 |
| Publish provenance | info | 24/24 | 0 | 0 |
| Security policy published | info | 24/24 | 0 | 0 |
| Download volume | info | 24/24 | 0 | 0 |

## Not assessable

**Checked-in binaries**

- 5 dependencies — OpenSSF Scorecard has no report for this repository: `react`, `react-dom`, `react-native`, `react-native-safe-area-context`, `react-native-svg`

**Changes reviewed by a second person**

- 5 dependencies — OpenSSF Scorecard has no report for this repository: `react`, `react-dom`, `react-native`, `react-native-safe-area-context`, `react-native-svg`

**Dangerous CI workflow**

- 5 dependencies — OpenSSF Scorecard has no report for this repository: `react`, `react-dom`, `react-native`, `react-native-safe-area-context`, `react-native-svg`

**Publisher concentration**

- 19 dependencies — publishes from CI with provenance, so the effective publisher set is whoever can merge to the release branch — not externally observable: `@playwright/test`, `eslint-config-expo`, `expo`, `expo-constants`, `expo-font`, `expo-image` and 13 more

**CI token permissions**

- 5 dependencies — OpenSSF Scorecard has no report for this repository: `react`, `react-dom`, `react-native`, `react-native-safe-area-context`, `react-native-svg`

## Method and caveats

- gh is not authenticated. GitHub allows 60 requests/hour unauthenticated against 5000 authenticated, so repository signals may be unassessable.
- Repository-level criteria (archived, maintenance activity, security policy, and the Scorecard checks) describe the source repository rather than the package. 24 dependencies resolve to 13 distinct repositories, so one repository can appear as several findings. Shared: github.com/DefinitelyTyped/DefinitelyTyped, github.com/expo/expo, github.com/react/react, github.com/software-mansion/react-native-reanimated
- Optional tooling detected: npm. Not installed, so not used: bundler-audit, cargo-audit, osv-scanner, pip-audit.
- Every criterion except advisories applies to direct dependencies only. The 784 registry-verified packages resolved by package-lock.json were checked for known advisories at their locked versions, and for nothing else.
- HTTP sources: 59 fetched, 90 served from cache (oldest 0.1h old), 0 refetched as stale, 0 unavailable offline, 0 errors.
