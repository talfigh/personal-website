# personal-website

Source for Ali Reza Ghiasi's personal website: a minimal, prerendered single
page built with React, TypeScript, Vite, and Tailwind CSS, hosted on AWS
(S3 + CloudFront) with infrastructure in OpenTofu and CI/CD in GitHub Actions.

```sh
npm ci            # install
npm run dev       # develop at http://localhost:5173
npm run check     # format, lint, build, and test
```

- **Content:** `src/content/resume.ts`
- **First-time setup** (GitHub, AWS, domain, deploy): [docs/SETUP.md](docs/SETUP.md)
- **Why things are the way they are:** [docs/DECISIONS.md](docs/DECISIONS.md)
- **Rules for Claude Code:** [CLAUDE.md](CLAUDE.md)

Merging to `main` deploys automatically after all checks pass.
