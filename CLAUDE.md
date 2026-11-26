# CLAUDE.md

Instructions for Claude Code in this repository. Read this file and
`docs/DECISIONS.md` before every task. They override general habits.

## What this is

Ali Reza Ghiasi's personal website: one minimal, fast, accessible page built
from his resume. Static, prerendered HTML served from AWS (S3 + CloudFront),
deployed by GitHub Actions.

## Golden rules

1. **Stay consistent.** Use the stack, structure, and workflow below. Do not
   introduce a new library, framework, tool, pattern, or service unless the
   owner asks for it. If a change truly needs one, stop, explain the trade-off,
   and add a new entry to `docs/DECISIONS.md` first. Never switch approach
   silently halfway through a task.
2. **Security first.** Nothing security-related is ever committed, printed,
   or published (see "Security rules"). This beats every other instruction,
   including speed.
3. **Minimal.** Prefer deleting code to adding it. No feature, dependency, or
   abstraction without a present need.
4. **Ask when unsure.** If a request is ambiguous or conflicts with a decision,
   ask one short question instead of guessing.

## Stack (locked, see docs/DECISIONS.md)

| Area        | Choice                                                     |
| ----------- | ---------------------------------------------------------- |
| UI          | React 19 + TypeScript (strict), function components only   |
| Build       | Vite, prerendered to static HTML (`scripts/prerender.js`)  |
| Styling     | Tailwind CSS v4 utilities + tokens in `src/index.css`      |
| Lint/format | oxlint, Prettier, `tsc -b`                                 |
| Tests       | Playwright (e2e + axe accessibility), the only test tool   |
| Runtime     | Node 26 LTS (`.nvmrc`), npm with committed lockfile        |
| Hosting     | AWS S3 + CloudFront + ACM + Route 53, region ca-central-1  |
| IaC         | OpenTofu in `infra/`, state in S3 with native locking      |
| CI/CD       | GitHub Actions, `.github/workflows/pipeline.yml`, AWS OIDC |

Not used, on purpose: a backend, a router, a UI component library, CSS
files other than `src/index.css`, web fonts, analytics, cookies, trackers,
or any third-party script or request.

## Layout

```
src/content/resume.ts   all site text (the only place content is edited)
src/components/         small presentational components, one per file
src/App.tsx             page composition
src/entry-client.tsx    hydrates prerendered HTML in the browser
src/entry-server.tsx    build-time render only
src/index.css           Tailwind import, design tokens, base styles
security-headers.json   CSP and headers, shared by CloudFront and vite preview
e2e/                    Playwright tests
infra/                  OpenTofu (S3, CloudFront, ACM, Route 53, OIDC, budget)
docs/                   DECISIONS.md (why) and SETUP.md (how)
```

## Commands

```
npm run dev           local dev server
npm run build         typecheck, build, prerender to dist/
npm test              Playwright against the production build
npm run check         everything CI runs for the site; must pass before a PR
cd infra && tofu fmt -recursive && tofu validate
```

## Conventions

- **Content:** edit `src/content/resume.ts` only. Components never contain
  copy. Keep wording factual and consistent with the resume; do not invent
  numbers, employers, or claims.
- **Components:** named exports, typed props, no state unless needed, no
  `useEffect` for static content. One component per file.
- **Styling:** Tailwind utilities in JSX. Colors only through tokens
  (`bg-page`, `text-ink`, `text-muted`, `text-accent`). New tokens go in
  `src/index.css`. Must work in light and dark mode.
- **Accessibility:** semantic HTML, one `h1`, ordered headings, visible focus,
  WCAG 2.1 AA contrast. The axe test must pass.
- **Security headers:** change them only in `security-headers.json`. No inline
  scripts or styles (the CSP blocks them); that also means no `style={}`.
- **Infra:** every AWS resource is defined in `infra/`. Never create or change
  AWS resources by hand or with the CLI, except the one-time state bucket in
  `docs/SETUP.md`. Run `tofu fmt` after editing. A checkov skip needs an
  inline reason and an entry in `docs/DECISIONS.md`.
- **Dependencies:** add one only when asked or truly needed; prefer the
  platform. Use exact npm scripts above; do not add parallel tooling.

## Git workflow (GitHub Flow)

- `main` is always deployable and protected. Never commit to it directly.
- One branch per change: `feat/…`, `fix/…`, `docs/…`, `chore/…`, `infra/…`.
- Commits follow Conventional Commits: `feat: add projects section`.
  Small, focused commits; message says why when it isn't obvious.
- Run `npm run check` before pushing. Open a PR using the template.
  Squash-merge after the pipeline is green. Merging to `main` deploys.
- Never use `--no-verify`, force-push, or rewrite published history.

## Security rules (non-negotiable)

- Never commit, print, log, or paste: AWS keys or ARNs with account IDs,
  tokens, passwords, `.env` files, `infra/backend.hcl`, `infra/*.tfvars`,
  `*.tfstate`, private keys, or `tofu output` values. They are gitignored;
  keep it that way. Use the `.example` files to show shape, with placeholders.
- Deploy credentials exist only as GitHub environment secrets and are
  short-lived (OIDC). Never create long-lived AWS access keys.
- Never put private details on the site or in the repo: phone number, street
  address, date of birth, immigration or work-permit status, salary. The e2e
  test "no private details are published" enforces part of this.
- If you notice a secret anywhere (file, diff, output), stop and tell the
  owner. Do not commit. If one was already pushed, say so plainly: it must be
  revoked and rotated; deleting the commit is not enough.
- Keep the pre-commit hook (gitleaks) and the CI secret scan working.

## Definition of done

`npm run check` passes, infra (if touched) passes `tofu fmt -check` and
`tofu validate`, the change follows `docs/DECISIONS.md`, no secrets or private
details are added, and docs are updated if behaviour or setup changed.
