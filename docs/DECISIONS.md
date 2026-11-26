# Decisions

The project's methodology, recorded once so it stays consistent. To change
one, add a new entry that says which decision it replaces and why, and update
the old entry's status to "Superseded by Dn". Never change course silently.

---

## D1. A static, prerendered single page

**Status:** Accepted

A personal website is content, not an application. The page is rendered to
HTML at build time and served as static files. React then hydrates it, so the
content is readable without JavaScript (search engines, link previews, slow
devices).

**Consequences:** no server, no database, no router. Nothing to patch or
attack at runtime, and hosting costs cents.

## D2. React + TypeScript + Vite + Tailwind

**Status:** Accepted

Taken from the owner's resume (React, TypeScript, Tailwind) so the site is
also a work sample. Vite is the standard React build tool and its official
`react-ts` template is the baseline (including oxlint). Node 26 LTS, npm.

**Rejected:** Next.js or Astro (more framework than one page needs; not on the
resume), plain HTML (doesn't show the resume stack).

## D3. Content lives in one typed file

**Status:** Accepted

All text is in `src/content/resume.ts`. Updating the site after a new job is a
one-file edit, and TypeScript catches missing fields.

## D4. Styling with Tailwind utilities and design tokens

**Status:** Accepted

Utilities in JSX, colors as tokens in `src/index.css`, light and dark mode
from the system setting, system font stack. No component library, no web
fonts, no extra CSS files.

## D5. Quality gates: oxlint, Prettier, tsc, Playwright

**Status:** Accepted

Playwright is the only test tool (it's on the resume). Tests run against the
real production build with production security headers and cover rendering,
prerendering, console/CSP errors, accessibility (axe, WCAG 2.1 AA), and a
privacy guard. Add a unit-test tool only if real logic appears.

## D6. AWS hosting defined in OpenTofu

**Status:** Accepted

S3 (private) + CloudFront (Origin Access Control, HTTPS, HTTP/3) + ACM +
Route 53, with the bucket in ca-central-1. All defined in OpenTofu, matching
the resume (AWS, OpenTofu). State is in a versioned S3 bucket with native
lockfile locking (OpenTofu 1.10+), so no DynamoDB table.

Infrastructure changes are planned and applied by the owner from their own
computer (`tofu plan` → review → `tofu apply`). CI only checks formatting,
validity, and security (checkov). This keeps admin rights out of CI.

**Rejected:** GitHub Pages, Netlify, Vercel (simpler, but don't show the AWS
and IaC skills on the resume).

## D7. GitHub Flow with protected main

**Status:** Accepted

Short-lived branches, pull requests, required checks, squash merge,
Conventional Commits. Merging to `main` is the only way to deploy.

## D8. Deploy from GitHub Actions with OIDC

**Status:** Accepted

One workflow (`pipeline.yml`). Pull requests run the secret scan, the site
checks, and the infra checks. On `main` the same checks run, then the
`production` environment job deploys exactly the build artifact that passed.
AWS access uses a short-lived OIDC token for a role that can only write to one
bucket and invalidate one distribution, and only from the `production`
environment of this repository. No long-lived AWS keys exist.

## D9. Security baseline and accepted risks

**Status:** Accepted

In place: gitleaks pre-commit hook (fails closed), gitleaks in CI, GitHub
secret scanning with push protection, Dependabot, strict CSP and security
headers (HSTS, nosniff, DENY framing, referrer and permissions policies),
TLS 1.2+, private bucket with TLS-only policy, least-privilege deploy role,
monthly AWS budget alert, Claude Code deny rules for secret files.

Accepted on purpose (checkov skips, each noted inline in `infra/`): no WAF,
no CloudFront or S3 access logs, no KMS keys, no cross-region replication, no
origin failover, no geo restriction, no S3 event notifications. The site is
public, static, and rebuilt from git, so these add cost and complexity
without reducing real risk. Revisit if a backend or a form is ever added.

## D10. Privacy: what is public

**Status:** Accepted

Public: name, title, city-level location (Toronto), work history,
skills, education, languages, email, LinkedIn, GitHub.
Never public: phone number, street address, immigration or work-permit
status, date of birth, salary. No analytics, cookies, or third-party requests.
Domain registered with WHOIS privacy protection on.

## D11. If a contact form is ever needed

**Status:** Proposed (not built)

Use a FastAPI function on AWS Lambda behind CloudFront, defined in OpenTofu,
with secrets in AWS Secrets Manager. All of these are on the resume and fit
D6 and D8. Requires a new decision entry before work starts (CSP, spam
protection, and the D9 risk review change).
